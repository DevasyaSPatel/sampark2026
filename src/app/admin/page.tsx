'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock pending users
const initialPending = [
    { id: 1, name: "Alice Smith", email: "alice@example.com", regNo: "REG2026001", theme: "AI Agents" },
    { id: 2, name: "Bob Jones", email: "bob@example.com", regNo: "REG2026002", theme: "Green Tech" },
];

export default function Admin() {
    const [pending, setPending] = useState(initialPending);
    const [message, setMessage] = useState('');

    const handleConfirm = (user: any) => {
        // Simulate ID generation and Email
        const generatedId = `SP${user.regNo.slice(-3)}`; // SP001
        const generatedPass = Math.random().toString(36).slice(-8);

        setMessage(`Confirmed ${user.name}. Credentials Sent: ID=${generatedId}, Pass=${generatedPass} (Simulated Email)`);

        // Remove from pending
        setPending(pending.filter(p => p.id !== user.id));

        setTimeout(() => setMessage(''), 5000);
    };

    return (
        <div className="min-h-screen pt-32 px-6">
            <nav className="glass fixed top-0 left-0 w-full z-50 px-6 py-4">
                <div className="container flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold gradient-text">
                        Sampark Admin
                    </Link>
                    <Link href="/login" className="text-gray-400 hover:text-white">
                        Logout
                    </Link>
                </div>
            </nav>

            <div className="container max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

                {message && (
                    <div className="bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-lg mb-8">
                        {message}
                    </div>
                )}

                <div className="glass p-8">
                    <h2 className="text-2xl font-bold mb-6">Pending Registrations</h2>

                    {pending.length === 0 ? (
                        <p className="text-gray-400">No pending registrations.</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {pending.map(user => (
                                <div key={user.id} className="flex flex-col md:flex-row justify-between items-center p-4 bg-white/5 rounded-lg border border-glass-border">
                                    <div>
                                        <h3 className="font-bold text-lg">{user.name}</h3>
                                        <div className="text-sm text-gray-400">{user.email} • {user.regNo}</div>
                                        <div className="text-xs text-blue-400 mt-1">{user.theme}</div>
                                    </div>
                                    <button
                                        onClick={() => handleConfirm(user)}
                                        className="mt-4 md:mt-0 btn btn-primary px-6 py-2 text-sm"
                                    >
                                        Confirm & Send Credentials
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
