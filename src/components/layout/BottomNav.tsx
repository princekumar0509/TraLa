'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ClipboardCheck, History } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    {
        href: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        id: 'nav-dashboard',
    },
    {
        href: '/labourers',
        label: 'Labourers',
        icon: Users,
        id: 'nav-labourers',
    },
    {
        href: '/attendance',
        label: 'Attendance',
        icon: ClipboardCheck,
        id: 'nav-attendance',
    },
    {
        href: '/history',
        label: 'History',
        icon: History,
        id: 'nav-history',
    },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 pb-safe">
            <div className="flex items-center justify-around py-2 max-w-lg mx-auto">
                {navItems.map(({ href, label, icon: Icon, id }) => {
                    const isActive = pathname === href || pathname.startsWith(href + '/');
                    return (
                        <Link
                            key={href}
                            href={href}
                            id={id}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-2xl transition-all duration-200 min-w-[64px] min-h-[52px]',
                                isActive
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 active:bg-gray-100'
                            )}
                        >
                            <Icon
                                size={22}
                                strokeWidth={isActive ? 2.5 : 1.8}
                                className={cn('transition-all duration-200', isActive && 'scale-110')}
                            />
                            <span
                                className={cn(
                                    'text-xs font-medium transition-all duration-200',
                                    isActive ? 'font-semibold' : ''
                                )}
                            >
                                {label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
