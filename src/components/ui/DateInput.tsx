'use client';

import { cn } from '@/lib/utils';

interface DateInputProps {
    id?: string;
    value: string; // YYYY-MM-DD
    onChange: (value: string) => void;
    min?: string;
    max?: string;
    className?: string;
}

function toDisplay(iso: string): string {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}

export default function DateInput({ id, value, onChange, min, max, className }: DateInputProps) {
    return (
        <div className="relative flex-1 overflow-hidden">
            {/* DD/MM/YYYY display underneath */}
            <div
                className={cn(
                    'py-3.5 text-gray-900 text-base',
                    className
                )}
            >
                {toDisplay(value) || 'DD/MM/YYYY'}
            </div>

            {/* Real native input on top, text invisible but fully interactive */}
            <input
                id={id}
                type="date"
                value={value}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                style={{ color: 'transparent', WebkitTextFillColor: 'transparent' }}
                className={cn(
                    'absolute inset-0 w-full h-full bg-transparent outline-none cursor-pointer',
                    '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
                    '[&::-webkit-calendar-picker-indicator]:absolute',
                    '[&::-webkit-calendar-picker-indicator]:inset-0',
                    '[&::-webkit-calendar-picker-indicator]:w-full',
                    '[&::-webkit-calendar-picker-indicator]:h-full',
                    '[&::-webkit-calendar-picker-indicator]:opacity-0',
                )}
            />
        </div>
    );
}
