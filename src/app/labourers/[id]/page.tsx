'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
    Phone,
    IndianRupee,
    Briefcase,
    Calendar,
    Plus,
    Trash2,
    CheckCircle2,
    XCircle,
    Clock,
    TrendingUp,
} from 'lucide-react';
import { useLabourProfile } from '@/hooks/useLabourProfile';
import { Payment } from '@/types';
import FinancialSummary from '@/components/labour/FinancialSummary';
import PaymentBottomSheet from '@/components/labour/PaymentBottomSheet';
import AttendanceTimeline from '@/components/labour/AttendanceTimeline';
import ConfirmModal from '@/components/ui/ConfirmModal';
import PageHeader from '@/components/layout/PageHeader';
import BottomNav from '@/components/layout/BottomNav';
import { SkeletonBlock } from '@/components/ui/LoadingSkeleton';
import { WORKER_TYPE_COLORS } from '@/lib/constants';
import { cn, formatCurrency, formatPhoneForDisplay, formatShortDate } from '@/lib/utils';

function ProfileSkeleton() {
    return (
        <div className="space-y-4 animate-pulse px-4 pt-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
                    <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2" />
                        <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                    <SkeletonBlock key={i} className="h-20" />
                ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                    <SkeletonBlock key={i} className="h-28" />
                ))}
            </div>
            <SkeletonBlock className="h-40" />
        </div>
    );
}

function AttendanceRing({ percentage }: { percentage: number }) {
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-12 h-12 mx-auto">
            <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
                <circle cx="22" cy="22" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-indigo-600">
                {percentage}%
            </span>
        </div>
    );
}

export default function LabourerProfilePage() {
    const { id } = useParams<{ id: string }>();
    const {
        labourer,
        attendanceRecords,
        payments,
        attendanceSummary,
        financials,
        loading,
        addPayment,
        deletePayment,
    } = useLabourProfile(id);

    const [showPaymentSheet, setShowPaymentSheet] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        try {
            await deletePayment(deleteTarget.id);
        } catch {
            // handled in hook
        } finally {
            setDeleteTarget(null);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <PageHeader title="Loading..." showBack backHref="/labourers" />
                <ProfileSkeleton />
                <BottomNav />
            </div>
        );
    }

    if (!labourer) {
        return (
            <div className="page-container">
                <PageHeader title="Not Found" showBack backHref="/labourers" />
                <div className="text-center py-20 px-4">
                    <p className="text-gray-500 font-medium">Labourer not found</p>
                </div>
                <BottomNav />
            </div>
        );
    }

    const initials = labourer.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="page-container">
            <PageHeader title={labourer.name} showBack backHref="/labourers" />

            <div className="px-4 pt-4 pb-6 max-w-lg mx-auto space-y-5">
                {/* Section 1: Profile Header */}
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
                            <span className="text-white font-bold text-xl">{initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-bold text-gray-900 truncate">{labourer.name}</h2>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span
                                    className={cn(
                                        'text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1',
                                        WORKER_TYPE_COLORS[labourer.worker_type]
                                    )}
                                >
                                    <Briefcase size={10} />
                                    {labourer.worker_type}
                                </span>
                                <span
                                    className={cn(
                                        'text-xs font-medium px-2.5 py-1 rounded-full',
                                        labourer.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                    )}
                                >
                                    {labourer.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <IndianRupee size={15} className="text-green-600 flex-shrink-0" />
                            <span className="font-medium">{formatCurrency(labourer.daily_wage)}/day</span>
                        </div>
                        {labourer.phone && (
                            <a
                                href={`tel:${labourer.phone}`}
                                className="flex items-center gap-3 text-sm text-indigo-600 hover:text-indigo-700"
                            >
                                <Phone size={15} className="flex-shrink-0" />
                                <span className="font-medium">{formatPhoneForDisplay(labourer.phone)}</span>
                            </a>
                        )}
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <Calendar size={15} className="flex-shrink-0" />
                            <span>Joined {formatShortDate(labourer.created_at.split('T')[0])}</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Summary Stats */}
                <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm text-center">
                        <Clock size={16} className="text-gray-400 mx-auto mb-1" />
                        <p className="text-xl font-bold text-gray-900">{attendanceSummary.total}</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">Total Days</p>
                    </div>
                    <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm text-center">
                        <CheckCircle2 size={16} className="text-green-500 mx-auto mb-1" />
                        <p className="text-xl font-bold text-green-600">{attendanceSummary.present}</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">Present</p>
                    </div>
                    <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm text-center">
                        <XCircle size={16} className="text-red-400 mx-auto mb-1" />
                        <p className="text-xl font-bold text-red-500">{attendanceSummary.absent}</p>
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">Absent</p>
                    </div>
                    <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm text-center">
                        <TrendingUp size={16} className="text-indigo-500 mx-auto mb-1" />
                        <AttendanceRing percentage={attendanceSummary.percentage} />
                        <p className="text-[10px] text-gray-500 font-medium mt-0.5">Attendance</p>
                    </div>
                </div>

                {/* Section 3: Payment Tracker */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                            Payment Tracker
                        </h3>
                        <button
                            onClick={() => setShowPaymentSheet(true)}
                            className="flex items-center gap-1.5 py-2 px-3.5 bg-indigo-600 text-white rounded-xl font-semibold text-xs hover:bg-indigo-700 active:bg-indigo-800 transition-colors min-h-[36px]"
                        >
                            <Plus size={14} />
                            Record Payment
                        </button>
                    </div>

                    <FinancialSummary
                        totalEarned={financials.totalEarned}
                        totalPaid={financials.totalPaid}
                        balanceDue={financials.balanceDue}
                    />

                    {/* Payment History List */}
                    <div className="mt-4">
                        {payments.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-gray-500 font-medium text-sm">No payments recorded yet</p>
                                <p className="text-gray-400 text-xs mt-1">Tap + to add a payment</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                                {payments.map((payment) => (
                                    <div key={payment.id} className="flex items-center gap-3 px-4 py-3">
                                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <IndianRupee size={16} className="text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(Number(payment.amount))}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {formatShortDate(payment.payment_date)}
                                                {payment.note && ` — ${payment.note}`}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setDeleteTarget(payment)}
                                            className="p-2 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                                        >
                                            <Trash2 size={15} className="text-red-400" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 4: Attendance History */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Attendance History
                    </h3>
                    <AttendanceTimeline
                        records={attendanceRecords}
                        dailyWage={labourer.daily_wage}
                    />
                </div>
            </div>

            {/* Payment Bottom Sheet */}
            <PaymentBottomSheet
                isOpen={showPaymentSheet}
                labourerName={labourer.name}
                onClose={() => setShowPaymentSheet(false)}
                onSave={addPayment}
            />

            {/* Delete Payment Confirmation */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Payment"
                message={
                    deleteTarget
                        ? `Delete this payment of ${formatCurrency(Number(deleteTarget.amount))} on ${formatShortDate(deleteTarget.payment_date)}?`
                        : ''
                }
                confirmLabel="Yes, Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
            />

            <BottomNav />
        </div>
    );
}
