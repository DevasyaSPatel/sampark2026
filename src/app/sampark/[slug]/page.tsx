'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import ParticipantProfileCard from '@/components/ParticipantProfileCard';

// Define types locally if needed or import from a shared types file
type PublicUser = {
    id: string; // Email/ID
    name: string;
    theme: string;
    bio: string;
    slug: string;
    role: string;
    connections?: number;
    // Add other public fields
};

type ConnectionStatus = 'None' | 'Pending' | 'Accepted';

export default function PublicProfile({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('None');
    const [profile, setProfile] = useState<PublicUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        // 1. Fetch Profile
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/public/profile/${slug}`);
                if (!res.ok) throw new Error('Profile not found');
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                setError('User not found or link is invalid.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

        // 2. Check Auth & Connection Status
        const checkAuthAndStatus = async () => {
            const userId = localStorage.getItem('user_id');
            const userData = localStorage.getItem('user_data');

            if (userId) {
                if (userData) {
                    setCurrentUser(JSON.parse(userData));
                } else {
                    setCurrentUser({ email: userId });
                }
            }
        };

        checkAuthAndStatus();
    }, [slug]);

    // Separate effect to check status once both currentUser and profile are available
    useEffect(() => {
        const checkStatus = async () => {
            if (currentUser?.email && profile?.id) {
                try {
                    const res = await fetch(`/api/connections/status?sourceEmail=${currentUser.email}&targetEmail=${profile.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setConnectionStatus(data.status); // 'None', 'Pending', 'Accepted'
                    }
                } catch (e) {
                    console.error("Failed to check status", e);
                }
            }
        };

        checkStatus();
    }, [currentUser, profile]);


    const handleConnect = async () => {
        setSending(true);

        if (!currentUser) {
            // This is primarily handled by the component now, but keep as fallback
            router.push('/login');
            return;
        }

        try {
            const payload = {
                sourceEmail: currentUser?.email || localStorage.getItem('user_id'),
                targetEmail: profile?.id || '',
                note: ''
            };
            console.log("Sending Request Payload:", payload);

            const res = await fetch('/api/connections/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setConnectionStatus('Pending');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to send request');
            }
        } catch (e) {
            console.error(e);
            alert('Error sending request: Network or Server Error');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    if (error || !profile) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;

    const isLoggedIn = !!currentUser;

    // Adapt profile to component User type
    const cardUser = {
        id: profile.id,
        name: profile.name,
        theme: profile.theme,
        connections: profile.connections || 0,
        bio: profile.bio
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0a]">
            {/* Background Effects matching other page for consistency */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[100px] rounded-full"></div>
            </div>

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 flex justify-between items-center bg-transparent">
                <div className="text-xl font-bold text-white">Sampark 2026</div>
                <button onClick={() => router.push(currentUser ? '/dashboard' : '/login')} className="text-sm font-bold text-blue-300 hover:text-blue-200 border border-white/20 px-4 py-1.5 rounded-full hover:bg-white/10 transition-all uppercase">
                    {currentUser ? 'Dashboard' : 'Login'}
                </button>
            </nav>

            {/* Profile Card */}
            <div className="w-full flex justify-center p-4">
                <ParticipantProfileCard
                    user={cardUser}
                    isLoggedIn={isLoggedIn}
                    connectionStatus={connectionStatus}
                    isLoading={sending}
                    onConnect={handleConnect}
                />
            </div>
        </div>
    );
}
