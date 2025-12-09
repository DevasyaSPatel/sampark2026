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

        // Validation
        if (!sourceEmail && !sourceName) {
            return NextResponse.json({ error: 'Name or Email required' }, { status: 400 });
        }

        // 1. Fetch Source User Details if we have an email (Logged in user)
        let finalSourceName = sourceName;
        let finalSourcePhone = sourcePhone;

        if (sourceEmail) {
            const sourceUser = await getUser(sourceEmail);
            if (sourceUser) {
                finalSourceName = sourceUser.name;
                // Use phone if available in profile, else keep request phone
                // (Profile usually doesn't show phone in this User type, but let's assume valid)
            }
        }

        // 2. Add Connection: Source -> Target (So Source remembers Target)
        const forwardSuccess = await addConnection({
            sourceEmail,
            targetEmail,
            sourceName: finalSourceName,
            sourcePhone: finalSourcePhone,
            note
        });

        // 3. Mutual Connection: Target -> Source (So Target remembers Source immediately)
        // Only if we have a valid sourceEmail (registered user)
        let mutualSuccess = true;
        if (sourceEmail) {
            // Retrieve Target User details to store in Source's list?
            // Wait, addConnection stores 'source' details for the 'target'.
            // To make Target see Source, we did the above.
            // To make Source see Target, we need to swap roles.
            // 'Target' becomes the 'Source' in the record, and 'Source' becomes the 'Target'.
            // But we need Target's Name.

            const targetUser = await getUser(targetEmail);
            if (targetUser) {
                mutualSuccess = await addConnection({
                    sourceEmail: targetEmail,      // Target "views" Source
                    targetEmail: sourceEmail,      // Source is the one receiving this entry? 
                    // WAIT. `getUserConnections` filters by `targetEmail`.
                    // If I want User A (Source) to appear in User B's (Target) list:
                    // Row: Source=A, Target=B.  => getUserConnections(B) finds this. OK.

                    // If I want User B (Target) to appear in User A's (Source) list:
                    // Row: Source=B, Target=A.

                    sourceName: targetUser.name,
                    note: "Mutual Connection via NFC"
                });
            }
        }

        if (forwardSuccess) return NextResponse.json({ success: true, mutual: mutualSuccess });
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
