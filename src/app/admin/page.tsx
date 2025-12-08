'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit State
    const [editingUser, setEditingUser] = useState<any | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users?password=${password}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
                setIsLoggedIn(true);
            } else {
                alert('Invalid Password');
            }
        } catch (error) {
            alert('Error logging in');
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        const res = await fetch(`/api/admin/users?password=${password}`);
        if (res.ok) {
            const data = await res.json();
            setUsers(data.users);
        }
    };

    const handleApprove = async (user: any) => {
        if (!confirm(`Approve ${user.name} and send email?`)) return;

        setActionLoading(user.email);
        try {
            const res = await fetch('/api/admin/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password,
                    rowIndex: user.rowIndex,
                    email: user.email,
                    name: user.name,
                })
            });

            if (res.ok) {
                alert('Approved & Email Sent!');
                refreshData();
            } else {
                alert('Failed to approve');
            }
        } catch (error) {
            alert('Error approving');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setActionLoading('editing');
        try {
            const dataToUpdate = {
                name: editingUser.name,
                email: editingUser.email,
                phone: editingUser.phone,
                university: editingUser.university,
                department: editingUser.department,
                year: editingUser.year,
                theme: editingUser.theme,
                participationType: editingUser.participationType,
                teamName: editingUser.teamName,
                anythingElse: editingUser.anythingElse
            };

            const res = await fetch('/api/admin/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password,
                    rowIndex: editingUser.rowIndex,
                    data: dataToUpdate
                })
            });

            if (res.ok) {
                alert('User Updated!');
                setEditingUser(null);
                refreshData();
            } else {
                alert('Failed to update');
            }
        } catch (error) {
            alert('Error updating');
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const stats = useMemo(() => ({
        total: users.length,
        pending: users.filter(u => u.status === 'Pending').length,
        approved: users.filter(u => u.status === 'Approved').length
    }), [users]);


    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center relative px-4 pt-20">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-600 opacity-20 blur-[100px] rounded-full"></div>
                </div>

                {/* Navigation */}
                <nav className="fixed top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center bg-transparent z-50">
                    <Link href="/" className="text-lg md:text-xl font-bold hover:text-primary transition-colors">
                        Sampark 2026
                    </Link>
                    <Link href="/" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-xs md:text-sm border border-white/10">
                        ← Home
                    </Link>
                </nav>

                <div className="glass p-8 md:p-12 w-full max-w-md z-10">
                    <h1 className="text-3xl font-bold mb-2 text-center text-white">Admin Access</h1>
                    <p className="text-gray-400 text-center mb-8">Restricted Area</p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Access Key</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-glass-border rounded-lg p-3 text-white text-center tracking-widest focus:outline-none focus:border-primary transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button disabled={loading} className="btn btn-primary w-full py-3">
                            {loading ? 'Verifying...' : 'Unlock Panel'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-6 pb-20 text-white relative">
            <div className="absolute inset-0 z-0 bg-black"></div>
            {/* Main Content */}
            <div className="relative z-10 container mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <h1 className="text-4xl font-bold gradient-text">Admin Dashboard</h1>
                    <button onClick={() => setIsLoggedIn(false)} className="text-sm text-gray-500 hover:text-white">Logout</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="glass p-6 text-center">
                        <h3 className="text-gray-400 text-sm mb-2">Total Registrations</h3>
                        <p className="text-4xl font-bold">{stats.total}</p>
                    </div>
                    <div className="glass p-6 text-center border-yellow-500/30">
                        <h3 className="text-yellow-400 text-sm mb-2">Pending Approval</h3>
                        <p className="text-4xl font-bold text-yellow-500">{stats.pending}</p>
                    </div>
                    <div className="glass p-6 text-center border-green-500/30">
                        <h3 className="text-green-400 text-sm mb-2">Approved Members</h3>
                        <p className="text-4xl font-bold text-green-500">{stats.approved}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass px-4 py-2 w-full max-w-md bg-transparent text-white focus:outline-none focus:border-primary"
                    />
                </div>

                <div className="glass overflow-hidden rounded-xl border border-glass-border">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/10 text-white">
                            <tr className="border-b border-glass-border uppercase text-xs tracking-wider">
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Phone</th>
                                <th className="p-4 font-semibold">Theme</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredUsers.map((user, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{user.name}</td>
                                    <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{user.email}</td>
                                    <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{user.phone}</td>
                                    <td className="p-4"><span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs whitespace-nowrap">{user.theme}</span></td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${user.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                                            user.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-4 items-center whitespace-nowrap">
                                            <button
                                                onClick={() => setEditingUser(user)}
                                                className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded transition text-white"
                                            >
                                                Edit
                                            </button>
                                            {user.status !== 'Approved' && (
                                                <button
                                                    onClick={() => handleApprove(user)}
                                                    disabled={!!actionLoading}
                                                    className="px-3 py-1.5 text-xs bg-primary hover:bg-blue-600 text-white rounded transition disabled:opacity-50"
                                                >
                                                    {actionLoading === user.email ? 'Sending...' : 'Approve'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No users found.
                        </div>
                    )}
                </div>
            </div>

            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="glass p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Edit User</h2>
                            <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-white">&times;</button>
                        </div>
                        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-400">Full Name</label>
                                <input className="w-full glass p-2 mt-1 text-white" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Email</label>
                                <input className="w-full glass p-2 mt-1 text-white" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Phone</label>
                                <input className="w-full glass p-2 mt-1 text-white" value={editingUser.phone} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Theme</label>
                                <select className="w-full glass p-2 mt-1 text-white bg-black/80" value={editingUser.theme} onChange={(e) => setEditingUser({ ...editingUser, theme: e.target.value })}>
                                    <option>AI Agents</option>
                                    <option>Green Tech</option>
                                    <option>Blockchain</option>
                                    <option>IoT</option>
                                    <option>Management</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400">Year</label>
                                <input className="w-full glass p-2 mt-1 text-white" value={editingUser.year} onChange={(e) => setEditingUser({ ...editingUser, year: e.target.value })} />
                            </div>

                            <div className="md:col-span-2 mt-4 flex gap-3 justify-end">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20">Cancel</button>
                                <button type="submit" disabled={!!actionLoading} className="btn btn-primary px-6 py-2">
                                    {actionLoading === 'editing' ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
