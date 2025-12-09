import { NextRequest, NextResponse } from 'next/server';
import { updateConnectionStatus } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sourceEmail, targetEmail, status } = body;

        if (!sourceEmail || !targetEmail || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (status !== 'Accepted' && status !== 'Rejected') {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // Update the connection status
        // Note: Logic in google-sheets.ts expects (sourceEmail, targetEmail)
        // If I am 'targetEmail' accepting a request from 'sourceEmail':
        // The API caller should pass arguments correctly.
        // E.g. I am User B (Target), I accept User A (Source).
        // Front-end should call with sourceEmail=A, targetEmail=B.

        const success = await updateConnectionStatus(sourceEmail, targetEmail, status);

        if (success) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
        }
    } catch (error) {
        console.error("Connection respond error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
