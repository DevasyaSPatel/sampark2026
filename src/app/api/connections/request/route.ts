import { NextRequest, NextResponse } from 'next/server';
import { addConnection, getUser, getConnectionStatus } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sourceEmail, targetEmail, note } = body;

        if (!sourceEmail || !targetEmail) {
            return NextResponse.json({ error: 'Missing email addresses' }, { status: 400 });
        }

        // 1. Validate Source User
        const sourceUser = await getUser(sourceEmail);
        if (!sourceUser) {
            console.error("Source user not found:", sourceEmail); // DEBUG LOG
            return NextResponse.json({ error: `User ${sourceEmail} not registered in system` }, { status: 404 });
        }

        if (sourceEmail === targetEmail) {
            return NextResponse.json({ error: 'Cannot connect with yourself' }, { status: 400 });
        }

        // 2. Check for existing connection
        const status = await getConnectionStatus(sourceEmail, targetEmail);
        if (status !== 'None') {
            return NextResponse.json({ error: `Connection already exists (Status: ${status})` }, { status: 409 });
        }

        const success = await addConnection({
            sourceEmail,
            targetEmail,
            note,
            sourceName: sourceUser.name,
            sourcePhone: sourceUser.phone
        });

        if (!success) {
            console.error("Failed to add connection to sheet"); // DEBUG LOG
            return NextResponse.json({ error: 'Database write failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Connection Request Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
