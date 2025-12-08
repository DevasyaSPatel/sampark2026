import { NextRequest, NextResponse } from 'next/server';
import { getUserConnections } from '@/lib/google-sheets';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    // In a real app, we should verify the session here 
    // to ensure only the user themselves can see their connections.
    // For this hackathon/prototype, we'll trust the frontend.

    const connections = await getUserConnections(decodedId);
    return NextResponse.json(connections);
}
