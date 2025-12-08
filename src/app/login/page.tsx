'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: id, password: password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Determine user role or just allow access
                localStorage.setItem('user_id', id);
                // Optional: Store entire user object
                localStorage.setItem('user_data', JSON.stringify(data.user));
                router.push('/dashboard?loggedIn=true');
            } else {
                setError(data.message || 'Invalid Credentials');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
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
                        <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className="w-full bg-black/50 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="name@example.com"
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
