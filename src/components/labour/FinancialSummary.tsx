'use client';

import { IndianRupee, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface FinancialSummaryProps {
    totalEarned: number;
    totalPaid: number;
    balanceDue: number;
}

export default function FinancialSummary({ totalEarned, totalPaid, balanceDue }: FinancialSummaryProps) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {/* Total Earned */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-center">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <IndianRupee size={16} className="text-green-600" />
                </div>
                <p className="text-lg font-bold text-green-700">{formatCurrency(totalEarned)}</p>
                <p className="text-xs text-green-600 font-medium mt-0.5">Total Earned</p>
            </div>

            {/* Total Paid */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 size={16} className="text-blue-600" />
                </div>
                <p className="text-lg font-bold text-blue-700">{formatCurrency(totalPaid)}</p>
                <p className="text-xs text-blue-600 font-medium mt-0.5">Total Paid</p>
            </div>

            {/* Balance Due */}
            <div
                className={cn(
                    'border rounded-2xl p-3 text-center',
                    balanceDue > 0
                        ? 'bg-red-50 border-red-200 animate-pulse-subtle'
                        : 'bg-green-50 border-green-200'
                )}
            >
                <div
                    className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2',
                        balanceDue > 0 ? 'bg-red-100' : 'bg-green-100'
                    )}
                >
                    <AlertTriangle
                        size={16}
                        className={balanceDue > 0 ? 'text-red-500' : 'text-green-600'}
                    />
                </div>
                <p
                    className={cn(
                        'text-lg font-bold',
                        balanceDue > 0 ? 'text-red-600' : 'text-green-700'
                    )}
                >
                    {formatCurrency(Math.abs(balanceDue))}
                </p>
                <p
                    className={cn(
                        'text-xs font-medium mt-0.5',
                        balanceDue > 0 ? 'text-red-500' : 'text-green-600'
                    )}
                >
                    {balanceDue > 0 ? 'Balance Due' : 'All Paid'}
                </p>
            </div>
        </div>
    );
}
