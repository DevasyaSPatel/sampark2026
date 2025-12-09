import { NextRequest, NextResponse } from 'next/server';
import { getUserBySlug } from '@/lib/google-sheets';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    if (!slug) {
        return NextResponse.json({ error: 'Slug required' }, { status: 400 });
    }

    try {
        const user = await getUserBySlug(slug);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return only public data? getUserBySlug already filtered roughly, but let's be safe.
        // We do NOT return the email if we want to be super private, but connection usually requires email.
        // For now, returning what getUserBySlug returns.
        return NextResponse.json(user);
    } catch (error) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
