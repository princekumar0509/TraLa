import { WorkerType } from '@/types';

export const WORKER_TYPES: WorkerType[] = [
    'Mason',
    'Helper',
    'Electrician',
    'Plumber',
    'Carpenter',
    'Painter',
    'Welder',
    'Supervisor',
    'Driver',
    'Loader',
];

export const WORKER_TYPE_COLORS: Record<WorkerType, string> = {
    Mason: 'bg-amber-100 text-amber-800',
    Helper: 'bg-blue-100 text-blue-800',
    Electrician: 'bg-yellow-100 text-yellow-800',
    Plumber: 'bg-cyan-100 text-cyan-800',
    Carpenter: 'bg-orange-100 text-orange-800',
    Painter: 'bg-purple-100 text-purple-800',
    Welder: 'bg-red-100 text-red-800',
    Supervisor: 'bg-indigo-100 text-indigo-800',
    Driver: 'bg-green-100 text-green-800',
    Loader: 'bg-gray-100 text-gray-800',
};

export const APP_NAME = 'TraLa';
export const APP_TAGLINE = 'Smart Attendance for Field Teams';
