'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Labourer, WorkerType } from '@/types';
import toast from 'react-hot-toast';

export function useLabourers() {
    const [labourers, setLabourers] = useState<Labourer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLabourers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error: err } = await supabase
                .from('labourers')
                .select('*')
                .eq('is_active', true)
                .order('name', { ascending: true });

            if (err) throw err;
            setLabourers(data || []);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Failed to fetch labourers';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLabourers();
    }, [fetchLabourers]);

    const addLabourer = useCallback(
        async (data: {
            name: string;
            phone?: string;
            worker_type: WorkerType;
            daily_wage: number;
            night_hourly_rate?: number;
        }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data: inserted, error: err } = await supabase
                .from('labourers')
                .insert({
                    ...data,
                    supervisor_id: user.id,
                    is_active: true,
                })
                .select()
                .single();

            if (err) throw err;
            setLabourers((prev) => [...prev, inserted].sort((a, b) => a.name.localeCompare(b.name)));
            return inserted;
        },
        []
    );

    const updateLabourer = useCallback(
        async (
            id: string,
            data: Partial<Pick<Labourer, 'name' | 'phone' | 'worker_type' | 'daily_wage' | 'night_hourly_rate'>>
        ) => {
            const { data: updated, error: err } = await supabase
                .from('labourers')
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (err) throw err;
            setLabourers((prev) =>
                prev.map((l) => (l.id === id ? updated : l)).sort((a, b) => a.name.localeCompare(b.name))
            );
            return updated;
        },
        []
    );

    const deleteLabourer = useCallback(async (id: string) => {
        const { error: err } = await supabase
            .from('labourers')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (err) throw err;
        setLabourers((prev) => prev.filter((l) => l.id !== id));
    }, []);

    return {
        labourers,
        loading,
        error,
        fetchLabourers,
        addLabourer,
        updateLabourer,
        deleteLabourer,
    };
}
