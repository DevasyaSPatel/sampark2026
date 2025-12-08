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
};

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        theme: '',
        bio: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            router.push('/login');
            return;
        }

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
                    bio: data.bio
                });
                setLoading(false);
            })
            .catch(() => router.push('/login'));
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
                <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}</h1>
                <p className="text-gray-400 mb-10">Manage your profile and track your networking stats.</p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Stats Card */}
                    <div className="glass p-8">
                        <h2 className="text-2xl font-bold mb-6">Live Stats</h2>
                        <div className="text-center p-6 bg-white/5 rounded-xl border border-glass-border">
                            <div className="text-5xl font-bold gradient-text mb-2">{user?.connections}</div>
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
                                    className="w-full bg-black/50 border border-glass-border rounded-lg p-3 text-white focus:outline-none focus:border-primary h-32"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary mt-2">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
