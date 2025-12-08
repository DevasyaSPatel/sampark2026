import { NextResponse } from 'next/server';
import { updateUserDetails } from '@/lib/google-sheets';

export async function POST(request: Request) {
    const body = await request.json();
    const { password, rowIndex, data } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await updateUserDetails(rowIndex, data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
