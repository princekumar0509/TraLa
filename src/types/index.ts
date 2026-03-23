export type WorkerType =
    | 'Mason'
    | 'Helper'
    | 'Electrician'
    | 'Plumber'
    | 'Carpenter'
    | 'Painter'
    | 'Welder'
    | 'Supervisor'
    | 'Driver'
    | 'Loader';

export type AttendanceStatus = 'present' | 'absent';
export type Shift = 'day' | 'night';

export interface Labourer {
    id: string;
    supervisor_id: string;
    name: string;
    phone?: string;
    worker_type: WorkerType;
    daily_wage: number;
    night_hourly_rate?: number | null;
    is_active: boolean;
    created_at: string;
    updated_at?: string;
}

export interface AttendanceRecord {
    id: string;
    labour_id: string;
    supervisor_id: string;
    date: string;
    shift: Shift;
    status: AttendanceStatus;
    wage_amount: number;
    hours_worked?: number | null;
    created_at?: string;
    updated_at?: string;
}

export interface ShiftEntry {
    status: AttendanceStatus | null;
    hours_worked?: number;
}

export interface DailySummary {
    total: number;
    present: number;
    absent: number;
    unmarked: number;
    total_wage: number;
}

export interface HistoryEntry {
    date: string;
    present: number;
    absent: number;
    total_wage: number;
    records?: AttendanceRecord[];
}

export interface LabourerWithAttendance extends Labourer {
    status?: AttendanceStatus;
    wage_amount?: number;
}

export interface MonthlySummary {
    labourer_id: string;
    labourer_name: string;
    worker_type: WorkerType;
    total_present: number;
    total_wage: number;
}

export interface Payment {
    id: string;
    labour_id: string;
    supervisor_id: string;
    amount: number;
    payment_date: string;
    note?: string;
    created_at: string;
}

export interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
}
