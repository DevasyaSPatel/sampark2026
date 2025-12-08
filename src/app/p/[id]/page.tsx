'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type User = {
    id: string;
    name: string;
    theme: string;
    bio: string;
    connections: number;
};

export default function PublicProfile() {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        fetch(`/api/users/${id}`)
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('User not found');
            })
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleConnect = async () => {
        // Simulate connection
        // In real world, the "Scanner" needs to be logged in to connect.
        // For this prototype, we'll just increment the user's count anonymously or assume the scanner is logged in.
        // We'll increment the TARGET user's connection count.

        // Check if I am logged in (simulating "Scanner")
        const myId = localStorage.getItem('user_id');
        if (!myId) {
            alert("Please login to connect with this user!");
            window.location.href = '/login';
            return;
        }

        // Prevent self-connect
        if (myId === id) {
            alert("You cannot connect with yourself!");
            return;
        }

        const res = await fetch(`/api/users/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'connect' })
        });

        if (res.ok) {
            setConnected(true);
            // Also refresh user data
            const updated = await res.json();
            // The API returns { connections: newCount }
            if (user) setUser({ ...user, connections: updated.connections });
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;
    if (!user) return <div className="min-h-screen flex items-center justify-center text-red-500">User Not Found</div>;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full"></div>
            </div>

            <nav className="fixed top-0 w-full p-6 flex justify-between items-center bg-transparent z-50">
                <Link href="/" className="text-xl font-bold">Sampark 2026</Link>
            </nav>

            <div className="glass w-full max-w-md p-8 md:p-12 text-center relative mt-10">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold mb-6 text-white shadow-lg shadow-purple-500/30">
                    {user.name.charAt(0)}
                </div>

                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-sm border border-white/20 mb-6 text-blue-300">
                    {user.theme}
                </div>

                <p className="text-gray-400 mb-8 leading-relaxed">
                    {user.bio || "This user prefers to keep an air of mystery."}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-2xl font-bold text-white">{user.connections}</div>
                        <div className="text-xs text-gray-500 uppercase">Connections</div>
                    </div>
                    <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-2xl font-bold text-white">#042</div>
                        <div className="text-xs text-gray-500 uppercase">Rank</div>
                    </div>
                </div>

                <button
                    onClick={handleConnect}
                    disabled={connected}
                    className={`w-full py-4 text-lg font-bold rounded-xl transition-all ${connected
                            ? 'bg-green-500 text-white cursor-default'
                            : 'btn-primary hover:scale-105 shadow-xl shadow-blue-500/20'
                        }`}
                >
                    {connected ? 'Connected! 🎉' : 'Connect Now 👋'}
                </button>
            </div>

            <footer className="mt-12 text-sm text-gray-500 pb-6">
                Scanned via NFC • Sampark 2026
            </footer>
        </div>
    );
}
