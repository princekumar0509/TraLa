'use client';

import { useEffect, useState, useCallback } from 'react';
import { ClipboardCheck, Calendar, CheckCircle2, XCircle, Sun, Moon } from 'lucide-react';
import { useLabourers } from '@/hooks/useLabourers';
import { useAttendance, calculateWage } from '@/hooks/useAttendance';
import { useAttendanceStore } from '@/store/attendanceStore';
import AttendanceCard from '@/components/attendance/AttendanceCard';
import SaveButton from '@/components/attendance/SaveButton';
import ConfirmModal from '@/components/ui/ConfirmModal';
import EmptyState from '@/components/ui/EmptyState';
import PageHeader from '@/components/layout/PageHeader';
import BottomNav from '@/components/layout/BottomNav';
import { AttendanceCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { getISTDate, formatDisplayDate, formatShortDate } from '@/lib/utils';
import { Shift, ShiftEntry } from '@/types';
import DateInput from '@/components/ui/DateInput';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AttendancePage() {
    const { labourers, loading: labourersLoading } = useLabourers();
    const { loading: saving, fetchAttendanceForDate, fetchAttendanceForDateAllShifts, saveAttendance } = useAttendance();
    const {
        selectedDate,
        selectedShift,
        statuses,
        isModifying,
        isDirty,
        otherShiftStatuses,
        setDate,
        setShift,
        setStatus,
        loadExisting,
        loadOtherShift,
    } = useAttendanceStore();

    const [showConfirm, setShowConfirm] = useState(false);
    const [loadingExisting, setLoadingExisting] = useState(false);
    const today = getISTDate();

    useEffect(() => {
        if (!selectedDate) setDate(today);
    }, [selectedDate, today, setDate]);

    const loadForDateAndShift = useCallback(
        async (date: string, shift: Shift) => {
            setLoadingExisting(true);
            try {
                const [current, all] = await Promise.all([
                    fetchAttendanceForDate(date, shift),
                    fetchAttendanceForDateAllShifts(date),
                ]);
                loadExisting(current);
                const otherShift = shift === 'day' ? 'night' : 'day';
                loadOtherShift(all.filter((r) => r.shift === otherShift));
            } finally {
                setLoadingExisting(false);
            }
        },
        [fetchAttendanceForDate, fetchAttendanceForDateAllShifts, loadExisting, loadOtherShift]
    );

    useEffect(() => {
        if (selectedDate) loadForDateAndShift(selectedDate, selectedShift);
    }, [selectedDate, selectedShift, loadForDateAndShift]);

    const markedCount = Object.values(statuses).filter((e) => e.status != null).length;
    const canSave = markedCount > 0 && !saving && !loadingExisting;

    const handleSave = () => {
        if (isModifying && isDirty) {
            setShowConfirm(true);
        } else if (!isModifying && markedCount > 0) {
            performSave();
        } else if (isModifying) {
            toast('No changes to save', { icon: '\u2139\uFE0F' });
        }
    };

    const performSave = async () => {
        const records = labourers
            .filter((l) => statuses[l.id]?.status != null)
            .map((l) => {
                const entry = statuses[l.id];
                const status = entry.status!;
                const wage = calculateWage(
                    l.daily_wage,
                    l.night_hourly_rate,
                    selectedShift,
                    status,
                    entry.hours_worked
                );
                return {
                    labour_id: l.id,
                    status,
                    wage_amount: wage,
                    hours_worked: selectedShift === 'night' && status === 'present' ? entry.hours_worked : undefined,
                };
            });

        if (records.length === 0) return;

        try {
            await saveAttendance(records, selectedDate, selectedShift);
            await loadForDateAndShift(selectedDate, selectedShift);
        } catch {
            // Error toast handled in hook
        }
    };

    const presentCount = Object.values(statuses).filter((e) => e.status === 'present').length;
    const absentCount = Object.values(statuses).filter((e) => e.status === 'absent').length;

    const handleEntryChange = (labourId: string, entry: ShiftEntry) => {
        setStatus(labourId, entry);
    };

    return (
        <div className="page-container">
            <PageHeader
                title="Mark Attendance"
                subtitle={selectedDate ? formatShortDate(selectedDate) : ''}
            />

            {/* Date + Shift Controls */}
            <div className="px-4 py-3 bg-white border-b border-gray-100 sticky top-[73px] z-20">
                <div className="max-w-lg mx-auto space-y-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2" htmlFor="attendance-date">
                            Select Date
                        </label>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 border-2 border-transparent focus-within:border-indigo-300 transition-colors">
                            <Calendar size={18} className="text-indigo-500 flex-shrink-0" />
                            <DateInput
                                id="attendance-date"
                                value={selectedDate}
                                onChange={(val) => { if (val <= today) setDate(val); }}
                                max={today}
                            />
                        </div>
                    </div>

                    {/* Shift Toggle */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            Shift
                        </label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShift('day')}
                                className={cn(
                                    'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 min-h-[48px]',
                                    selectedShift === 'day'
                                        ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                )}
                            >
                                <Sun size={18} />
                                Day Shift
                            </button>
                            <button
                                onClick={() => setShift('night')}
                                className={cn(
                                    'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 min-h-[48px]',
                                    selectedShift === 'night'
                                        ? 'bg-indigo-700 text-white shadow-md shadow-indigo-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                )}
                            >
                                <Moon size={18} />
                                Night Shift
                            </button>
                        </div>
                    </div>

                    {/* Summary pills */}
                    {markedCount > 0 && (
                        <div className="flex items-center gap-2">
                            {presentCount > 0 && (
                                <span className="flex items-center gap-1.5 text-xs font-medium bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                                    <CheckCircle2 size={13} /> {presentCount} Present
                                </span>
                            )}
                            {absentCount > 0 && (
                                <span className="flex items-center gap-1.5 text-xs font-medium bg-red-100 text-red-600 px-3 py-1.5 rounded-full">
                                    <XCircle size={13} /> {absentCount} Absent
                                </span>
                            )}
                            {labourers.length - markedCount > 0 && (
                                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                                    {labourers.length - markedCount} Unmarked
                                </span>
                            )}
                        </div>
                    )}

                    {isModifying && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                            <span>⚠️</span>
                            <span>Attendance already saved for {selectedShift} shift. Changes will overwrite.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pt-4 pb-36 max-w-lg mx-auto">
                {labourersLoading || loadingExisting ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <AttendanceCardSkeleton key={i} />
                        ))}
                    </div>
                ) : labourers.length === 0 ? (
                    <EmptyState
                        icon={<ClipboardCheck size={48} />}
                        title="No Labourers Added"
                        description="Add labourers first to start marking their attendance."
                        action={
                            <Link
                                href="/labourers/add"
                                id="go-add-labourers"
                                className="block w-full py-4 px-6 bg-indigo-600 text-white font-semibold rounded-2xl text-center hover:bg-indigo-700 transition-colors"
                            >
                                Add Labourers
                            </Link>
                        }
                    />
                ) : (
                    <div className="space-y-3 animate-fade-in">
                        {labourers.map((labourer) => (
                            <AttendanceCard
                                key={labourer.id}
                                labourer={labourer}
                                entry={statuses[labourer.id] || { status: null }}
                                selectedShift={selectedShift}
                                otherShiftStatus={otherShiftStatuses[labourer.id] || null}
                                onEntryChange={handleEntryChange}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Save Button */}
            {labourers.length > 0 && (
                <SaveButton
                    onClick={handleSave}
                    disabled={!canSave}
                    loading={saving}
                    markedCount={markedCount}
                    isModifying={isModifying}
                />
            )}

            {/* Modify Confirm Modal */}
            <ConfirmModal
                isOpen={showConfirm}
                title="Update Attendance?"
                message={`You are editing ${selectedShift} shift attendance for ${selectedDate ? formatDisplayDate(selectedDate) : 'this date'}. Changes will overwrite existing records. Continue?`}
                confirmLabel="Yes, Update"
                cancelLabel="Cancel"
                variant="warning"
                onConfirm={() => {
                    setShowConfirm(false);
                    performSave();
                }}
                onCancel={() => setShowConfirm(false)}
            />

            <BottomNav />
        </div>
    );
}
