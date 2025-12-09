'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type SearchResult = {
    name: string;
    theme: string;
    slug: string;
};

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        setLoading(true);
        // If query is empty, fetch all (or random) users for Explore
        // If query has text, use search
        const endpoint = debouncedQuery.length < 2
            ? '/api/users/search?type=explore'
            : `/api/users/search?q=${encodeURIComponent(debouncedQuery)}`;

        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                setResults(data.results || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [debouncedQuery]);

    return (
        <div className="min-h-screen bg-black text-white pt-20 px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-blue-900/20 to-black pointer-events-none" />
            <div className="absolute top-20 -left-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <nav className="glass fixed top-0 left-0 w-full z-50 px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md">
                <div className="container flex justify-between items-center mx-auto">
                    <Link href="/" className="text-xl font-bold gradient-text">
                        Sampark 2026
                    </Link>
                    <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                        <span>←</span> Back to Dashboard
                    </Link>
                </div>
            </nav>

            <div className="container max-w-4xl mt-10 mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
                        Discover People
                    </h1>
                    <p className="text-gray-400 text-lg">Find peers, explore themes, and build your network.</p>
                </div>

                <div className="relative mb-12 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="relative w-full bg-black/80 border border-white/10 rounded-2xl p-5 text-xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder:text-gray-600"
                        autoFocus
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500">
                        {loading ? '...' : '🔍'}
                    </div>
                </div>

                {/* Min height container to prevent layout shift */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-48 bg-white/5 rounded-2xl border border-white/5"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
                            {/* Results will be mapped here in next chunk or just leave closing tag here if I replace the whole block? 
                                Wait, I need to wrap the map. Let me replace lines 83-106 to be safe.
                             */}
                            {results.map((user, idx) => (
                                <Link href={`/sampark/${user.slug}`} key={idx} className="block group">
                                    <div className="h-full bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/5 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 ring-2 ring-black">
                                            {user.name.charAt(0)}
                                        </div>
                                        <h3 className="font-bold text-lg text-white mb-1 group-hover:text-purple-300 transition-colors">{user.name}</h3>
                                        <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium mb-4">{user.theme || 'Participant'}</p>
                                        <div className="mt-auto px-4 py-2 rounded-full bg-white/5 text-xs text-gray-400 group-hover:bg-purple-500/20 group-hover:text-purple-200 transition-colors">
                                            View Profile
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {!loading && debouncedQuery.length >= 2 && results.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🤔</div>
                        <h3 className="text-xl font-bold text-gray-300">No users found</h3>
                        <p className="text-gray-500">Try searching for a different name.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
