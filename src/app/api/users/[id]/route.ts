import { NextRequest, NextResponse } from 'next/server';
import { getUser, updateUser, connectWithUser } from '@/lib/db';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const user = await getUser(id);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove password
    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();

    // Handle "connect" action or "update" action
    if (body.action === 'connect') {
        const newCount = await connectWithUser(id);
        return NextResponse.json({ connections: newCount });
    } else {
        const updatedUser = await updateUser(id, body);
        return NextResponse.json(updatedUser);
    }
}
