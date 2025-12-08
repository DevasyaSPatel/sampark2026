import { NextResponse } from 'next/server';
import { appendUserAndGetCredentials } from '@/lib/google-sheets';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Append to Sheet and Generate Credentials
        const credentials = await appendUserAndGetCredentials(body);

        if (!credentials) {
            return NextResponse.json({ message: 'Failed to register' }, { status: 500 });
        }

        // 2. No Email Sent yet (Pending Approval Flow)
        // Email will be sent by Admin via /api/admin/approve

        return NextResponse.json({
            success: true,
            message: "Registration submitted! Please wait for admin approval to receive your credentials."
        });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: `Registration failed: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
