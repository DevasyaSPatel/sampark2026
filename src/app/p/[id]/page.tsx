'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ParticipantProfileCard from '@/components/ParticipantProfileCard';

type User = {
    id: string;
    name: string;
    theme: string;
    bio: string;
    connections: number;
    linkedin?: string;
    instagram?: string;
    github?: string;
    email?: string;
    phone?: string;
};

export default function PublicProfile() {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState<'None' | 'Pending' | 'Accepted'>('None');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        // 1. Fetch User
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/users/${id}`);
                if (!res.ok) throw new Error('User not found');
                const data = await res.json();
                setUser(data);
            } catch (err) {
                // handle error
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

        // 2. Check Status (if logged in)
        const checkStatus = async () => {
            const myId = localStorage.getItem('user_id');
            if (myId && id) {
                try {
                    const res = await fetch(`/api/connections/status?sourceEmail=${myId}&targetEmail=${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        // API might return 'connected': true/false or a status string. 
                        // For now assuming existing APIs returns { status: 'Accepted' | 'Pending' | 'None' }
                        // If previous API returned boolean, we might need to adjust or default to 'Accepted' if true.
                        // Let's assume the API returns standard status or we map it.
                        setConnectionStatus(data.status || (data.connected ? 'Accepted' : 'None'));
                    }
                } catch (e) { console.error(e); }
            }
        };

        checkStatus();
    }, [id]);

    const handleConnect = async () => {
        setSending(true);
        const myId = localStorage.getItem('user_id');

        // Note: Logic for redirection is now also handled in the Component, 
        // but this is the safety net for the API call itself.
        if (!myId) return;

        const payload = {
            action: 'connect',
            sourceEmail: myId,
        };

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setConnectionStatus('Pending'); // Or 'Accepted' depending on auto-accept rules
            } else {
                alert("Failed to connect. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading Profile...</div>;
    if (!user) return <div className="min-h-screen flex items-center justify-center text-red-500">User Not Found</div>;

    const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('user_id');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden py-20 bg-[#0a0a0a]">
            {/* Background Effects for Dark Theme */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[100px] rounded-full"></div>
            </div>

            <nav className="fixed top-0 w-full p-6 flex justify-between items-center bg-transparent z-50">
                <Link href="/" className="text-xl font-bold text-white">Sampark 2026</Link>
                {!isLoggedIn && <Link href="/login" className="text-sm text-blue-300 hover:text-blue-200 transition-colors">Login</Link>}
            </nav>

            <div className="w-full flex justify-center animate-fade-in pt-10">
                <ParticipantProfileCard
                    user={user}
                    isLoggedIn={isLoggedIn}
                    connectionStatus={connectionStatus}
                    isLoading={sending}
                    onConnect={handleConnect}
                />
            </div>

            <footer className="mt-12 text-sm text-gray-600 pb-6">
                Scanned via NFC • Sampark 2026
            </footer>
        </div>
    );
}
