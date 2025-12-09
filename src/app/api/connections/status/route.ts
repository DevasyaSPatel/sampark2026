
import { NextRequest, NextResponse } from 'next/server';
import { getConnectionStatus } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const sourceEmail = searchParams.get('sourceEmail');
    const targetEmail = searchParams.get('targetEmail');

    if (!sourceEmail || !targetEmail) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    try {
        const status = await getConnectionStatus(sourceEmail, targetEmail);
        return NextResponse.json({ status });
    } catch (error) {
        console.error('Error checking status:', error);
        return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
    }
}
