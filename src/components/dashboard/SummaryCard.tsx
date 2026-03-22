'use client';

import { cn, formatCurrency } from '@/lib/utils';
import { ReactNode } from 'react';

interface SummaryCardProps {
    label: string;
    value: string | number;
    icon: ReactNode;
    colorClass?: string;
    bgClass?: string;
    subtext?: string;
}

export default function SummaryCard({
    label,
    value,
    icon,
    colorClass = 'text-gray-900',
    bgClass = 'bg-indigo-50',
    subtext,
}: SummaryCardProps) {
    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                    <p className={cn('text-2xl font-bold', colorClass)}>{value}</p>
                    {subtext && <p className="text-xs text-gray-400 mt-0.5 truncate">{subtext}</p>}
                </div>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bgClass)}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export function WageSummaryCard({ totalWage }: { totalWage: number }) {
    return (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200">
            <p className="text-indigo-200 text-sm font-medium uppercase tracking-wide mb-1">Total Wage Payable Today</p>
            <p className="text-3xl font-bold">{formatCurrency(totalWage)}</p>
            <p className="text-indigo-200 text-xs mt-1">For present workers</p>
        </div>
    );
}
