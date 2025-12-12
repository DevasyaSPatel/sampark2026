'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
    Users,
    Clock,
    CheckCircle,
    Search,
    Edit2,
    Check,
    X,
    ShieldCheck,
    LogOut,
    Menu
} from 'lucide-react';

export default function AdminDashboard() {
    // Auth State
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Data State
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit State
    const [editingUser, setEditingUser] = useState<any | null>(null);

    // --- Authentication ---
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
                alert('Invalid Access Key');
            }
        } catch (error) {
            console.error(error);
            alert('Connection Error');
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

    // --- Actions ---
    const handleApprove = async (user: any) => {
        if (!confirm(`Approve ${user.name}? This will send a confirmation email.`)) return;

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
                // Optimistic Update
                setUsers(prev => prev.map(u => u.email === user.email ? { ...u, status: 'Approved' } : u));
                alert(`✅ User Approved: ${user.name}`);
                refreshData();
            } else {
                alert('Failed to approve');
            }
        } catch (error) {
            console.error(error);
            alert('System Error');
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
                alert('✅ User Saved');
                setEditingUser(null);
                refreshData();
            } else {
                alert('Save failed');
            }
        } catch (error) {
            alert('Error updating');
        } finally {
            setActionLoading(null);
        }
    };

    // --- Derived Data ---
    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const stats = useMemo(() => ({
        total: users.length,
        pending: users.filter(u => u.status === 'Pending').length,
        approved: users.filter(u => u.status === 'Approved' || u.status === 'Accepted').length
    }), [users]);


    // --- View: Login ---
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                    <div className="text-center mb-8">
                        <ShieldCheck size={48} className="text-ieee-blue mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-ieee-navy mb-2">Admin Command</h1>
                        <p className="text-gray-500 text-sm">Restricted Access Protocol</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-ieee-blue focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            placeholder="ACCESS KEY"
                            autoFocus
                        />
                        <button
                            disabled={loading}
                            className="w-full bg-ieee-blue hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md"
                        >
                            {loading ? 'AUTHENTICATING...' : 'ENTER CONSOLE'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href="/" className="text-sm text-gray-400 hover:text-ieee-blue transition-colors">
                            ← Return to Public Zone
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- View: Dashboard ---
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            {/* Header */}
            <nav className="fixed top-0 w-full z-40 bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-6">
                <div className="flex items-center gap-3 text-ieee-navy font-bold text-xl tracking-tight">
                    <ShieldCheck size={24} className="text-ieee-blue" />
                    <span>SAMPARK ADMIN</span>
                </div>
                <button onClick={() => setIsLoggedIn(false)} className="text-gray-500 hover:text-red-500 flex items-center gap-2 text-sm font-medium transition-colors">
                    <LogOut size={16} /> Logout
                </button>
            </nav>

            <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-ieee-blue rounded-lg"><Users size={24} /></div>
                        <div>
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Users</h4>
                            <p className="text-3xl font-bold text-ieee-navy">{stats.total}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Clock size={24} /></div>
                        <div>
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Pending Action</h4>
                            <p className="text-3xl font-bold text-ieee-navy">{stats.pending}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
                        <div>
                            <h4 className="text-gray-500 text-sm font-medium uppercase tracking-wide">Approved</h4>
                            <p className="text-3xl font-bold text-ieee-navy">{stats.approved}</p>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold text-ieee-navy">Member Management</h2>

                        <div className="relative w-full md:w-auto">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="w-full md:w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-ieee-blue transition-colors"
                                placeholder="Search members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <th className="px-6 py-4">User Identity</th>
                                    <th className="px-6 py-4">Registered Theme</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user, i) => {
                                    const isPending = user.status === 'Pending';
                                    const isApproved = user.status === 'Approved' || user.status === 'Accepted';

                                    let statusClasses = "bg-gray-100 text-gray-600";
                                    if (isApproved) statusClasses = "bg-green-50 text-green-700 border border-green-200";
                                    if (isPending) statusClasses = "bg-amber-50 text-amber-700 border border-amber-200";

                                    return (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-ieee-navy">{user.name}</span>
                                                    <span className="text-sm text-gray-500">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-gray-600 font-medium">{user.theme || '—'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses}`}>
                                                    {isApproved ? 'Approved' : user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingUser(user)}
                                                        className="p-2 text-gray-400 hover:text-ieee-blue hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Edit User"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>

                                                    {isPending && (
                                                        <button
                                                            onClick={() => handleApprove(user)}
                                                            disabled={!!actionLoading}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                            title="Approve User"
                                                        >
                                                            {actionLoading === user.email ? (
                                                                <Clock size={18} className="animate-spin" />
                                                            ) : (
                                                                <Check size={18} />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="p-10 text-center text-gray-400">
                                No members found matching your search.
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-ieee-navy">Edit Member</h2>
                            <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs uppercase text-gray-400 font-semibold mb-1 block">Full Name</label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-ieee-blue outline-none transition-colors"
                                        value={editingUser.name}
                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-400 font-semibold mb-1 block">Email</label>
                                    <input
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-ieee-blue outline-none transition-colors"
                                        value={editingUser.email}
                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs uppercase text-gray-400 font-semibold mb-1 block">Theme</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-ieee-blue outline-none transition-colors appearance-none bg-white"
                                        value={editingUser.theme}
                                        onChange={(e) => setEditingUser({ ...editingUser, theme: e.target.value })}
                                    >
                                        <option>AI Agents</option>
                                        <option>Green Tech</option>
                                        <option>Blockchain</option>
                                        <option>IoT</option>
                                        <option>Management</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2 mt-6 flex gap-4">
                                    <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={!!actionLoading} className="flex-1 py-3 rounded-lg bg-ieee-blue text-white font-semibold hover:bg-blue-700 transition shadow-md">
                                        {actionLoading === 'editing' ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
