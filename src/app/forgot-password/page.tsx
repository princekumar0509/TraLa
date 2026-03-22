'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { APP_NAME } from '@/lib/constants';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        setError('');
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/auth/callback`,
        });

        if (error) {
            setError(error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-dvh bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 flex flex-col items-center justify-center px-4 py-8">
            {/* Logo */}
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-2xl">
                    <span className="text-3xl">🏗️</span>
                </div>
                <h1 className="text-2xl font-bold text-white">{APP_NAME}</h1>
            </div>

            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-white/10 p-6 space-y-4">
                {sent ? (
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">
                            <Mail size={32} className="text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Reset link sent</h2>
                        <p className="text-gray-500 text-sm">
                            We&apos;ve sent a password reset link to <span className="font-semibold text-gray-700">{email}</span>. Check your inbox.
                        </p>
                        <Link
                            href="/sign-in"
                            className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold min-h-[48px] transition-colors text-center"
                        >
                            Back to Sign In
                        </Link>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-gray-900 text-center">Forgot Password</h2>
                        <p className="text-sm text-gray-500 text-center">
                            Enter your email and we&apos;ll send you a reset link.
                        </p>

                        {error && (
                            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 text-center">{error}</p>
                        )}

                        <form onSubmit={handleReset} className="space-y-3">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 border-2 border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                                <Mail size={18} className="text-gray-400 flex-shrink-0" />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    className="flex-1 py-3 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold min-h-[48px] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 size={18} className="animate-spin" />}
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>

                        <Link
                            href="/sign-in"
                            className="flex items-center justify-center gap-2 text-sm text-indigo-600 font-semibold hover:text-indigo-700"
                        >
                            <ArrowLeft size={14} />
                            Back to Sign In
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
