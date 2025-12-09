import { NextRequest, NextResponse } from 'next/server';
import { searchUsers } from '@/lib/google-sheets';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
        // Explore Mode: Return random or first N users
        // For simplicity now, return first 20 from searchUsers (which supports empty query?)
        // searchUsers currently filters. Let's modify searchUsers or just pass empty string if we modifying it.
        // Actually, let's update searchUsers to return all if query is empty.

        try {
            const results = await searchUsers("");
            // We need to shuffle them for "Explore" feel?
            // Doing shuffle in memory for now.
            const shuffled = results.sort(() => 0.5 - Math.random()).slice(0, 20);
            return NextResponse.json({ results: shuffled });
        } catch (e) {
            return NextResponse.json({ results: [] });
        }
    }

    try {
        const results = await searchUsers(query);
        return NextResponse.json({ results });
    } catch (error) {
        return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }
}
