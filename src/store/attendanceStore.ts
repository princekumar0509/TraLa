import { create } from 'zustand';
import { AttendanceRecord, AttendanceStatus, Shift, ShiftEntry } from '@/types';

interface AttendanceStore {
    selectedDate: string;
    selectedShift: Shift;
    statuses: Record<string, ShiftEntry>;
    isModifying: boolean;
    isDirty: boolean;
    otherShiftStatuses: Record<string, AttendanceStatus | null>;
    setDate: (date: string) => void;
    setShift: (shift: Shift) => void;
    setStatus: (labourId: string, entry: ShiftEntry) => void;
    loadExisting: (records: AttendanceRecord[]) => void;
    loadOtherShift: (records: AttendanceRecord[]) => void;
    reset: () => void;
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
    selectedDate: '',
    selectedShift: 'day',
    statuses: {},
    isModifying: false,
    isDirty: false,
    otherShiftStatuses: {},

    setDate: (date: string) =>
        set({
            selectedDate: date,
            statuses: {},
            isModifying: false,
            isDirty: false,
            otherShiftStatuses: {},
        }),

    setShift: (shift: Shift) =>
        set({
            selectedShift: shift,
            statuses: {},
            isModifying: false,
            isDirty: false,
            otherShiftStatuses: {},
        }),

    setStatus: (labourId: string, entry: ShiftEntry) =>
        set((state) => ({
            statuses: { ...state.statuses, [labourId]: entry },
            isDirty: state.isModifying ? true : state.isDirty,
        })),

    loadExisting: (records: AttendanceRecord[]) => {
        const statuses: Record<string, ShiftEntry> = {};
        records.forEach((rec) => {
            statuses[rec.labour_id] = {
                status: rec.status,
                hours_worked: rec.hours_worked ?? undefined,
            };
        });
        set({
            statuses,
            isModifying: records.length > 0,
            isDirty: false,
        });
    },

    loadOtherShift: (records: AttendanceRecord[]) => {
        const otherShiftStatuses: Record<string, AttendanceStatus> = {};
        records.forEach((rec) => {
            otherShiftStatuses[rec.labour_id] = rec.status;
        });
        set({ otherShiftStatuses });
    },

    reset: () =>
        set({
            selectedDate: '',
            selectedShift: 'day',
            statuses: {},
            isModifying: false,
            isDirty: false,
            otherShiftStatuses: {},
        }),
}));
