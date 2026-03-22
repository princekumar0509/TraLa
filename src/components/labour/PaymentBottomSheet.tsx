'use client';

import { useState, useRef } from 'react';
import { X, IndianRupee, Calendar, StickyNote, Loader2 } from 'lucide-react';
import { getISTDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import DateInput from '@/components/ui/DateInput';

interface PaymentBottomSheetProps {
    isOpen: boolean;
    labourerName: string;
    onClose: () => void;
    onSave: (data: { amount: number; payment_date: string; note?: string }) => Promise<void>;
}

export default function PaymentBottomSheet({
    isOpen,
    labourerName,
    onClose,
    onSave,
}: PaymentBottomSheetProps) {
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(getISTDate());
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const overlayRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    const handleSave = async () => {
        const parsed = parseFloat(amount);
        if (!amount || isNaN(parsed) || parsed <= 0) {
            setError('Enter a valid amount');
            return;
        }
        if (parsed > 9999999) {
            setError('Amount too large');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await onSave({
                amount: parsed,
                payment_date: date,
                note: note.trim() || undefined,
            });
            setAmount('');
            setNote('');
            setDate(getISTDate());
            onClose();
        } catch {
            setError('Failed to save payment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-end"
            onClick={(e) => e.target === overlayRef.current && onClose()}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full bg-white rounded-t-3xl shadow-2xl animate-slide-up max-h-[85dvh] overflow-y-auto">
                <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-1" />

                <div className="px-5 pb-8">
                    <div className="flex items-center justify-between py-4 mb-2">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
                            <p className="text-sm text-gray-500">for {labourerName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 mb-4">{error}</p>
                    )}

                    <div className="space-y-4">
                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Amount <span className="text-red-500">*</span>
                            </label>
                            <div
                                className={cn(
                                    'flex items-center gap-3 bg-gray-50 rounded-2xl px-4 border-2 transition-colors',
                                    'border-transparent focus-within:border-indigo-300 focus-within:bg-white'
                                )}
                            >
                                <IndianRupee size={18} className="text-gray-400 flex-shrink-0" />
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="flex-1 py-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-lg font-semibold"
                                    min="1"
                                    step="1"
                                    inputMode="numeric"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Payment Date
                            </label>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 border-2 border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                                <Calendar size={18} className="text-gray-400 flex-shrink-0" />
                                <DateInput
                                    value={date}
                                    max={getISTDate()}
                                    onChange={setDate}
                                />
                            </div>
                        </div>

                        {/* Note */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Note <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <div className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 border-2 border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                                <StickyNote size={18} className="text-gray-400 flex-shrink-0 mt-4" />
                                <input
                                    type="text"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="e.g. Week 1 advance"
                                    className="flex-1 py-4 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                                    maxLength={200}
                                />
                            </div>
                        </div>

                        {/* Save */}
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold text-base rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed min-h-[56px] flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {loading ? 'Saving...' : 'Save Payment'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
