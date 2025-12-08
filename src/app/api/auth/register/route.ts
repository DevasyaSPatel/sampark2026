import { NextResponse } from 'next/server';
import { appendUserAndGetCredentials } from '@/lib/google-sheets';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        /* 
           Expected body: { name, email, phone, university, department, year, theme, participationType, teamName, anythingElse }
        */

        // 1. Append to Sheet and Generate Credentials
        // This function in google-sheets.ts needs to be verified to match the 12 columns.
        // Currently it writes to A:A with 5 values? We need to fix that too if it's outdated.
        // Let's assume we update logic here or in google-sheets.ts.
        // For now, let's trust google-sheets.ts 'appendUserAndGetCredentials' but we might need to update it 
        // because we changed the sheet structure to 12 columns for Read.

        // Actually, we should check `appendUserAndGetCredentials` content again.
        // In step 9, it was writing 5 values.
        // The user wants "A is timeline... password is the last one".
        // Use the updated append logic.

        const credentials = await appendUserAndGetCredentials(body);

        if (!credentials) {
            return NextResponse.json({ message: 'Failed to register' }, { status: 500 });
        }

        // 2. Send Email
        const emailResult = await sendWelcomeEmail(body.email, body.name, credentials.username, credentials.password);

        if (!emailResult?.success) {
            console.warn("Registration successful but email failed:", emailResult?.error);
            return NextResponse.json({
                success: true,
                credentials,
                message: "Registered, but email failed to send. Check server logs."
            });
        }

        return NextResponse.json({ success: true, credentials });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { message: `Registration failed: ${error.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
