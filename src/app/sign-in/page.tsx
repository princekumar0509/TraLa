'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { APP_NAME } from '@/lib/constants';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleSignIn = async () => {
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

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password) return;

        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-dvh bg-gradient-to-br from-indigo-950 via-indigo-900 to-blue-900 flex flex-col items-center justify-center px-4 py-8">
            {/* Logo */}
            <div className="mb-8 text-center">
                <img src="/logo.svg" alt="TraLa" className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-2xl" />
                <h1 className="text-2xl font-bold text-white">{APP_NAME}</h1>
                <p className="text-indigo-300 text-sm mt-1">Smart Attendance for Field Teams</p>
            </div>

            <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-white/10 p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 text-center">Sign In</h2>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2 text-center">{error}</p>
                )}

                {/* Google OAuth */}
                <button
                    onClick={handleGoogleSignIn}
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

                {/* Email / Password */}
                <form onSubmit={handleEmailSignIn} className="space-y-3">
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

                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 border-2 border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
                        <Lock size={18} className="text-gray-400 flex-shrink-0" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            className="flex-1 py-3 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-base"
                        />
                    </div>

                    <div className="text-right">
                        <Link href="/forgot-password" className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || googleLoading}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold min-h-[48px] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-sm text-gray-500 text-center">
                    Don&apos;t have an account?{' '}
                    <Link href="/sign-up" className="text-indigo-600 font-semibold hover:text-indigo-700">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
