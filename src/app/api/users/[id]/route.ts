import { NextRequest, NextResponse } from 'next/server';
import { getUser, addConnection, updateUserDetails } from '@/lib/google-sheets';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    // Decode ID if it's an email (URLs might encode it)
    const decodedId = decodeURIComponent(id);
    const user = await getUser(decodedId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const targetEmail = decodeURIComponent(id);

    // Handle "connect" action
    if (body.action === 'connect') {
        const { sourceEmail, sourceName, sourcePhone, note } = body;

        // If not logged in (no sourceEmail) AND no guest details provided -> Error
        // actually, we allow anonymous guest connections if they provide name at least?
        // But for now, let's just pass whatever we get to addConnection.

        if (!sourceEmail && !sourceName) {
            return NextResponse.json({ error: 'Name or Email required' }, { status: 400 });
        }

        const success = await addConnection({
            sourceEmail,
            targetEmail,
            sourceName,
            sourcePhone,
            note
        });

        if (success) return NextResponse.json({ success: true });
        return NextResponse.json({ error: "Failed to connect" }, { status: 500 });
    } else {
        // Handle Profile Update
        // We need to map the row index. But `updateUserDetails` needs rowIndex.
        // `getUser` returns ID but not rowIndex directly in standard return...
        // Wait, `getUser` in `google-sheets.ts` returns object. I need to enable getting rowIndex or find it again.
        // Let's refactor `getUser` to return rowIndex? Or just fetch allUsers here to find index.
        // Optimization: `getUser` already fetches all rows.

        // Actually, `getUser` in my previous edit didn't return `rowIndex`.
        // I should fix that or re-fetch locally.
        // Re-fetching locally is safer for now.

        const { getAllUsers } = await import('@/lib/google-sheets');
        const users = await getAllUsers();
        const user = users.find(u => u.email === targetEmail);

        if (user) {
            await updateUserDetails(user.rowIndex, body);
            // Return updated user
            const updatedUser = await getUser(targetEmail);
            return NextResponse.json(updatedUser);
        } else {
            return NextResponse.json({ error: "User not found for update" }, { status: 404 });
        }
    }
}
