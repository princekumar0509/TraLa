'use client';

import { useEffect, useRef } from 'react';
import { X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { ConfirmModalProps } from '@/types';
import { cn } from '@/lib/utils';

const variantConfig = {
    danger: {
        icon: AlertTriangle,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-50',
        confirmColor: 'bg-red-600 hover:bg-red-700 active:bg-red-800',
    },
    warning: {
        icon: AlertCircle,
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-50',
        confirmColor: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800',
    },
    info: {
        icon: Info,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-50',
        confirmColor: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800',
    },
};

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'info',
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const config = variantConfig[variant];
    const Icon = config.icon;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            onClick={(e) => {
                if (e.target === overlayRef.current) onCancel();
            }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Bottom Sheet */}
            <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
                {/* Handle bar */}
                <div className="sm:hidden w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2" />

                {/* Close button */}
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    id="confirm-modal-close"
                >
                    <X size={20} className="text-gray-500" />
                </button>

                <div className="px-6 py-6">
                    {/* Icon */}
                    <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', config.iconBg)}>
                        <Icon size={28} className={config.iconColor} />
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>

                    {/* Message */}
                    <p className="text-gray-600 text-base leading-relaxed mb-6">{message}</p>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            id="confirm-modal-confirm"
                            className={cn(
                                'w-full py-4 px-6 rounded-2xl text-white font-semibold text-base transition-all duration-200 min-h-[52px]',
                                config.confirmColor
                            )}
                        >
                            {confirmLabel}
                        </button>
                        <button
                            onClick={onCancel}
                            id="confirm-modal-cancel"
                            className="w-full py-4 px-6 rounded-2xl bg-gray-100 text-gray-700 font-semibold text-base hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 min-h-[52px]"
                        >
                            {cancelLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
