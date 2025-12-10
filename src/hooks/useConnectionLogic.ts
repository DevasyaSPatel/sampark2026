import { useMemo } from 'react';

// Define the minimum requirements for the hook to work
interface BaseConnection {
    status: string;
    direction?: 'incoming' | 'outgoing';
    [key: string]: any;
}

export const useConnectionLogic = <T extends BaseConnection>(connections: T[]) => {
    return useMemo(() => {
        // 1. Accepted Connections
        const acceptedConnections = connections.filter(c =>
            c.status?.toLowerCase() === 'accepted'
        );

        // 2. Pending Requests (Pending or Sent)
        const pendingRequests = connections.filter(c => {
            const s = c.status?.toLowerCase();
            return s === 'pending' || s === 'sent';
        });

        // Helper: Split pending into Incoming vs Outgoing (Sent)
        const incomingRequests = pendingRequests.filter(c => c.direction === 'incoming');
        const sentRequests = pendingRequests.filter(c => c.direction === 'outgoing');

        return {
            acceptedConnections,
            pendingRequests,
            incomingRequests,
            sentRequests
        };
    }, [connections]);
};
