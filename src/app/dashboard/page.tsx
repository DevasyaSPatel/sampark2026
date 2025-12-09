'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import RequestsList from '@/components/RequestsList';

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
    theme: string;
    bio: string;
    connections: number;
    linkedin: string;
    instagram: string;
    github: string;
    slug: string; // Added slug
};

type Connection = {
    sourceName: string;
    sourceEmail: string;
    targetEmail?: string; // Added targetEmail
    sourcePhone: string;
    note: string;
    timestamp: string;
    status: string;
    direction?: 'incoming' | 'outgoing';
    name?: string; // Resolved name from backend
};

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        theme: '',
        bio: '',
        linkedin: '',
        instagram: '',
        github: ''
    });
    const [message, setMessage] = useState('');
    const [connectionsList, setConnectionsList] = useState<Connection[]>([]);
    const [activeTab, setActiveTab] = useState<'profile' | 'connections'>('profile');
    const [isScanning, setIsScanning] = useState(false);
    const [nfcError, setNfcError] = useState('');
    const [showSimulateInput, setShowSimulateInput] = useState(false);
    const [simulateEmail, setSimulateEmail] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            router.push('/login');
            return;
        }

        // Fetch User Data
        fetch(`/api/users/${userId}`)
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Failed to fetch');
            })
            .then(data => {
                setUser(data);
                setFormData({
                    name: data.name,
                    theme: data.theme,
                    bio: data.bio,
                    linkedin: data.linkedin || '',
                    instagram: data.instagram || '',
                    github: data.github || ''
                });
                setLoading(false);
            })
            .catch(() => router.push('/login'));

        // Fetch Connections
        fetch(`/api/users/${userId}/connections`)
            .then(res => res.json())
            .then(data => setConnectionsList(data))
            .catch(err => console.error("Error fetching connections:", err));

    }, [router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const res = await fetch(`/api/users/${user.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            const updated = await res.json();
            setUser(updated);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        }
    };
    const handleSimulateConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!simulateEmail || !user) return;

        await processNfcUrl(simulateEmail); // reuse logic, assuming simulateEmail is just email or full url
        setShowSimulateInput(false);
        setSimulateEmail('');
    };

    const processNfcUrl = async (urlOrEmail: string) => {
        // Extract email if it's a URL (e.g. https://sampark.../p/email@domain.com)
        // Or if it's just an email
        let targetEmail = urlOrEmail;
        if (urlOrEmail.includes('/p/')) {
            const parts = urlOrEmail.split('/p/');
            if (parts.length > 1) {
                targetEmail = parts[1].split('?')[0]; // simple extraction
            }
        }

        // Logic to connect
        if (!user) return;

        try {
            const res = await fetch(`/api/users/${targetEmail}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'connect',
                    sourceEmail: user.id, // I am the source
                    // sourceName/Phone will be fetched by API from my profile
                })
            });

            if (res.ok) {
                const data = await res.json();
                setMessage(`Connected with ${targetEmail}! ${data.mutual ? '(Mutual)' : ''}`);
                // Refresh connections
                fetch(`/api/users/${user.id}/connections`)
                    .then(r => r.json())
                    .then(d => setConnectionsList(d));
            } else {
                setNfcError('Failed to connect with found user.');
                setTimeout(() => setNfcError(''), 3000);
            }
        } catch (err) {
            console.error(err);
            setNfcError('Connection failed.');
        }
    };

    const handleRespond = async (sourceEmail: string, status: 'Accepted' | 'Rejected') => {
        if (!user) return;
        try {
            const res = await fetch('/api/connections/respond', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sourceEmail: sourceEmail, // The person who requested
                    targetEmail: user.id,     // Me
                    status
                })
            });

            if (res.ok) {
                // Refresh list
                const updatedList = connectionsList.map(c =>
                    c.sourceEmail === sourceEmail ? { ...c, status } : c
                );
                setConnectionsList(updatedList);
                setMessage(`Request ${status}!`);
            } else {
                alert('Failed to update status');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const scanNFC = async () => {
        if ('NDEFReader' in window) {
            try {
                // @ts-ignore
                const ndef = new window.NDEFReader();
                setIsScanning(true);
                setNfcError('Bring tag close to device...');
                await ndef.scan();

                ndef.onreading = (event: any) => {
                    const decoder = new TextDecoder();
                    for (const record of event.message.records) {
                        if (record.recordType === "url") {
                            const url = decoder.decode(record.data);
                            processNfcUrl(url);
                            setIsScanning(false); // Stop scanning after one success?
                        }
                    }
                };

                ndef.onreadingerror = () => {
                    setNfcError("Cannot read data from the NFC tag. Try another one?");
                    setIsScanning(false);
                };

            } catch (error) {
                console.log("Error: " + error);
                setNfcError("NFC Access denied or not supported.");
                setIsScanning(false);
            }
        } else {
            // No NFC Support
            setNfcError("NFC is not supported on this device or browser.");
            setTimeout(() => setNfcError(''), 3000);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen pt-20 px-6">
            <nav className="glass fixed top-0 left-0 w-full z-50 px-6 py-4">
                <div className="container flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold gradient-text">
                        Sampark 2026
                    </Link>
                    <div className="flex gap-4 items-center">
                        <button
                            onClick={scanNFC}
                            className={`btn ${isScanning ? 'bg-green-600 animate-pulse' : 'btn-primary'} text-sm px-4 py-2`}
                        >
                            {isScanning ? 'Scanning...' : '⚡ Connect via NFC'}
                        </button>
                        <button onClick={() => { localStorage.removeItem('user_id'); router.push('/'); }} className="text-gray-400 hover:text-white">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container max-w-5xl mt-10">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}</h1>
                        <p className="text-gray-400">Manage your profile and track your networking stats.</p>
                        {nfcError && <div className="mt-2 text-red-400 bg-red-900/20 p-2 rounded inline-block">{nfcError}</div>}
                    </div>
                </div>

                {showSimulateInput && (
                    <div className="text-center mb-6 p-6 bg-white/5 rounded-xl border border-glass-border animate-fade-in">
                        <h3 className="text-xl font-bold mb-4">NFC Simulation Mode</h3>
                        <p className="text-gray-400 mb-4 text-sm">Since this device doesn't support Web NFC (or it's not active), enter the target email/link manually to simulate a tap.</p>
                        <form onSubmit={handleSimulateConnect} className="flex gap-2 max-w-md mx-auto">
                            <input
                                type="text"
                                placeholder="Enter Target Email (e.g. alice@example.com)"
                                value={simulateEmail}
                                onChange={e => setSimulateEmail(e.target.value)}
                                className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none"
                            />
                            <button type="submit" className="btn btn-primary whitespace-nowrap">
                                Simulate Tap
                            </button>
                            <button type="button" onClick={() => setShowSimulateInput(false)} className="text-gray-400 px-3 hover:text-white">Cancel</button>
                        </form>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-3 px-2 ${activeTab === 'profile' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}
                    >
                        Overview & Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('connections')}
                        className={`pb-3 px-2 ${activeTab === 'connections' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}
                    >
                        My Connections ({connectionsList.length})
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass p-8 h-fit">
                            <h2 className="text-2xl font-bold mb-6">Live Stats</h2>
                            <div className="text-center p-6 bg-white/5 rounded-xl border border-glass-border">
                                <div className="text-5xl font-bold gradient-text mb-2">{connectionsList.length}</div>
                                <div className="text-gray-400 uppercase tracking-widest text-sm">Connections</div>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="mb-4 text-sm text-gray-400">Share your public profile to connect:</p>
                                {user?.slug ? (
                                    <div className="space-y-2">
                                        <div className="p-3 bg-zinc-900 rounded border border-zinc-700 text-xs font-mono break-all select-all">
                                            {window.location.origin}/sampark/{user.slug}
                                        </div>
                                        <Link href={`/sampark/${user.slug}`} target="_blank" className="btn btn-outline w-full py-3 flex items-center justify-center gap-2">
                                            <span>🔗</span> View My Public Profile
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-yellow-500 text-sm p-4 bg-yellow-900/20 rounded-xl border border-yellow-700">
                                        ⚠️ Your public link is being generated. Please contact admin to run the backfill.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Update Form */}
                        <div className="glass p-8">
                            <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
                            {message && <div className="bg-green-500/20 text-green-400 p-3 rounded-lg mb-4 text-center">{message}</div>}

                            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/50 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>

                                {/* Socials */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">LinkedIn URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://linkedin.com/in/..."
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            className="w-full bg-black/50 border border-glass-border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">Instagram URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://instagram.com/..."
                                            value={formData.instagram}
                                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                            className="w-full bg-black/50 border border-glass-border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-2">GitHub URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://github.com/..."
                                            value={formData.github}
                                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                            className="w-full bg-black/50 border border-glass-border rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Interested Theme</label>
                                    <select
                                        value={formData.theme}
                                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                        className="w-full bg-black/50 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="AI Agents">AI Agents</option>
                                        <option value="Green Tech">Green Tech</option>
                                        <option value="Blockchain">Blockchain</option>
                                        <option value="IoT">IoT</option>
                                        <option value="Management">Management</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Bio / Tagline</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-black/50 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-primary h-24"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary mt-2">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Search & Actions Bar - Moved to Connections Tab */}
                {activeTab === 'connections' && (
                    <div className="flex gap-4 mb-8">
                        <Link href="/search" className="btn btn-outline flex-1 text-center py-4 text-lg font-bold hover:bg-white/10">
                            🔍 Find People & Add Connections
                        </Link>
                    </div>
                )}

                {/* Pending Requests Section */}
                {activeTab === 'connections' && (
                    <RequestsList
                        requests={connectionsList.filter(c => c.status === 'Pending' && c.direction === 'incoming')}
                        onRespond={handleRespond}
                    />
                )}

                {activeTab === 'connections' && (
                    <div className="glass p-8">
                        <h2 className="text-2xl font-bold mb-6">Your Network</h2>
                        {connectionsList.filter(c => c.status === 'Accepted').length === 0 ? (
                            <div className="text-gray-500 text-center py-10">No active connections.</div>
                        ) : (
                            <div className="grid gap-4">
                                {connectionsList.filter(c => c.status === 'Accepted').map((conn, idx) => {
                                    const isIncoming = conn.direction === 'incoming';
                                    const displayName = conn.name || (isIncoming ? conn.sourceName : (conn.targetEmail || 'Unknown User'));
                                    const displayEmail = isIncoming ? conn.sourceEmail : conn.targetEmail;
                                    const displayPhone = isIncoming ? conn.sourcePhone : ''; // We don't have target phone usually

                                    return (
                                        <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <div className="font-bold text-lg">{displayName} <span className="text-xs font-normal text-gray-500 ml-2">({isIncoming ? 'Received' : 'Sent'})</span></div>
                                                <div className="text-sm text-gray-400">
                                                    {displayEmail && <span>📧 {displayEmail}</span>}
                                                    {displayPhone && <span className="ml-3">📞 {displayPhone}</span>}
                                                </div>
                                                {conn.note && isIncoming && (
                                                    <div className="mt-2 text-sm bg-black/30 p-2 rounded text-gray-300 italic">
                                                        "{conn.note}"
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 whitespace-nowrap">
                                                {new Date(conn.timestamp).toLocaleDateString()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
