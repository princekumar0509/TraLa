'use client';

import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
    className?: string;
    count?: number;
}

export function SkeletonBlock({ className }: { className?: string }) {
    return (
        <div className={cn('animate-pulse bg-gray-200 rounded-xl', className)} />
    );
}

export function LabourerCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse">
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-3" />
                    <div className="h-6 bg-gray-200 rounded-full w-24" />
                </div>
                <div className="w-8 h-8 bg-gray-200 rounded-xl flex-shrink-0" />
            </div>
        </div>
    );
}

export function AttendanceCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl flex-shrink-0" />
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded-lg w-2/3 mb-2" />
                    <div className="h-4 bg-gray-200 rounded-lg w-1/3" />
                </div>
            </div>
            <div className="flex gap-2">
                <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
            </div>
        </div>
    );
}

export function SummaryCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-4">
            <div className="bg-gray-200 animate-pulse rounded-3xl h-48" />
            <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                    <SummaryCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

export default function LoadingSkeleton({ className, count = 3 }: LoadingSkeletonProps) {
    return (
        <div className={cn('space-y-3', className)}>
            {[...Array(count)].map((_, i) => (
                <LabourerCardSkeleton key={i} />
            ))}
        </div>
    );
}
