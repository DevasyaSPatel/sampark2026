'use client';

import { useState } from 'react';

type Connection = {
    sourceName: string;
    sourceEmail: string;
    sourcePhone: string; // Optional
    note: string;
    timestamp: string;
    status: string;
};

export default function RequestsList({ requests, onRespond }: { requests: Connection[], onRespond: (email: string, status: 'Accepted' | 'Rejected') => void }) {
    if (requests.length === 0) return null;

    return (
        <div className="glass p-6 mb-8 border border-yellow-500/30 bg-yellow-900/10">
            <h3 className="text-xl font-bold mb-4 text-yellow-500">Pending Connection Requests</h3>
            <div className="grid gap-4">
                {requests.map((req, idx) => (
                    <div key={idx} className="bg-black/40 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                            <div className="font-bold text-lg">{req.sourceName || 'Anonymous'}</div>
                            <div className="text-sm text-gray-400">wants to connect</div>
                            {req.note && (
                                <div className="mt-2 text-sm italic text-gray-300">"{req.note}"</div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onRespond(req.sourceEmail, 'Accepted')}
                                className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-sm"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => onRespond(req.sourceEmail, 'Rejected')}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-bold text-sm"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
