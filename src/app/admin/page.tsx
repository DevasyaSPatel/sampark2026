'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from './Admin.module.css';
import {
    Users,
    Clock,
    CheckCircle,
    Search,
    Edit2,
    Check,
    X,
    ShieldCheck,
    LogOut
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
        // Status in sheet is often 'Pending', 'Approved' (sometimes 'Accepted'? Let's handle both)
        pending: users.filter(u => u.status === 'Pending').length,
        approved: users.filter(u => u.status === 'Approved' || u.status === 'Accepted').length
    }), [users]);


    // --- View: Login ---
    if (!isLoggedIn) {
        return (
            <div className={styles.loginOverlay}>
                <div className={styles.loginCard}>
                    <ShieldCheck size={48} className="text-[#8A2BE2] mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-white mb-2">Admin Command</h1>
                    <p className="text-[#A0AEC0] mb-8 text-sm">Restricted Access Protocol</p>

                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.loginInput}
                            placeholder="ACCESS KEY"
                            autoFocus
                        />
                        <button disabled={loading} className={styles.loginBtn}>
                            {loading ? 'AUTHENTICATING...' : 'ENTER CONSOLE'}
                        </button>
                    </form>

                    <div className="mt-8">
                        <Link href="/" className="text-xs text-[#A0AEC0] hover:text-white transition-colors">
                            ← Return to Public Zone
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- View: Dashboard ---
    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <nav className={styles.navBar}>
                <div className={styles.brand}>
                    <ShieldCheck size={24} color="#8A2BE2" />
                    <span>SAMPARK ADMIN</span>
                </div>
                <button onClick={() => setIsLoggedIn(false)} className="text-[#A0AEC0] hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
                    <LogOut size={16} /> Logout
                </button>
            </nav>

            <main className={styles.mainContent}>
                {/* Stats Row */}
                <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${styles.active1}`}>
                        <div className={styles.statIconWrapper}><Users size={24} /></div>
                        <div className={styles.statContent}>
                            <h4>Total Users</h4>
                            <p>{stats.total}</p>
                        </div>
                    </div>

                    <div className={`${styles.statCard} ${styles.active2}`}>
                        <div className={styles.statIconWrapper}><Clock size={24} /></div>
                        <div className={styles.statContent}>
                            <h4>Pending Action</h4>
                            <p>{stats.pending}</p>
                        </div>
                    </div>

                    <div className={`${styles.statCard} ${styles.active3}`}>
                        <div className={styles.statIconWrapper}><CheckCircle size={24} /></div>
                        <div className={styles.statContent}>
                            <h4>Approved</h4>
                            <p>{stats.approved}</p>
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                        <h2 className={styles.tableTitle}>Member Management</h2>

                        <div className={styles.searchBar}>
                            <Search size={16} color="#A0AEC0" />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search members..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>User Identity</th>
                                    <th>Registered Theme</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, i) => {
                                    const isPending = user.status === 'Pending';
                                    const isApproved = user.status === 'Approved' || user.status === 'Accepted';
                                    const statusClass = isApproved ? styles.approved : isPending ? styles.pending : styles.rejected;

                                    return (
                                        <tr key={i}>
                                            <td>
                                                <div className={styles.userCell}>
                                                    <span className={styles.userName}>{user.name}</span>
                                                    <span className={styles.userEmail}>{user.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="text-sm text-gray-300">{user.theme || '—'}</span>
                                            </td>
                                            <td>
                                                <span className={`${styles.statusPill} ${statusClass}`}>
                                                    {isApproved ? 'Approved' : user.status}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingUser(user)}
                                                        className={`${styles.actionBtn} ${styles.edit}`}
                                                        title="Edit User"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>

                                                    {isPending && (
                                                        <button
                                                            onClick={() => handleApprove(user)}
                                                            disabled={!!actionLoading}
                                                            className={`${styles.actionBtn} ${styles.approve}`}
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
                            <div className="p-10 text-center text-[#A0AEC0]">
                                No members found matching your search.
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            {editingUser && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Edit Member</h2>
                            <button onClick={() => setEditingUser(null)} className="text-[#A0AEC0] hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-xs uppercase text-[#A0AEC0] mb-1 block">Full Name</label>
                                <input
                                    className="w-full bg-[#121212] border border-[#2D2D3A] rounded-lg p-3 text-white focus:border-[#8A2BE2] outline-none"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase text-[#A0AEC0] mb-1 block">Email</label>
                                <input
                                    className="w-full bg-[#121212] border border-[#2D2D3A] rounded-lg p-3 text-white focus:border-[#8A2BE2] outline-none"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs uppercase text-[#A0AEC0] mb-1 block">Theme</label>
                                <select
                                    className="w-full bg-[#121212] border border-[#2D2D3A] rounded-lg p-3 text-white focus:border-[#8A2BE2] outline-none appearance-none"
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
                                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 rounded-lg bg-[#2D2D3A] text-white font-semibold hover:bg-[#3E3E4A] transition">
                                    Cancel
                                </button>
                                <button type="submit" disabled={!!actionLoading} className="flex-1 py-3 rounded-lg bg-[#8A2BE2] text-white font-semibold hover:bg-[#7c26cb] transition">
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
