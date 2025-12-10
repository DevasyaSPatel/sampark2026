"use client";

import React, { useState, useEffect, useMemo } from 'react';
import styles from './Search.module.css';
import ParticipantProfileCard from '@/components/ParticipantProfileCard';

type User = {
    id: string; // email
    name: string;
    theme: string;
    connections: number;
    bio?: string;
    participationType?: string;
};

type ConnectionStatus = 'None' | 'Pending' | 'Accepted';

export default function SearchPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [myConnections, setMyConnections] = useState<Map<string, string>>(new Map());
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('Default');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            const storedId = localStorage.getItem('user_id');
            setCurrentUserId(storedId);

            try {
                // 1. Fetch All Users
                const usersRes = await fetch('/api/directory');
                const usersData = await usersRes.json();

                if (Array.isArray(usersData)) {
                    setUsers(usersData);
                }

                // 2. Fetch My Connections (if logged in) to determine status
                if (storedId) {
                    const connRes = await fetch(`/api/connections?user=${storedId}`);
                    const connData = await connRes.json();

                    if (Array.isArray(connData)) {
                        const map = new Map<string, string>();
                        connData.forEach((c: any) => {
                            const otherEmail = c.sourceEmail === storedId ? c.targetEmail : c.sourceEmail;
                            map.set(otherEmail.trim().toLowerCase(), c.status);
                        });
                        setMyConnections(map);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch search data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Derived Logic
    const processedUsers = useMemo(() => {
        let result = users;

        // 1. Filter Self
        if (currentUserId) {
            result = result.filter(u => u.id.trim().toLowerCase() !== currentUserId.trim().toLowerCase());
        }

        // 2. Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(u =>
                u.name.toLowerCase().includes(q) ||
                (u.theme && u.theme.toLowerCase().includes(q))
            );
        }

        // 3. Sort
        if (sortBy === 'Newest') {
            result = [...result].reverse();
        } else if (sortBy === 'Alphabetical') {
            result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        }

        return result;
    }, [users, searchQuery, sortBy, currentUserId]);

    const handleConnect = async (targetUserId: string) => {
        if (!currentUserId) return;

        // Optimistic UI Update
        setMyConnections(prev => new Map(prev).set(targetUserId.trim().toLowerCase(), 'Pending'));

        try {
            await fetch(`/api/users/${targetUserId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'connect',
                    sourceEmail: currentUserId
                })
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <div className={styles.headerContainer}>
                {/* Left: Filters */}
                <div className={styles.filterGroup}>
                    <select className={styles.dropdown} value="All Members">
                        <option>All Members</option>
                    </select>

                    <select
                        className={styles.dropdown}
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="Default">Default</option>
                        <option value="Newest">Newest</option>
                        <option value="Alphabetical">Alphabetical</option>
                    </select>
                </div>

                {/* Right: Actions */}
                <div className={styles.actionsGroup}>
                    {/* View Toggles */}
                    <div className={styles.viewToggles}>
                        <button
                            className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            {/* Grid Icon */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        </button>
                        <button
                            className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            {/* List Icon */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className={styles.searchWrapper}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Find members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className={styles.resultCount}>{processedUsers.length}</span>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            {loading ? (
                <div className="flex justify-center items-center h-64 text-gray-500">Loading directory...</div>
            ) : (
                <div className={viewMode === 'grid' ? styles.gridContainer : styles.listContainer}>
                    {processedUsers.map(user => {
                        const rawStatus = myConnections.get(user.id.trim().toLowerCase());
                        let status: ConnectionStatus = 'None';
                        if (rawStatus === 'Accepted') status = 'Accepted';
                        if (rawStatus === 'Pending') status = 'Pending';

                        return (
                            <ParticipantProfileCard
                                key={user.id}
                                user={user}
                                isLoggedIn={!!currentUserId}
                                connectionStatus={status}
                                onConnect={() => handleConnect(user.id)}
                            />
                        );
                    })}

                    {processedUsers.length === 0 && (
                        <div className="text-center w-full text-gray-500 py-20 col-span-full">
                            No members found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
