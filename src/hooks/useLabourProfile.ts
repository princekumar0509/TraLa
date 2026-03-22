'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Labourer, AttendanceRecord, Payment } from '@/types';
import toast from 'react-hot-toast';

interface LabourProfileData {
    labourer: Labourer | null;
    attendanceRecords: AttendanceRecord[];
    payments: Payment[];
    attendanceSummary: {
        total: number;
        present: number;
        absent: number;
        percentage: number;
    };
    financials: {
        totalEarned: number;
        totalPaid: number;
        balanceDue: number;
    };
}

export function useLabourProfile(labourId: string) {
    const [data, setData] = useState<LabourProfileData>({
        labourer: null,
        attendanceRecords: [],
        payments: [],
        attendanceSummary: { total: 0, present: 0, absent: 0, percentage: 0 },
        financials: { totalEarned: 0, totalPaid: 0, balanceDue: 0 },
    });
    const [loading, setLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const [labourerRes, attendanceRes, paymentsRes] = await Promise.all([
                supabase.from('labourers').select('*').eq('id', labourId).single(),
                supabase
                    .from('attendance')
                    .select('*')
                    .eq('labour_id', labourId)
                    .order('date', { ascending: false }),
                supabase
                    .from('payments')
                    .select('*')
                    .eq('labour_id', labourId)
                    .order('payment_date', { ascending: false }),
            ]);

            if (labourerRes.error) throw labourerRes.error;

            const labourer = labourerRes.data as Labourer;
            const attendanceRecords = (attendanceRes.data || []) as AttendanceRecord[];
            const payments = (paymentsRes.data || []) as Payment[];

            const present = attendanceRecords.filter((a) => a.status === 'present').length;
            const absent = attendanceRecords.filter((a) => a.status === 'absent').length;
            const total = present + absent;
            const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

            const totalEarned = present * labourer.daily_wage;
            const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
            const balanceDue = totalEarned - totalPaid;

            setData({
                labourer,
                attendanceRecords,
                payments,
                attendanceSummary: { total, present, absent, percentage },
                financials: { totalEarned, totalPaid, balanceDue },
            });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Failed to load profile';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, [labourId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const addPayment = useCallback(
        async (payment: { amount: number; payment_date: string; note?: string }) => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase.from('payments').insert({
                labour_id: labourId,
                supervisor_id: user.id,
                amount: payment.amount,
                payment_date: payment.payment_date,
                note: payment.note || null,
            });

            if (error) throw error;
            toast.success('Payment recorded!');
            await fetchProfile();
        },
        [labourId, fetchProfile]
    );

    const deletePayment = useCallback(
        async (paymentId: string) => {
            const { error } = await supabase.from('payments').delete().eq('id', paymentId);
            if (error) throw error;
            toast.success('Payment deleted');
            await fetchProfile();
        },
        [fetchProfile]
    );

    return { ...data, loading, fetchProfile, addPayment, deletePayment };
}
