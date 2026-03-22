'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    action?: ReactNode;
    className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-16 px-6 text-center',
                className
            )}
        >
            {/* Illustration circle */}
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-3xl flex items-center justify-center mb-5 shadow-inner">
                <div className="text-indigo-400">{icon}</div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">{description}</p>

            {action && <div className="w-full max-w-xs">{action}</div>}
        </div>
    );
}
