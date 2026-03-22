'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { APP_NAME } from '@/lib/constants';
import { Loader2, Mail, Lock, User, Building2 } from 'lucide-react';

export default function SignUpPage() {
    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleGoogleSignUp = async () => {
        setGoogleLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) {
            setError(error.message);
            setGoogleLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!fullName.trim()) {
            setError('Full name is required');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
                data: {
                    full_name: fullName.trim(),
                    company_name: companyName.trim() || undefined,
                },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-dvh bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 flex flex-col items-center justify-center px-4 py-8">
                <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto">
                        <Mail size={32} className="text-green-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
                    <p className="text-gray-500 text-sm">
                        We&apos;ve sent a confirmation link to <span className="font-semibold text-gray-700">{email}</span>. Click the link to activate your account.
                    </p>
                    <Link
                        href="/sign-in"
                        className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold min-h-[48px] transition-colors text-center"
                    >
                        Back to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 flex flex-col items-center justify-center px-4 py-8">
            {/* Logo */}
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-2xl">
                    <span className="text-3xl">🏗️</span>
                </div>
                <h1 className="text-2xl font-bold text-white">{APP_NAME}</h1>
                <p className="text-indigo-300 text-sm mt-1">Smart Attendance for Field Teams</p>
            </div>

            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-white/10 p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 text-center">Create Account</h2>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 text-center">{error}</p>
                )}

                {/* Google OAuth */}
                <button
                    onClick={handleGoogleSignUp}
                    disabled={googleLoading || loading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[48px] disabled:opacity-50"
                >
                    {googleLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                    )}
                    Continue with Google
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-medium">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Sign Up Form */}
                <form onSubmit={handleSignUp} className="space-y-3">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 border-2 border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                        <User size={18} className="text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Full Name *"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            autoComplete="name"
                            className="flex-1 py-3 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 border-2 border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                        <Building2 size={18} className="text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Company / Site (optional)"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            autoComplete="organization"
                            className="flex-1 py-3 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 border-2 border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                        <Mail size={18} className="text-gray-400 flex-shrink-0" />
                        <input
                            type="email"
                            placeholder="Email address *"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="flex-1 py-3 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 border-2 border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                        <Lock size={18} className="text-gray-400 flex-shrink-0" />
                        <input
                            type="password"
                            placeholder="Password (min 8 chars) *"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            className="flex-1 py-3 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 border-2 border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                        <Lock size={18} className="text-gray-400 flex-shrink-0" />
                        <input
                            type="password"
                            placeholder="Confirm Password *"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            className="flex-1 py-3 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || googleLoading}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold min-h-[48px] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-sm text-gray-500 text-center">
                    Already have an account?{' '}
                    <Link href="/sign-in" className="text-indigo-600 font-semibold hover:text-indigo-700">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}
