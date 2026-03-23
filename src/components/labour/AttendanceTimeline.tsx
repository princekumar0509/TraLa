'use client';

import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Filter, Sun, Moon } from 'lucide-react';
import { AttendanceRecord } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AttendanceTimelineProps {
    records: AttendanceRecord[];
}

interface DateGroup {
    date: string;
    day?: AttendanceRecord;
    night?: AttendanceRecord;
}

function getMonthOptions(records: AttendanceRecord[]): { label: string; value: string }[] {
    const months = new Set<string>();
    records.forEach((r) => {
        const [year, month] = r.date.split('-');
        months.add(`${year}-${month}`);
    });
    const sorted = Array.from(months).sort((a, b) => b.localeCompare(a));
    return [
        { label: 'All Months', value: 'all' },
        ...sorted.map((m) => {
            const [y, mo] = m.split('-');
            const date = new Date(Number(y), Number(mo) - 1, 1);
            return {
                label: date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
                value: m,
            };
        }),
    ];
}

function formatTimelineDate(dateStr: string): string {
    const [year, month, dayNum] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, dayNum);
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AttendanceTimeline({ records }: AttendanceTimelineProps) {
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent'>('all');

    const monthOptions = useMemo(() => getMonthOptions(records), [records]);

    const filtered = useMemo(() => {
        return records.filter((r) => {
            if (selectedMonth !== 'all') {
                const [year, month] = r.date.split('-');
                if (`${year}-${month}` !== selectedMonth) return false;
            }
            if (statusFilter !== 'all' && r.status !== statusFilter) return false;
            return true;
        });
    }, [records, selectedMonth, statusFilter]);

    // Group by date
    const groupedEntries = useMemo(() => {
        const grouped: Record<string, DateGroup> = {};
        filtered.forEach((r) => {
            if (!grouped[r.date]) grouped[r.date] = { date: r.date };
            if (r.shift === 'night') grouped[r.date].night = r;
            else grouped[r.date].day = r;
        });
        return Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));
    }, [filtered]);

    const monthSummary = useMemo(() => {
        const presentDates = new Set<string>();
        let totalEarned = 0;
        let absentCount = 0;

        filtered.forEach((r) => {
            if (r.status === 'present') {
                presentDates.add(r.date);
                totalEarned += r.wage_amount || 0;
            } else {
                absentCount++;
            }
        });

        return { presentDays: presentDates.size, absent: absentCount, earned: totalEarned };
    }, [filtered]);

    const totalWage = (g: DateGroup) =>
        (g.day?.status === 'present' ? g.day.wage_amount || 0 : 0) +
        (g.night?.status === 'present' ? g.night.wage_amount || 0 : 0);

    return (
        <div>
            {/* Filters */}
            <div className="flex gap-2 mb-4">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 border-2 border-transparent focus-within:border-indigo-300 transition-colors">
                    <Filter size={14} className="text-gray-400 flex-shrink-0" />
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="flex-1 py-2.5 bg-transparent text-sm text-gray-700 outline-none appearance-none cursor-pointer"
                    >
                        {monthOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex bg-gray-100 rounded-xl p-0.5">
                    {(['all', 'present', 'absent'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={cn(
                                'px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors',
                                statusFilter === s
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500'
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            {groupedEntries.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 font-medium">No attendance recorded yet</p>
                    <p className="text-gray-400 text-sm mt-1">Records will appear here once attendance is marked</p>
                </div>
            ) : (
                <div className="relative">
                    <div className="absolute left-[23px] top-3 bottom-3 w-0.5 bg-gray-200" />

                    <div className="space-y-1">
                        {groupedEntries.map((group) => {
                            const wage = totalWage(group);
                            const hasPresent = group.day?.status === 'present' || group.night?.status === 'present';

                            return (
                                <div key={group.date} className="flex items-start gap-3 relative pl-1">
                                    {/* Dot */}
                                    <div
                                        className={cn(
                                            'w-[14px] h-[14px] rounded-full border-2 flex-shrink-0 z-10 ml-[16px] mt-3',
                                            hasPresent
                                                ? 'bg-green-500 border-green-300'
                                                : 'bg-red-400 border-red-300'
                                        )}
                                    />

                                    {/* Content */}
                                    <div className="flex-1 bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {formatTimelineDate(group.date)}
                                                </p>
                                                <div className="flex gap-1.5 mt-1.5 flex-wrap">
                                                    {group.day && (
                                                        <span className={cn(
                                                            'text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-0.5',
                                                            group.day.status === 'present'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-600'
                                                        )}>
                                                            <Sun size={10} />
                                                            Day: {group.day.status}
                                                        </span>
                                                    )}
                                                    {group.night && (
                                                        <span className={cn(
                                                            'text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-0.5',
                                                            group.night.status === 'present'
                                                                ? 'bg-indigo-100 text-indigo-700'
                                                                : 'bg-gray-100 text-gray-500'
                                                        )}>
                                                            <Moon size={10} />
                                                            Night: {group.night.status}
                                                            {group.night.hours_worked ? ` (${group.night.hours_worked}h)` : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className={cn(
                                                'text-sm font-bold flex-shrink-0 ml-2',
                                                wage > 0 ? 'text-green-600' : 'text-gray-400'
                                            )}>
                                                {wage > 0 ? formatCurrency(wage) : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Period Summary */}
            {groupedEntries.length > 0 && (
                <div className="mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Period Summary
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <CheckCircle2 size={13} className="text-green-500" />
                                <span className="text-xs text-gray-500">Present</span>
                            </div>
                            <p className="text-lg font-bold text-green-600">{monthSummary.presentDays} days</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <XCircle size={13} className="text-red-400" />
                                <span className="text-xs text-gray-500">Absent</span>
                            </div>
                            <p className="text-lg font-bold text-red-500">{monthSummary.absent}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">Earned</p>
                            <p className="text-lg font-bold text-indigo-600">{formatCurrency(monthSummary.earned)}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
