import { NextResponse } from 'next/server';
import { updateUserStatus } from '@/lib/google-sheets';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
    const body = await request.json();
    const { password, rowIndex, email, name } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Update Sheet Status
        await updateUserStatus(rowIndex, 'Approved');

        // 2. Get Password securely
        const { getPassword } = await import('@/lib/google-sheets');
        const retrievedPassword = await getPassword(rowIndex);

        if (!retrievedPassword) throw new Error("Could not retrieve password for email");

        // 3. Send Email
        await sendWelcomeEmail(email, name, email, retrievedPassword);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Approval error:", error);
        return NextResponse.json({ error: 'Failed to approve' }, { status: 500 });
    }
}
