'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Users,
    ClipboardCheck,
    ChevronRight,
    UserCircle,
    LogOut,
    RefreshCw,
    TrendingUp,
    Clock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import { useDashboard } from '@/hooks/useDashboard';
import SummaryCard, { WageSummaryCard } from '@/components/dashboard/SummaryCard';
import { DashboardSkeleton } from '@/components/ui/LoadingSkeleton';
import BottomNav from '@/components/layout/BottomNav';
import { getISTDate, formatDisplayDate } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

export default function DashboardPage() {
    const { user } = useUser();
    const router = useRouter();
    const { summary, loading, fetchDashboard } = useDashboard();
    const today = getISTDate();

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const firstName =
        user?.user_metadata?.full_name?.split(' ')[0] ||
        user?.user_metadata?.name?.split(' ')[0] ||
        user?.phone ||
        user?.email?.split('@')[0] ||
        'there';

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/sign-in');
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 px-4 pt-14 pb-12">
                <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <img src="/logo.svg" alt="TraLa" className="w-10 h-10 rounded-xl" />
                            <span className="text-white font-bold text-lg">{APP_NAME}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={fetchDashboard}
                                id="refresh-dashboard"
                                className="p-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
                            >
                                <RefreshCw size={18} />
                            </button>
                            <button
                                onClick={handleSignOut}
                                id="sign-out-btn"
                                className="p-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Greeting */}
                    <div className="mb-4">
                        <p className="text-indigo-200 text-sm">Good day,</p>
                        <h1 className="text-white text-2xl font-bold capitalize">{firstName} 👋</h1>
                        <p className="text-indigo-200 text-sm mt-1 flex items-center gap-1.5">
                            <Clock size={13} />
                            {formatDisplayDate(today)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-4 max-w-lg mx-auto">
                {loading ? (
                    <DashboardSkeleton />
                ) : (
                    <div className="space-y-4 animate-fade-in">
                        {/* Wage Summary */}
                        <WageSummaryCard totalWage={summary?.total_wage || 0} />

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <SummaryCard
                                label="Total Labourers"
                                value={summary?.total || 0}
                                icon={<Users size={20} className="text-indigo-600" />}
                                colorClass="text-indigo-600"
                                bgClass="bg-indigo-50"
                            />
                            <SummaryCard
                                label="Present Today"
                                value={summary?.present || 0}
                                icon={<TrendingUp size={20} className="text-green-600" />}
                                colorClass="text-green-600"
                                bgClass="bg-green-50"
                                subtext={`${summary?.total ? Math.round(((summary?.present || 0) / summary.total) * 100) : 0}% attendance`}
                            />
                            <SummaryCard
                                label="Absent Today"
                                value={summary?.absent || 0}
                                icon={<UserCircle size={20} className="text-red-500" />}
                                colorClass="text-red-500"
                                bgClass="bg-red-50"
                            />
                            <SummaryCard
                                label="Unmarked"
                                value={summary?.unmarked || 0}
                                icon={<Clock size={20} className="text-amber-500" />}
                                colorClass="text-amber-500"
                                bgClass="bg-amber-50"
                                subtext={summary?.unmarked ? 'Still pending' : 'All marked!'}
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="pt-2">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</p>
                            <div className="space-y-3">
                                <Link
                                    href="/attendance"
                                    id="mark-attendance-btn"
                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-md shadow-green-200 hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                            <ClipboardCheck size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">Mark Today&apos;s Attendance</p>
                                            <p className="text-green-100 text-xs">
                                                {summary?.unmarked ? `${summary.unmarked} workers pending` : 'All marked for today'}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-white/70" />
                                </Link>

                                <Link
                                    href="/labourers"
                                    id="manage-labourers-btn"
                                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                            <Users size={20} className="text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 font-semibold">Manage Labourers</p>
                                            <p className="text-gray-500 text-xs">{summary?.total || 0} active workers</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-400" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
