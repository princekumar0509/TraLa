'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DailySummary } from '@/types';
import { getISTDate } from '@/lib/utils';

export function useDashboard() {
    const [summary, setSummary] = useState<DailySummary | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        try {
            const today = getISTDate();

            const [labourersRes, attendanceRes] = await Promise.all([
                supabase
                    .from('labourers')
                    .select('id', { count: 'exact' })
                    .eq('is_active', true),
                supabase
                    .from('attendance')
                    .select('status, wage_amount')
                    .eq('date', today),
            ]);

            const total = labourersRes.count || 0;
            const records: { status: string; wage_amount: number | null }[] = attendanceRes.data || [];
            const present = records.filter((r) => r.status === 'present').length;
            const absent = records.filter((r) => r.status === 'absent').length;
            const unmarked = total - (present + absent);
            const total_wage = records
                .filter((r) => r.status === 'present')
                .reduce((sum: number, r) => sum + (r.wage_amount || 0), 0);

            setSummary({ total, present, absent, unmarked, total_wage });
        } catch {
            setSummary(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return { summary, loading, fetchDashboard };
}
