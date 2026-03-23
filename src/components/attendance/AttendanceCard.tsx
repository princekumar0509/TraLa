'use client';

import { Labourer, AttendanceStatus, Shift, ShiftEntry } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import { WORKER_TYPE_COLORS } from '@/lib/constants';
import { CheckCircle2, XCircle, Briefcase, Clock } from 'lucide-react';
import { calculateWage } from '@/hooks/useAttendance';

interface AttendanceCardProps {
    labourer: Labourer;
    entry: ShiftEntry;
    selectedShift: Shift;
    otherShiftStatus?: AttendanceStatus | null;
    onEntryChange: (labourId: string, entry: ShiftEntry) => void;
}

export default function AttendanceCard({
    labourer,
    entry,
    selectedShift,
    otherShiftStatus,
    onEntryChange,
}: AttendanceCardProps) {
    const status = entry.status;
    const initials = labourer.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const showHoursInput =
        selectedShift === 'night' &&
        labourer.night_hourly_rate &&
        status === 'present';

    const liveWage = status === 'present'
        ? calculateWage(labourer.daily_wage, labourer.night_hourly_rate, selectedShift, 'present', entry.hours_worked)
        : 0;

    const handleStatusChange = (newStatus: AttendanceStatus) => {
        onEntryChange(labourer.id, {
            status: newStatus,
            hours_worked: newStatus === 'present' ? entry.hours_worked : undefined,
        });
    };

    const handleHoursChange = (hours: number | undefined) => {
        onEntryChange(labourer.id, { status: 'present', hours_worked: hours });
    };

    return (
        <div
            className={cn(
                'rounded-2xl p-4 border-2 transition-all duration-200 shadow-sm relative',
                status === 'present' && 'border-green-300 bg-green-50',
                status === 'absent' && 'border-red-200 bg-red-50',
                !status && 'border-gray-100 bg-white'
            )}
        >
            {/* Shift status pills — top right */}
            <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                {otherShiftStatus && (
                    <span className={cn(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                        selectedShift === 'day'
                            ? (otherShiftStatus === 'present' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500')
                            : (otherShiftStatus === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500')
                    )}>
                        {selectedShift === 'day' ? '🌙' : '☀️'} {otherShiftStatus}
                    </span>
                )}
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div
                    className={cn(
                        'w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-200',
                        status === 'present' && 'bg-green-500 shadow-green-200',
                        status === 'absent' && 'bg-red-400 shadow-red-200',
                        !status && 'bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-200'
                    )}
                >
                    <span className="text-white font-bold text-base">{initials}</span>
                </div>
                <div className="flex-1 min-w-0 pr-16">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{labourer.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1', WORKER_TYPE_COLORS[labourer.worker_type])}>
                            <Briefcase size={9} />
                            {labourer.worker_type}
                        </span>
                        <span className="text-xs text-gray-500">
                            {formatCurrency(labourer.daily_wage)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
                <button
                    onClick={() => handleStatusChange('present')}
                    id={`present-${labourer.id}`}
                    className={cn(
                        'flex-1 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px]',
                        status === 'present'
                            ? 'bg-green-500 text-white shadow-md shadow-green-200 scale-[0.98]'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 active:bg-green-200 border-2 border-green-200'
                    )}
                >
                    <CheckCircle2 size={16} />
                    Present
                </button>
                <button
                    onClick={() => handleStatusChange('absent')}
                    id={`absent-${labourer.id}`}
                    className={cn(
                        'flex-1 py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px]',
                        status === 'absent'
                            ? 'bg-red-500 text-white shadow-md shadow-red-200 scale-[0.98]'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200 border-2 border-red-200'
                    )}
                >
                    <XCircle size={16} />
                    Absent
                </button>
            </div>

            {/* Hours input for night shift with hourly rate */}
            {showHoursInput && (
                <div className="mt-3 flex items-center gap-3 bg-white/80 rounded-xl px-3 py-2.5 border border-indigo-200">
                    <Clock size={16} className="text-indigo-500 flex-shrink-0" />
                    <label className="text-xs font-semibold text-gray-600 whitespace-nowrap">Hours:</label>
                    <input
                        type="number"
                        value={entry.hours_worked ?? ''}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            handleHoursChange(isNaN(val) ? undefined : val);
                        }}
                        placeholder="0"
                        min="1"
                        max="12"
                        step="0.5"
                        inputMode="decimal"
                        className="w-16 py-1 px-2 bg-gray-50 rounded-lg text-sm text-gray-900 outline-none border border-gray-200 focus:border-indigo-400 text-center"
                    />
                    <span className="text-xs text-gray-500">hrs</span>
                    <div className="flex-1 text-right">
                        <span className="text-sm font-bold text-green-600">
                            {formatCurrency(liveWage)}
                        </span>
                        {entry.hours_worked && labourer.night_hourly_rate && (
                            <p className="text-[10px] text-gray-400">
                                {entry.hours_worked}h × {formatCurrency(labourer.night_hourly_rate)}/hr
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
