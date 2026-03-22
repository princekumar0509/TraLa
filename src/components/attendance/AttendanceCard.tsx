'use client';

import { Labourer, AttendanceStatus } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import { WORKER_TYPE_COLORS } from '@/lib/constants';
import { CheckCircle2, XCircle, Briefcase } from 'lucide-react';

interface AttendanceCardProps {
    labourer: Labourer;
    status: AttendanceStatus | null;
    onStatusChange: (labourId: string, status: AttendanceStatus) => void;
}

export default function AttendanceCard({ labourer, status, onStatusChange }: AttendanceCardProps) {
    const initials = labourer.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div
            className={cn(
                'rounded-2xl p-4 border-2 transition-all duration-200 shadow-sm',
                status === 'present' && 'border-green-300 bg-green-50',
                status === 'absent' && 'border-red-200 bg-red-50',
                !status && 'border-gray-100 bg-white'
            )}
        >
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
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{labourer.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1', WORKER_TYPE_COLORS[labourer.worker_type])}>
                            <Briefcase size={9} />
                            {labourer.worker_type}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-0.5">
                            {formatCurrency(labourer.daily_wage)}
                        </span>
                    </div>
                </div>

                {/* Status indicator */}
                {status === 'present' && (
                    <CheckCircle2 size={24} className="text-green-500 flex-shrink-0" />
                )}
                {status === 'absent' && (
                    <XCircle size={24} className="text-red-400 flex-shrink-0" />
                )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
                <button
                    onClick={() => onStatusChange(labourer.id, 'present')}
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
                    onClick={() => onStatusChange(labourer.id, 'absent')}
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
        </div>
    );
}
