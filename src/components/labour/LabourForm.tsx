'use client';

import { useState } from 'react';
import { WorkerType, Labourer } from '@/types';
import { WORKER_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { IndianRupee, User, Phone, ChevronDown, Loader2 } from 'lucide-react';

interface LabourFormProps {
    initialData?: Partial<Labourer>;
    onSubmit: (data: {
        name: string;
        phone?: string;
        worker_type: WorkerType;
        daily_wage: number;
    }) => Promise<void>;
    submitLabel?: string;
}

export default function LabourForm({ initialData, onSubmit, submitLabel = 'Add Labourer' }: LabourFormProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [workerType, setWorkerType] = useState<WorkerType>(initialData?.worker_type || 'Mason');
    const [dailyWage, setDailyWage] = useState(initialData?.daily_wage?.toString() || '');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
        if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Enter valid 10-digit Indian mobile number';
        }
        const wage = parseFloat(dailyWage);
        if (!dailyWage || isNaN(wage) || wage <= 0) {
            newErrors.daily_wage = 'Enter valid daily wage';
        }
        if (wage > 99999.99) newErrors.daily_wage = 'Wage too high';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await onSubmit({
                name: name.trim(),
                phone: phone.replace(/\s/g, '') || undefined,
                worker_type: workerType,
                daily_wage: parseFloat(dailyWage),
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="labourer-name">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <div className={cn('flex items-center gap-3 bg-gray-50 rounded-2xl px-4 border-2 transition-colors', errors.name ? 'border-red-300' : 'border-transparent focus-within:border-indigo-300 focus-within:bg-white')}>
                    <User size={18} className="text-gray-400 flex-shrink-0" />
                    <input
                        id="labourer-name"
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: '' })); }}
                        placeholder="e.g. Ramesh Kumar"
                        className="flex-1 py-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                        autoComplete="name"
                    />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="labourer-phone">
                    Mobile Number <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className={cn('flex items-center gap-3 bg-gray-50 rounded-2xl px-4 border-2 transition-colors', errors.phone ? 'border-red-300' : 'border-transparent focus-within:border-indigo-300 focus-within:bg-white')}>
                    <Phone size={18} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-500 text-base font-medium">+91</span>
                    <input
                        id="labourer-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setErrors((prev) => ({ ...prev, phone: '' })); }}
                        placeholder="9876543210"
                        className="flex-1 py-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                        maxLength={10}
                        inputMode="numeric"
                    />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
            </div>

            {/* Worker Type */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="labourer-worker-type">
                    Worker Type <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center bg-gray-50 rounded-2xl px-4 border-2 border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                    <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                    <select
                        id="labourer-worker-type"
                        value={workerType}
                        onChange={(e) => setWorkerType(e.target.value as WorkerType)}
                        className="flex-1 py-4 pl-3 bg-transparent text-gray-900 outline-none text-base appearance-none cursor-pointer"
                    >
                        {WORKER_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Daily Wage */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="labourer-wage">
                    Daily Wage (₹) <span className="text-red-500">*</span>
                </label>
                <div className={cn('flex items-center gap-3 bg-gray-50 rounded-2xl px-4 border-2 transition-colors', errors.daily_wage ? 'border-red-300' : 'border-transparent focus-within:border-indigo-300 focus-within:bg-white')}>
                    <IndianRupee size={18} className="text-gray-400 flex-shrink-0" />
                    <input
                        id="labourer-wage"
                        type="number"
                        value={dailyWage}
                        onChange={(e) => { setDailyWage(e.target.value); setErrors((prev) => ({ ...prev, daily_wage: '' })); }}
                        placeholder="500"
                        className="flex-1 py-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                        min="1"
                        max="99999"
                        step="1"
                        inputMode="numeric"
                    />
                </div>
                {errors.daily_wage && <p className="text-red-500 text-xs mt-1 ml-1">{errors.daily_wage}</p>}
            </div>

            {/* Submit */}
            <button
                type="submit"
                id="labourer-form-submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold text-base rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed min-h-[56px] flex items-center justify-center gap-2"
            >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? 'Saving...' : submitLabel}
            </button>
        </form>
    );
}
