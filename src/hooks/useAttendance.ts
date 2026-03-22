'use client';

import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AttendanceRecord, AttendanceStatus } from '@/types';
import toast from 'react-hot-toast';

export function useAttendance() {
    const [loading, setLoading] = useState(false);

    const fetchAttendanceForDate = useCallback(
        async (date: string): Promise<AttendanceRecord[]> => {
            const { data, error } = await supabase
                .from('attendance')
                .select('*')
                .eq('date', date);

            if (error) {
                toast.error('Failed to load attendance');
                return [];
            }
            return data || [];
        },
        []
    );

    const saveAttendance = useCallback(
        async (
            records: Array<{
                labour_id: string;
                status: AttendanceStatus;
                daily_wage: number;
            }>,
            date: string
        ) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            setLoading(true);
            try {
                const upsertPayload = records.map((r) => ({
                    labour_id: r.labour_id,
                    supervisor_id: user.id,
                    date,
                    status: r.status,
                    wage_amount: r.status === 'present' ? r.daily_wage : 0,
                    updated_at: new Date().toISOString(),
                }));

                const { error } = await supabase
                    .from('attendance')
                    .upsert(upsertPayload, {
                        onConflict: 'labour_id,date',
                    });

                if (error) throw error;
                toast.success('Attendance saved successfully!');
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : 'Failed to save attendance';
                toast.error(msg);
                throw e;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const fetchHistory = useCallback(async (from: string, to: string) => {
        const { data, error } = await supabase
            .from('attendance')
            .select(`*, labourers(name, worker_type)`)
            .gte('date', from)
            .lte('date', to)
            .order('date', { ascending: false });

        if (error) {
            toast.error('Failed to load history');
            return [];
        }
        return data || [];
    }, []);

    return {
        loading,
        fetchAttendanceForDate,
        saveAttendance,
        fetchHistory,
    };
}
