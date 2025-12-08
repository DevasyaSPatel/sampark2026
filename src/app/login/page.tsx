'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple mock Client-side login for demo purposes
        // In real app: call API
        if (id === 'EMP123' && password === 'password123') {
            // Set cookie/localstorage
            localStorage.setItem('user_id', id);
            router.push('/dashboard');
        } else if (id === 'ADM001' && password === 'admin') {
            localStorage.setItem('user_id', id);
            router.push('/dashboard');
        } else {
            setError('Invalid Credentials. Please check the email sent to you.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative px-4">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600 opacity-20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-pink-600 opacity-20 blur-[100px] rounded-full"></div>
            </div>

            <div className="glass p-8 md:p-12 w-full max-w-md z-10">
                <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
                <p className="text-gray-400 text-center mb-8">Login to your Sampark Profile</p>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Registration ID</label>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full bg-black/50 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="e.g. EMP123"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="btn btn-primary w-full py-3">
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Forgot credentials? check your confirmation email or <Link href="/register" className="text-primary hover:underline">Support</Link>
                </p>
            </div>
        </div>
    );
}
