'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAttendance } from '@/hooks/useAttendance';
import { useLabourers } from '@/hooks/useLabourers';
import PageHeader from '@/components/layout/PageHeader';
import BottomNav from '@/components/layout/BottomNav';
import EmptyState from '@/components/ui/EmptyState';
import { SkeletonBlock } from '@/components/ui/LoadingSkeleton';
import {
    History,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    XCircle,
    IndianRupee,
    Users,
    Filter,
} from 'lucide-react';
import { formatCurrency, formatShortDate, getMonthRange, getISTDate } from '@/lib/utils';
import DateInput from '@/components/ui/DateInput';
import { WORKER_TYPE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface DayEntry {
    date: string;
    present: number;
    absent: number;
    total_wage: number;
    records: Array<{
        labour_id: string;
        status: string;
        wage_amount: number;
        labourers?: { name: string; worker_type: string };
    }>;
}

export default function HistoryPage() {
    const { fetchHistory } = useAttendance();
    const { labourers } = useLabourers();
    const [entries, setEntries] = useState<DayEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedDate, setExpandedDate] = useState<string | null>(null);
    const [filterLabourerId, setFilterLabourerId] = useState<string>('all');
    const [dateFrom, setDateFrom] = useState(getMonthRange().from);
    const [dateTo, setDateTo] = useState(getMonthRange().to);
    const today = getISTDate();

    const loadHistory = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchHistory(dateFrom, dateTo);

            // Group by date
            const grouped: Record<string, DayEntry> = {};
            data.forEach((rec: typeof data[number]) => {
                if (!grouped[rec.date]) {
                    grouped[rec.date] = { date: rec.date, present: 0, absent: 0, total_wage: 0, records: [] };
                }
                grouped[rec.date].records.push(rec);
                if (rec.status === 'present') {
                    grouped[rec.date].present++;
                    grouped[rec.date].total_wage += rec.wage_amount || 0;
                } else {
                    grouped[rec.date].absent++;
                }
            });

            const sorted = Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date));
            setEntries(sorted);
        } finally {
            setLoading(false);
        }
    }, [fetchHistory, dateFrom, dateTo]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    // Monthly summary per labourer
    const monthlySummary = labourers.map((l) => {
        const allRecords = entries.flatMap((e) => e.records.filter((r) => r.labour_id === l.id));
        return {
            id: l.id,
            name: l.name,
            worker_type: l.worker_type,
            total_present: allRecords.filter((r) => r.status === 'present').length,
            total_wage: allRecords.reduce((sum, r) => sum + (r.status === 'present' ? r.wage_amount || 0 : 0), 0),
        };
    }).filter((s) => s.total_present > 0 || s.total_wage > 0);

    const filteredEntries =
        filterLabourerId === 'all'
            ? entries
            : entries.filter((e) => e.records.some((r) => r.labour_id === filterLabourerId));

    return (
        <div className="page-container">
            <PageHeader title="Attendance History" subtitle="View & analyze past records" />

            {/* Filters */}
            <div className="px-4 py-3 bg-white border-b border-gray-100 sticky top-[73px] z-20">
                <div className="max-w-lg mx-auto space-y-3">
                    {/* Date range */}
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 font-medium block mb-1">From</label>
                            <div className="bg-gray-50 border-2 border-transparent focus-within:border-indigo-300 rounded-xl px-3">
                                <DateInput
                                    id="history-date-from"
                                    value={dateFrom}
                                    max={dateTo}
                                    onChange={setDateFrom}
                                    className="py-2.5 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-gray-500 font-medium block mb-1">To</label>
                            <div className="bg-gray-50 border-2 border-transparent focus-within:border-indigo-300 rounded-xl px-3">
                                <DateInput
                                    id="history-date-to"
                                    value={dateTo}
                                    min={dateFrom}
                                    max={today}
                                    onChange={setDateTo}
                                    className="py-2.5 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Labourer filter */}
                    {labourers.length > 0 && (
                        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 border-2 border-transparent focus-within:border-indigo-300 transition-colors">
                            <Filter size={16} className="text-gray-400 flex-shrink-0" />
                            <select
                                value={filterLabourerId}
                                onChange={(e) => setFilterLabourerId(e.target.value)}
                                id="history-filter-labourer"
                                className="flex-1 py-3 bg-transparent text-sm text-gray-700 outline-none appearance-none cursor-pointer"
                            >
                                <option value="all">All Labourers</option>
                                {labourers.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-4 pt-4 pb-6 max-w-lg mx-auto">
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <SkeletonBlock key={i} className="h-20" />
                        ))}
                    </div>
                ) : filteredEntries.length === 0 ? (
                    <EmptyState
                        icon={<History size={48} />}
                        title="No Records Found"
                        description="No attendance records found for the selected date range."
                    />
                ) : (
                    <div className="space-y-3 animate-fade-in">
                        {filteredEntries.map((entry) => {
                            const isExpanded = expandedDate === entry.date;
                            const filteredRecords =
                                filterLabourerId === 'all'
                                    ? entry.records
                                    : entry.records.filter((r) => r.labour_id === filterLabourerId);

                            return (
                                <div key={entry.date} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    {/* Date Row */}
                                    <button
                                        onClick={() => setExpandedDate(isExpanded ? null : entry.date)}
                                        id={`history-date-${entry.date}`}
                                        className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors active:bg-gray-100"
                                    >
                                        {/* Date Icon */}
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex flex-col items-center justify-center flex-shrink-0">
                                            <span className="text-indigo-600 font-bold text-sm leading-none">
                                                {entry.date.split('-')[2]}
                                            </span>
                                            <span className="text-indigo-400 text-xs">
                                                {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short' })}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="font-semibold text-gray-900 text-sm">{formatShortDate(entry.date)}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                                    <CheckCircle2 size={11} /> {entry.present}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                                                    <XCircle size={11} /> {entry.absent}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-indigo-600 font-medium">
                                                    <IndianRupee size={11} /> {formatCurrency(entry.total_wage)}
                                                </span>
                                            </div>
                                        </div>

                                        {isExpanded ? (
                                            <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                                        )}
                                    </button>

                                    {/* Expanded Records */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100 divide-y divide-gray-50">
                                            {filteredRecords.map((record, idx) => {
                                                const labourer = labourers.find((l) => l.id === record.labour_id);
                                                const name = record.labourers?.name || labourer?.name || 'Unknown';
                                                const workerType = record.labourers?.worker_type || labourer?.worker_type || '';
                                                const isPresent = record.status === 'present';

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-3 px-4 py-3"
                                                    >
                                                        <div
                                                            className={cn(
                                                                'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0',
                                                                isPresent ? 'bg-green-50' : 'bg-red-50'
                                                            )}
                                                        >
                                                            {isPresent ? (
                                                                <CheckCircle2 size={18} className="text-green-500" />
                                                            ) : (
                                                                <XCircle size={18} className="text-red-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
                                                            {workerType && (
                                                                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', WORKER_TYPE_COLORS[workerType as keyof typeof WORKER_TYPE_COLORS] || 'bg-gray-100 text-gray-600')}>
                                                                    {workerType}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className={cn('text-sm font-bold', isPresent ? 'text-green-600' : 'text-gray-400')}>
                                                                {isPresent ? formatCurrency(record.wage_amount) : '—'}
                                                            </p>
                                                            <p className={cn('text-xs capitalize font-medium', isPresent ? 'text-green-500' : 'text-red-400')}>
                                                                {record.status}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Monthly Summary */}
                        {monthlySummary.length > 0 && filterLabourerId === 'all' && (
                            <div className="mt-6">
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <Users size={14} />
                                    Monthly Summary
                                </h2>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    {monthlySummary.map((s, idx) => (
                                        <div
                                            key={s.id}
                                            className={cn(
                                                'flex items-center gap-3 px-4 py-3',
                                                idx > 0 && 'border-t border-gray-50'
                                            )}
                                        >
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                                <span className="text-white text-xs font-bold">
                                                    {s.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                                                <p className="text-xs text-gray-500">{s.total_present} days present</p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-bold text-indigo-600">{formatCurrency(s.total_wage)}</p>
                                                <p className="text-xs text-gray-400">total earned</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
