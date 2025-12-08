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
    const [connected, setConnected] = useState(false);
    const [showGuestForm, setShowGuestForm] = useState(false);

    // Guest Form State
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [guestNote, setGuestNote] = useState('');
    const [sending, setSending] = useState(false);

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

    const handleConnect = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setSending(true);

        const myId = localStorage.getItem('user_id'); // If logged in

        const payload = {
            action: 'connect',
            sourceEmail: myId || undefined,
            sourceName: guestName || undefined,
            sourcePhone: guestPhone || undefined,
            note: guestNote || undefined
        };

        const res = await fetch(`/api/users/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setConnected(true);
            setShowGuestForm(false);
            // Refresh user data (connections count)
            const updated = await res.json(); // API might return success:true or nothing useful yet for count update
            // Ideally we re-fetch user to get new count, but for UI feedback 'Connected!' is enough.
        } else {
            alert("Failed to connect. Please try again.");
        }
        setSending(false);
    };

    const downloadVCard = () => {
        if (!user) return;

        const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${user.name}
EMAIL:${user.email || ''}
TEL:${user.phone || ''}
NOTE:${user.bio || ''} - Met at Sampark 2026
URL:${window.location.href}
END:VCARD`;

        const blob = new Blob([vCardData], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user.name.replace(/\s+/g, '_')}.vcf`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;
    if (!user) return <div className="min-h-screen flex items-center justify-center text-red-500">User Not Found</div>;

    const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('user_id');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden py-20">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full"></div>
            </div>

            <nav className="fixed top-0 w-full p-6 flex justify-between items-center bg-transparent z-50">
                <Link href="/" className="text-xl font-bold">Sampark 2026</Link>
                {!isLoggedIn && <Link href="/login" className="text-sm text-blue-300">Login</Link>}
            </nav>

            <div className="glass w-full max-w-md p-8 md:p-12 text-center relative animate-fade-in">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-pink-500 rounded-full flex items-center justify-center text-4xl font-bold mb-6 text-white shadow-lg shadow-purple-500/30">
                    {user.name.charAt(0)}
                </div>

                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-sm border border-white/20 mb-6 text-blue-300">
                    {user.theme || "Attendee"}
                </div>

                <p className="text-gray-400 mb-8 leading-relaxed">
                    {user.bio || "Ready to connect and collaborate!"}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-4 mb-8">
                    {user.linkedin && (
                        <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-blue-600/20 transition-all border border-white/10">
                            🔗 LinkedIn
                        </a>
                    )}
                    {user.instagram && (
                        <a href={user.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-pink-600/20 transition-all border border-white/10">
                            📸 Instagram
                        </a>
                    )}
                    {user.github && (
                        <a href={user.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-gray-600/20 transition-all border border-white/10">
                            💻 GitHub
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-black/30 rounded-lg">
                        <div className="text-2xl font-bold text-white">{user.connections}</div>
                        <div className="text-xs text-gray-500 uppercase">Connections</div>
                    </div>
                    <button
                        onClick={downloadVCard}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-lg flex flex-col items-center justify-center transition-all border border-white/10"
                    >
                        <span className="text-2xl mb-1">📇</span>
                        <span className="text-xs text-gray-400 uppercase">Save Contact</span>
                    </button>
                </div>

                {!connected ? (
                    <>
                        {!showGuestForm ? (
                            <button
                                onClick={() => {
                                    if (isLoggedIn) {
                                        handleConnect();
                                    } else {
                                        setShowGuestForm(true);
                                    }
                                }}
                                className="w-full py-4 text-lg font-bold rounded-xl btn-primary hover:scale-105 shadow-xl shadow-blue-500/20 transition-all"
                            >
                                Connect Now 👋
                            </button>
                        ) : (
                            <form onSubmit={handleConnect} className="text-left bg-black/40 p-6 rounded-xl border border-white/10 animate-fade-in">
                                <h3 className="text-lg font-bold mb-4">Leave your details</h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        required
                                        value={guestName}
                                        onChange={e => setGuestName(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number (Optional)"
                                        value={guestPhone}
                                        onChange={e => setGuestPhone(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    />
                                    <textarea
                                        placeholder="Note (e.g. Let's meet for coffee)"
                                        value={guestNote}
                                        onChange={e => setGuestNote(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none h-20"
                                    />
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowGuestForm(false)}
                                            className="flex-1 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all font-bold"
                                        >
                                            {sending ? 'Sending...' : 'Send'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </>
                ) : (
                    <div className="w-full py-4 text-lg font-bold rounded-xl bg-green-500 text-white cursor-default flex items-center justify-center gap-2">
                        <span>Connected! 🎉</span>
                    </div>
                )}
            </div>

            <footer className="mt-12 text-sm text-gray-500 pb-6">
                Scanned via NFC • Sampark 2026
            </footer>
        </div>
    );
}
