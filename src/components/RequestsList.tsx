'use client';

import { useState } from 'react';
import { User, Check, X } from 'lucide-react';

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
        <div className="bg-white p-6 mb-8 rounded-xl border border-ieee-warning/30 shadow-sm">
            <h3 className="text-xl font-bold mb-4 text-ieee-navy flex items-center gap-2">
                <span className="w-2 h-8 bg-ieee-warning rounded-full"></span>
                Pending Connection Requests
            </h3>
            <div className="grid gap-3">
                {requests.map((req, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all">
                        <div className="flex-1">
                            <div className="font-bold text-lg text-ieee-navy flex items-center gap-2">
                                <User size={18} className="text-gray-400" />
                                {req.sourceName || 'Anonymous'}
                            </div>
                            <div className="text-sm text-gray-500 ml-6">wants to connect</div>
                            {req.note && (
                                <div className="mt-2 text-sm italic text-gray-600 bg-white p-2 rounded border border-gray-100 ml-6">
                                    "{req.note}"
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 w-full md:w-auto ml-6 md:ml-0">
                            <button
                                onClick={() => onRespond(req.sourceEmail, 'Accepted')}
                                className="flex-1 md:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow-sm flex items-center justify-center gap-1 transition-colors"
                            >
                                <Check size={16} /> Accept
                            </button>
                            <button
                                onClick={() => onRespond(req.sourceEmail, 'Rejected')}
                                className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg font-bold text-sm shadow-sm flex items-center justify-center gap-1 transition-colors"
                            >
                                <X size={16} /> Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
