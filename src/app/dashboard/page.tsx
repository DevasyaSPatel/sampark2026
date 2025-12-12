'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Navbar from '@/components/Navbar';
import RequestsList from '@/components/RequestsList';
import { useConnectionLogic } from '@/hooks/useConnectionLogic'; // Import the new hook

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
    slug: string;
};

type Connection = {
    sourceName: string;
    sourceEmail: string;
    targetEmail?: string;
    sourcePhone: string;
    note: string;
    timestamp: string;
    status: string;
    direction?: 'incoming' | 'outgoing';
    name?: string;
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

    // Use the robust hook for filtering
    const { acceptedConnections, incomingRequests, sentRequests } = useConnectionLogic(connectionsList);

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

        await processNfcUrl(simulateEmail);
        setShowSimulateInput(false);
        setSimulateEmail('');
    };

    const processNfcUrl = async (urlOrEmail: string) => {
        let targetEmail = urlOrEmail;
        if (urlOrEmail.includes('/p/')) {
            const parts = urlOrEmail.split('/p/');
            if (parts.length > 1) {
                targetEmail = parts[1].split('?')[0];
            }
        }

        if (!user) return;

        try {
            const res = await fetch(`/api/users/${targetEmail}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'connect',
                    sourceEmail: user.id,
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
                    sourceEmail: sourceEmail,
                    targetEmail: user.id,
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
                            setIsScanning(false);
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
            setNfcError("NFC is not supported on this device or browser.");
            setTimeout(() => setNfcError(''), 3000);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen pt-20 px-4 md:px-8 bg-gray-50 font-sans">
            <Navbar isLoggedIn={true} />

            <div className="max-w-6xl mx-auto mt-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-ieee-navy mb-2">Welcome, {user?.name}</h1>
                        <p className="text-gray-500">Manage your profile and track your networking stats.</p>
                        {nfcError && <div className="mt-2 text-red-600 bg-red-50 p-2 rounded border border-red-200 text-sm font-medium">{nfcError}</div>}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={scanNFC}
                            className={`px-4 py-2 rounded-lg font-semibold text-white shadow-md transition-all ${isScanning ? 'bg-green-600 animate-pulse' : 'bg-ieee-warning hover:bg-amber-600'}`}
                        >
                            {isScanning ? 'Scanning...' : '⚡ Connect via NFC'}
                        </button>
                    </div>
                </div>

                {showSimulateInput && (
                    <div className="text-center mb-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm animate-fade-in">
                        <h3 className="text-lg font-bold mb-4 text-ieee-navy">NFC Simulation Mode</h3>
                        <p className="text-gray-500 mb-4 text-sm">Since this device doesn't support Web NFC (or it's not active), enter the target email/link manually to simulate a tap.</p>
                        <form onSubmit={handleSimulateConnect} className="flex gap-2 max-w-md mx-auto">
                            <input
                                type="text"
                                placeholder="Enter Target Email (e.g. alice@example.com)"
                                value={simulateEmail}
                                onChange={e => setSimulateEmail(e.target.value)}
                                className="flex-1 bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-ieee-blue"
                            />
                            <button type="submit" className="bg-ieee-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                Simulate Tap
                            </button>
                            <button type="button" onClick={() => setShowSimulateInput(false)} className="text-gray-400 px-3 hover:text-gray-600">Cancel</button>
                        </form>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-6 mb-8 border-b border-gray-200 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'profile' ? 'text-ieee-blue border-ieee-blue' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                    >
                        Overview & Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('connections')}
                        className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'connections' ? 'text-ieee-blue border-ieee-blue' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                    >
                        My Connections ({acceptedConnections.length})
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit">
                            <h2 className="text-xl font-bold mb-6 text-ieee-navy">Live Stats</h2>
                            <div className="text-center p-8 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="text-6xl font-bold text-ieee-blue mb-2">{acceptedConnections.length}</div>
                                <div className="text-ieee-navy font-semibold uppercase tracking-widest text-xs">Connections</div>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="mb-4 text-sm text-gray-500">Share your public profile to connect:</p>
                                {user?.slug ? (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs font-mono break-all select-all text-gray-600">
                                            {window.location.origin}/sampark/{user.slug}
                                        </div>
                                        <Link href={`/sampark/${user.slug}`} target="_blank" className="block w-full text-center py-3 border border-ieee-blue text-ieee-blue rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                                            <span>🔗</span> View My Public Profile
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-amber-700 text-sm p-4 bg-amber-50 rounded-xl border border-amber-200">
                                        ⚠️ Your public link is being generated. Please contact admin.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Update Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 text-ieee-navy">Update Profile</h2>
                            {message && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-center border border-green-200">{message}</div>}
                            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-ieee-blue focus:ring-1 focus:ring-blue-100"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">LinkedIn URL</label>
                                        <input
                                            type="text"
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-ieee-blue"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Instagram URL</label>
                                        <input
                                            type="text"
                                            value={formData.instagram}
                                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-ieee-blue"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">GitHub URL</label>
                                        <input
                                            type="text"
                                            value={formData.github}
                                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:border-ieee-blue"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Interested Theme</label>
                                    <select
                                        value={formData.theme}
                                        onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-ieee-blue appearance-none"
                                    >
                                        <option value="AI Agents">AI Agents</option>
                                        <option value="Green Tech">Green Tech</option>
                                        <option value="Blockchain">Blockchain</option>
                                        <option value="IoT">IoT</option>
                                        <option value="Management">Management</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Tagline</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 focus:outline-none focus:border-ieee-blue h-24 resize-none"
                                    />
                                </div>
                                <button type="submit" className="bg-ieee-navy text-white hover:bg-black py-3 rounded-lg font-bold shadow-lg transition-transform active:scale-95">
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Search & Actions Bar - Moved to Connections Tab */}
                {activeTab === 'connections' && (
                    <div className="flex gap-4 mb-8">
                        <Link href="/search" className="flex-1 bg-white border border-gray-300 text-ieee-navy py-4 rounded-xl text-lg font-bold hover:shadow-md hover:border-ieee-blue transition-all text-center flex items-center justify-center gap-2">
                            🔍 Find People & Add Connections
                        </Link>
                    </div>
                )}

                {/* Incoming Requests Section */}
                {activeTab === 'connections' && (
                    <div className="mb-8">
                        <RequestsList
                            requests={incomingRequests}
                            onRespond={handleRespond}
                        />
                    </div>
                )}

                {/* Sent Requests Section (Optional) */}
                {activeTab === 'connections' && sentRequests.length > 0 && (
                    <div className="mb-8 p-6 bg-gray-100 rounded-xl border border-gray-200">
                        <h3 className="text-lg font-bold mb-4 text-gray-500">Sent Requests ({sentRequests.length})</h3>
                        <div className="grid gap-3">
                            {sentRequests.map((req, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-ieee-navy">{req.name || req.targetEmail}</div>
                                        <div className="text-xs text-gray-400">Status: Sent / Pending</div>
                                    </div>
                                    <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">Waiting...</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'connections' && (
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-12">
                        <h2 className="text-xl font-bold mb-6 text-ieee-navy">Your Network</h2>
                        {acceptedConnections.length === 0 ? (
                            <div className="text-gray-400 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                No active connections yet. Go find some people!
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {acceptedConnections.map((conn, idx) => {
                                    const isIncoming = conn.direction === 'incoming';
                                    const displayName = conn.name || (isIncoming ? conn.sourceName : (conn.targetEmail || 'Unknown User'));
                                    const displayEmail = isIncoming ? conn.sourceEmail : conn.targetEmail;
                                    const displayPhone = isIncoming ? conn.sourcePhone : '';

                                    return (
                                        <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <div className="font-bold text-lg text-ieee-navy">{displayName}</div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {displayEmail && <span className="mr-3">📧 {displayEmail}</span>}
                                                    {displayPhone && <span>📞 {displayPhone}</span>}
                                                </div>
                                                {conn.note && isIncoming && (
                                                    <div className="mt-2 text-sm bg-gray-50 p-2 rounded text-gray-600 italic border border-gray-100">
                                                        "{conn.note}"
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400 whitespace-nowrap bg-gray-50 px-3 py-1 rounded-full">
                                                Connected: {new Date(conn.timestamp).toLocaleDateString()}
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
