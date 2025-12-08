import { NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/google-sheets';

export async function GET(request: Request) {
    // Simple Admin Auth Check
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const users = await getAllUsers();
        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}
