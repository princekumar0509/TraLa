'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    backHref?: string;
    action?: ReactNode;
    className?: string;
}

export default function PageHeader({
    title,
    subtitle,
    showBack = false,
    backHref,
    action,
    className,
}: PageHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (backHref) router.push(backHref);
        else router.back();
    };

    return (
        <div className={cn('px-4 pt-14 pb-4 bg-white sticky top-0 z-30 border-b border-gray-100', className)}>
            <div className="flex items-center gap-3 max-w-lg mx-auto">
                {showBack && (
                    <button
                        onClick={handleBack}
                        id="page-header-back"
                        className="p-2.5 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors -ml-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    >
                        <ArrowLeft size={22} className="text-gray-700" />
                    </button>
                )}
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-gray-500 truncate mt-0.5">{subtitle}</p>
                    )}
                </div>
                {action && <div className="flex-shrink-0">{action}</div>}
            </div>
        </div>
    );
}
