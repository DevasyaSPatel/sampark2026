'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'lucide-react'; // Fallback icon

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

export default function PublicProfile({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [connectionStatus, setConnectionStatus] = useState('None'); // None, Pending, Accepted
    const [profile, setProfile] = useState<PublicUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [requestSent, setRequestSent] = useState(false);

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
        if (!currentUser) {
            const userId = localStorage.getItem('user_id');
            if (userId) {
                setCurrentUser({ email: userId });
            } else {
                router.push('/login');
                return;
            }
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
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    if (error || !profile) return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;

    const getButtonContent = () => {
        if (connectionStatus === 'Accepted') {
            return (
                <button disabled className="w-full py-4 bg-green-600 text-white font-bold text-xl uppercase tracking-widest border-[3px] border-black rounded-lg cursor-default opacity-90">
                    CONNECTED
                </button>
            );
        }
        if (connectionStatus === 'Pending' || requestSent) { // requestSent fallback
            return (
                <button disabled className="w-full py-4 bg-zinc-700 text-white font-bold text-xl uppercase tracking-widest border-[3px] border-black rounded-lg cursor-not-allowed opacity-80">
                    REQUEST SENT
                </button>
            );
        }
        return (
            <button
                onClick={handleConnect}
                className="w-full py-4 bg-[#a64ca6] hover:bg-[#943d94] text-black font-bold text-xl uppercase tracking-widest border-[3px] border-black rounded-lg transition-colors"
            >
                CONNECT
            </button>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#7895cb]">
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 flex justify-between items-center bg-transparent">
                <div className="text-xl font-bold text-black/80">Sampark 2026</div>
                <button onClick={() => router.push(currentUser ? '/dashboard' : '/login')} className="text-sm font-bold text-black border-2 border-black px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition-all uppercase">
                    {currentUser ? 'Dashboard' : 'Login'}
                </button>
            </nav>

            {/* Profile Card */}
            <div className="w-full max-w-md mx-4 relative">
                {/* Card Shadow Element for 3D effect */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black rounded-lg" />

                <div className="relative bg-[#8f8f8f] border-[3px] border-black rounded-lg p-12 flex flex-col items-center gap-8 text-center shadow-none">

                    {/* Username */}
                    <h1 className="text-4xl font-black text-black uppercase tracking-tighter shadow-none">
                        {profile.name}
                    </h1>

                    {/* Connection Count */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-4xl font-bold text-black">{profile.connections || 0}</span>
                        <span className="text-lg font-bold text-black/80 tracking-wide">Connections</span>
                    </div>

                    {/* Connect Button */}
                    <div className="w-full pt-8">
                        {getButtonContent()}

                        {!currentUser && (
                            <p className="mt-4 text-xs font-bold text-black/60 uppercase cursor-pointer hover:text-black hover:underline" onClick={() => router.push('/login')}>
                                Login to Connect
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
