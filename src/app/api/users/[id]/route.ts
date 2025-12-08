import { NextRequest, NextResponse } from 'next/server';
import { getUser, addConnection } from '@/lib/google-sheets';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    // Decode ID if it's an email (URLs might encode it)
    const decodedId = decodeURIComponent(id);
    const user = await getUser(decodedId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const targetEmail = decodeURIComponent(id);

    // Handle "connect" action or "update" action
    if (body.action === 'connect') {
        const sourceEmail = body.sourceEmail; // Expecting source email in body
        if (!sourceEmail) {
            return NextResponse.json({ error: 'Source email required' }, { status: 400 });
        }

        await addConnection(sourceEmail, targetEmail);
        return NextResponse.json({ success: true });
    } else {
        // Update user not supported in Sheets yet (requires updateRow)
        // For now, return mock success or error
        return NextResponse.json({ message: "Update not implemented for Sheets yet" });
    }
}
