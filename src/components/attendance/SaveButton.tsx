'use client';

import { Loader2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
    markedCount: number;
    isModifying: boolean;
}

export default function SaveButton({ onClick, disabled, loading, markedCount, isModifying }: SaveButtonProps) {
    return (
        <div className="fixed bottom-20 left-0 right-0 px-4 z-30 pointer-events-none">
            <div className="max-w-lg mx-auto pointer-events-auto">
                <button
                    onClick={onClick}
                    disabled={disabled || loading}
                    id="save-attendance-btn"
                    className={cn(
                        'w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 min-h-[56px] shadow-2xl',
                        !disabled && !loading
                            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-indigo-400 hover:shadow-indigo-500 hover:scale-[1.01] active:scale-[0.98]'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-gray-200'
                    )}
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Saving Attendance...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            {isModifying ? 'Update Attendance' : 'Save Attendance'}
                            {markedCount > 0 && (
                                <span
                                    className={cn(
                                        'px-2.5 py-0.5 rounded-full text-xs font-bold',
                                        !disabled ? 'bg-white/20 text-white' : 'bg-gray-300 text-gray-500'
                                    )}
                                >
                                    {markedCount}
                                </span>
                            )}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
