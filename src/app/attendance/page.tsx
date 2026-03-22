'use client';

import { useEffect, useState, useCallback } from 'react';
import { ClipboardCheck, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { useLabourers } from '@/hooks/useLabourers';
import { useAttendance } from '@/hooks/useAttendance';
import { useAttendanceStore } from '@/store/attendanceStore';
import AttendanceCard from '@/components/attendance/AttendanceCard';
import SaveButton from '@/components/attendance/SaveButton';
import ConfirmModal from '@/components/ui/ConfirmModal';
import EmptyState from '@/components/ui/EmptyState';
import PageHeader from '@/components/layout/PageHeader';
import BottomNav from '@/components/layout/BottomNav';
import { AttendanceCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { getISTDate, formatDisplayDate, formatShortDate } from '@/lib/utils';
import { AttendanceStatus } from '@/types';
import DateInput from '@/components/ui/DateInput';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AttendancePage() {
    const { labourers, loading: labourersLoading } = useLabourers();
    const { loading: saving, fetchAttendanceForDate, saveAttendance } = useAttendance();
    const {
        selectedDate,
        statuses,
        isModifying,
        isDirty,
        setDate,
        setStatus,
        loadExisting,
    } = useAttendanceStore();

    const [showConfirm, setShowConfirm] = useState(false);
    const [loadingExisting, setLoadingExisting] = useState(false);
    const today = getISTDate();

    // Initialize date to today
    useEffect(() => {
        if (!selectedDate) {
            setDate(today);
        }
    }, [selectedDate, today, setDate]);

    // Load existing for selected date
    const loadForDate = useCallback(
        async (date: string) => {
            setLoadingExisting(true);
            try {
                const existing = await fetchAttendanceForDate(date);
                loadExisting(existing);
            } finally {
                setLoadingExisting(false);
            }
        },
        [fetchAttendanceForDate, loadExisting]
    );

    useEffect(() => {
        if (selectedDate) {
            loadForDate(selectedDate);
        }
    }, [selectedDate, loadForDate]);


    const markedCount = Object.values(statuses).filter(Boolean).length;
    const canSave = markedCount > 0 && !saving && !loadingExisting;

    const handleSave = () => {
        if (isModifying && isDirty) {
            setShowConfirm(true);
        } else if (!isModifying && markedCount > 0) {
            performSave();
        } else if (isModifying) {
            toast('No changes to save', { icon: 'ℹ️' });
        }
    };

    const performSave = async () => {
        const records = labourers
            .filter((l) => statuses[l.id] != null)
            .map((l) => ({
                labour_id: l.id,
                status: statuses[l.id] as AttendanceStatus,
                daily_wage: l.daily_wage,
            }));

        if (records.length === 0) return;

        try {
            await saveAttendance(records, selectedDate);
            // Reload existing after save
            await loadForDate(selectedDate);
        } catch {
            // Error toast handled in hook
        }
    };

    const presentCount = Object.values(statuses).filter((s) => s === 'present').length;
    const absentCount = Object.values(statuses).filter((s) => s === 'absent').length;

    return (
        <div className="page-container">
            <PageHeader
                title="Mark Attendance"
                subtitle={selectedDate ? formatShortDate(selectedDate) : ''}
            />

            {/* Date Picker */}
            <div className="px-4 py-3 bg-white border-b border-gray-100 sticky top-[73px] z-20">
                <div className="max-w-lg mx-auto">
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

                    {/* Summary pills */}
                    {markedCount > 0 && (
                        <div className="flex items-center gap-2 mt-3">
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
                        <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                            <span>⚠️</span>
                            <span>Attendance already saved for this date. Changes will overwrite existing records.</span>
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
                                status={statuses[labourer.id] || null}
                                onStatusChange={setStatus}
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
                message={`You are editing attendance for ${selectedDate ? formatDisplayDate(selectedDate) : 'this date'}. Changes will overwrite existing records. Continue?`}
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
