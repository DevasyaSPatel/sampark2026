'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Mock login delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Basic validation mock
        if (formData.email && formData.password) {
            // In a real app, you would validate credentials here
            // For now, redirect to dashboard
            router.push('/dashboard');
        } else {
            setError('Please enter both email and password.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans flex flex-col">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00629B 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-12">
                {/* Header / Back Link */}
                <div className="w-full max-w-md mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-ieee-blue transition-colors px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 mb-6">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <div className="text-center">
                        <Link href="/" className="inline-block group mb-4">
                            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 group-hover:scale-105 transition-transform inline-flex items-center gap-3">
                                <img src="/favicon.ico" alt="IEEE Logo" className="h-10 w-auto" />
                                <div className="text-left flex flex-col">
                                    <span className="text-ieee-blue font-bold text-xl leading-none">IEEE</span>
                                    <span className="text-ieee-navy text-xs font-bold tracking-widest uppercase">Sampark 2026</span>
                                </div>
                            </div>
                        </Link>
                        <h1 className="text-2xl font-bold text-ieee-navy">Welcome Back</h1>
                        <p className="text-gray-500 mt-2 text-sm">Sign in to access your dashboard and event tickets.</p>
                    </div>
                </div>

                {/* Login Card */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-8 md:p-10">

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 mb-6 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-ieee-navy flex items-center gap-2">
                                <Mail size={16} className="text-ieee-blue" /> Email Address
                            </label>
                            <input
                                required
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-ieee-blue focus:ring-4 focus:ring-blue-50 transition-all bg-gray-50 focus:bg-white text-gray-700 placeholder:text-gray-400"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-ieee-navy flex items-center gap-2">
                                    <Lock size={16} className="text-ieee-blue" /> Password
                                </label>
                                <a href="#" className="text-xs text-ieee-blue font-semibold hover:underline">Forgot?</a>
                            </div>
                            <input
                                required
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-ieee-blue focus:ring-4 focus:ring-blue-50 transition-all bg-gray-50 focus:bg-white text-gray-700 placeholder:text-gray-400"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-ieee-blue hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <LogIn size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account? <Link href="/register" className="font-bold text-ieee-blue hover:text-blue-700 hover:underline transition-colors inline-flex items-center gap-1">Register <ArrowRight size={14} /></Link>
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                    © 2026 IEEE Student Branch PDEU
                </p>
            </div>
        </div>
    );
}
