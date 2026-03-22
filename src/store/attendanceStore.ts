import { create } from 'zustand';
import { AttendanceRecord, AttendanceStatus } from '@/types';

interface AttendanceStore {
    selectedDate: string;
    statuses: Record<string, AttendanceStatus | null>;
    isModifying: boolean;
    isDirty: boolean;
    setDate: (date: string) => void;
    setStatus: (labourId: string, status: AttendanceStatus) => void;
    loadExisting: (records: AttendanceRecord[]) => void;
    reset: () => void;
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
    selectedDate: '',
    statuses: {},
    isModifying: false,
    isDirty: false,

    setDate: (date: string) =>
        set({
            selectedDate: date,
            statuses: {},
            isModifying: false,
            isDirty: false,
        }),

    setStatus: (labourId: string, status: AttendanceStatus) =>
        set((state) => ({
            statuses: { ...state.statuses, [labourId]: status },
            isDirty: state.isModifying ? true : state.isDirty,
        })),

    loadExisting: (records: AttendanceRecord[]) => {
        const statuses: Record<string, AttendanceStatus> = {};
        records.forEach((rec) => {
            statuses[rec.labour_id] = rec.status;
        });
        set({
            statuses,
            isModifying: records.length > 0,
            isDirty: false,
        });
    },

    reset: () =>
        set({
            selectedDate: '',
            statuses: {},
            isModifying: false,
            isDirty: false,
        }),
}));
