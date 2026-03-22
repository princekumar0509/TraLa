'use client';

import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, Filter } from 'lucide-react';
import { AttendanceRecord } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface AttendanceTimelineProps {
    records: AttendanceRecord[];
    dailyWage: number;
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

function formatTimelineDate(dateStr: string): { day: string; month: string; weekday: string; full: string } {
    const [year, month, dayNum] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, dayNum);
    return {
        day: String(dayNum),
        month: date.toLocaleDateString('en-IN', { month: 'short' }),
        weekday: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        full: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
    };
}

export default function AttendanceTimeline({ records, dailyWage }: AttendanceTimelineProps) {
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

    const monthSummary = useMemo(() => {
        const present = filtered.filter((r) => r.status === 'present').length;
        const absent = filtered.filter((r) => r.status === 'absent').length;
        const earned = present * dailyWage;
        return { present, absent, earned };
    }, [filtered, dailyWage]);

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
            {filtered.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 font-medium">No attendance recorded yet</p>
                    <p className="text-gray-400 text-sm mt-1">Records will appear here once attendance is marked</p>
                </div>
            ) : (
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[23px] top-3 bottom-3 w-0.5 bg-gray-200" />

                    <div className="space-y-1">
                        {filtered.map((record) => {
                            const d = formatTimelineDate(record.date);
                            const isPresent = record.status === 'present';

                            return (
                                <div key={record.id} className="flex items-center gap-3 relative pl-1">
                                    {/* Dot */}
                                    <div
                                        className={cn(
                                            'w-[14px] h-[14px] rounded-full border-2 flex-shrink-0 z-10 ml-[16px]',
                                            isPresent
                                                ? 'bg-green-500 border-green-300'
                                                : 'bg-red-400 border-red-300'
                                        )}
                                    />

                                    {/* Content */}
                                    <div className="flex-1 flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{d.full}</p>
                                            <span
                                                className={cn(
                                                    'text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1',
                                                    isPresent
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-600'
                                                )}
                                            >
                                                {isPresent ? 'Present' : 'Absent'}
                                            </span>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p
                                                className={cn(
                                                    'text-sm font-bold',
                                                    isPresent ? 'text-green-600' : 'text-gray-400'
                                                )}
                                            >
                                                {isPresent ? formatCurrency(dailyWage) : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Monthly Summary Footer */}
            {filtered.length > 0 && (
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
                            <p className="text-lg font-bold text-green-600">{monthSummary.present}</p>
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
