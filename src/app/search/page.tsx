"use client";

import React, { useState, useEffect, useMemo } from 'react';
import ParticipantProfileCard from '@/components/ParticipantProfileCard';
import Navbar from '@/components/Navbar';
import { Search, Grid, List as ListIcon } from 'lucide-react';

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
        <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4 md:px-8 font-sans">
            <Navbar isLoggedIn={!!currentUserId} />

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-10 mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Left: Filters */}
                <div className="flex gap-4">
                    <select
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm focus:border-ieee-blue outline-none shadow-sm cursor-pointer"
                        value="All Members"
                        onChange={() => { }}
                    >
                        <option>All Members</option>
                    </select>

                    <select
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm focus:border-ieee-blue outline-none shadow-sm cursor-pointer"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="Default">Default</option>
                        <option value="Newest">Newest</option>
                        <option value="Alphabetical">Alphabetical</option>
                    </select>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* View Toggles */}
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200">
                        <button
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-ieee-blue text-white' : 'text-gray-400 hover:text-ieee-navy'}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-ieee-blue text-white' : 'text-gray-400 hover:text-ieee-navy'}`}
                            onClick={() => setViewMode('list')}
                        >
                            <ListIcon size={18} />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-64 max-w-xs">
                        <Search size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            className="w-full pl-6 pr-10 py-2 bg-transparent border-b-2 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-ieee-blue outline-none text-sm transition-colors"
                            placeholder="Find members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-ieee-blue">
                            {processedUsers.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center h-64 text-gray-500 font-medium">Loading directory...</div>
            ) : (
                <div className={`max-w-7xl mx-auto ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4 max-w-4xl'}`}>
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
                        <div className="text-center w-full text-gray-400 py-20 col-span-full">
                            No members found matching "{searchQuery}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
