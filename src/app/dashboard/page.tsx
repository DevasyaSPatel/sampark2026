'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
};

type Connection = {
    sourceName: string;
    sourceEmail: string;
    sourcePhone: string;
    note: string;
    timestamp: string;
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

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen pt-20 px-6">
            <nav className="glass fixed top-0 left-0 w-full z-50 px-6 py-4">
                <div className="container flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold gradient-text">
                        Sampark 2026
                    </Link>
                    <button onClick={() => { localStorage.removeItem('user_id'); router.push('/'); }} className="text-gray-400 hover:text-white">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="container max-w-5xl mt-10">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}</h1>
                        <p className="text-gray-400">Manage your profile and track your networking stats.</p>
                    </div>
                </div>

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
                        {/* Stats Card */}
                        <div className="glass p-8 h-fit">
                            <h2 className="text-2xl font-bold mb-6">Live Stats</h2>
                            <div className="text-center p-6 bg-white/5 rounded-xl border border-glass-border">
                                <div className="text-5xl font-bold gradient-text mb-2">{connectionsList.length}</div>
                                <div className="text-gray-400 uppercase tracking-widest text-sm">Connections</div>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="mb-4 text-sm text-gray-400">Share your public profile to connect:</p>
                                <Link href={`/p/${user?.id}`} target="_blank" className="btn btn-outline w-full py-3 flex items-center justify-center gap-2">
                                    <span>🔗</span> Public Profile Link (NFC Target)
                                </Link>
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

                {activeTab === 'connections' && (
                    <div className="glass p-8">
                        <h2 className="text-2xl font-bold mb-6">People who connected with you</h2>
                        {connectionsList.length === 0 ? (
                            <div className="text-gray-500 text-center py-10">No connections yet. Share your profile!</div>
                        ) : (
                            <div className="grid gap-4">
                                {connectionsList.map((conn, idx) => (
                                    <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <div className="font-bold text-lg">{conn.sourceName || 'Anonymous User'}</div>
                                            <div className="text-sm text-gray-400">
                                                {conn.sourceEmail && <span>📧 {conn.sourceEmail}</span>}
                                                {conn.sourcePhone && <span className="ml-3">📞 {conn.sourcePhone}</span>}
                                            </div>
                                            {conn.note && (
                                                <div className="mt-2 text-sm bg-black/30 p-2 rounded text-gray-300 italic">
                                                    "{conn.note}"
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 whitespace-nowrap">
                                            {new Date(conn.timestamp).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
