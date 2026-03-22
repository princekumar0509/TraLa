'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Phone, Briefcase, ChevronRight } from 'lucide-react';
import { Labourer } from '@/types';
import { cn, formatCurrency, formatPhoneForDisplay } from '@/lib/utils';
import { WORKER_TYPE_COLORS } from '@/lib/constants';

interface LabourCardProps {
    labourer: Labourer;
    onEdit: (labourer: Labourer) => void;
    onDelete: (labourer: Labourer) => void;
}

export default function LabourCard({ labourer, onEdit, onDelete }: LabourCardProps) {
    const [pressed, setPressed] = useState(false);
    const router = useRouter();
    const initials = labourer.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const handleCardTap = () => {
        router.push(`/labourers/${labourer.id}`);
    };

    return (
        <div
            className={cn(
                'bg-white rounded-2xl p-4 border border-gray-100 shadow-sm transition-all duration-150 cursor-pointer',
                pressed && 'scale-[0.98]'
            )}
            onTouchStart={() => setPressed(true)}
            onTouchEnd={() => setPressed(false)}
            onClick={handleCardTap}
        >
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
                    <span className="text-white font-bold text-base">{initials}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{labourer.name}</h3>

                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span
                            className={cn(
                                'text-xs font-medium px-2.5 py-1 rounded-full',
                                WORKER_TYPE_COLORS[labourer.worker_type]
                            )}
                        >
                            <span className="flex items-center gap-1">
                                <Briefcase size={10} />
                                {labourer.worker_type}
                            </span>
                        </span>

                        <span className="flex items-center gap-1 text-sm text-gray-600 font-medium">
                            {formatCurrency(labourer.daily_wage)}/day
                        </span>
                    </div>

                    {labourer.phone && (
                        <a
                            href={`tel:${labourer.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 mt-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            <Phone size={13} />
                            {formatPhoneForDisplay(labourer.phone)}
                        </a>
                    )}

                    <p className="text-[10px] text-gray-400 mt-2">Tap to view full track record</p>
                </div>

                {/* Actions + Chevron */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(labourer); }}
                        id={`edit-labourer-${labourer.id}`}
                        className="p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                    >
                        <Pencil size={16} className="text-indigo-600" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(labourer); }}
                        id={`delete-labourer-${labourer.id}`}
                        className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 active:bg-red-200 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                    >
                        <Trash2 size={16} className="text-red-500" />
                    </button>
                    <ChevronRight size={16} className="text-gray-300 mt-1" />
                </div>
            </div>
        </div>
    );
}
