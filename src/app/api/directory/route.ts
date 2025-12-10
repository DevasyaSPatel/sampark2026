import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Re-using the auth setup from google-sheets logic (simplifying for this route or importing if possible, 
// strictly creating a self-contained route logic or importing 'sheets' if exported. width 'sheets' not exported directly, I will re-init).
// Better to add a helper in google-sheets.ts, but user asked for "Complete Code".
// I will import what I can.
// Actually, I can't import `sheets` from `google-sheets.ts` because it's not exported.
// I'll add `getAllUsersWithCounts` to `google-sheets.ts` first? No, I'll do it here to keep it isolated.

const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

export async function GET() {
    try {
        if (!SHEET_ID) return NextResponse.json({ error: 'Config Error' }, { status: 500 });

        // 1. Fetch All Users
        const usersRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Form Responses 1!A:Q',
        });
        const userRows = usersRes.data.values || [];

        // 2. Fetch All Connections (for counting)
        const connRes = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Connections!A:G',
        });
        const connRows = connRes.data.values || [];

        // 3. Calculate Counts in Memory
        // Map<Email, Set<PartnerEmail>>
        const connectionsMap = new Map<string, Set<string>>();

        connRows.forEach(row => {
            const source = row[0]?.trim().toLowerCase();
            const target = row[1]?.trim().toLowerCase();
            const status = row[6]?.trim().toLowerCase();

            if (status === 'accepted') {
                if (!connectionsMap.has(source)) connectionsMap.set(source, new Set());
                if (!connectionsMap.has(target)) connectionsMap.set(target, new Set());

                connectionsMap.get(source)?.add(target);
                connectionsMap.get(target)?.add(source);
            }
        });

        // 4. Map Users
        const users = userRows.slice(1).map(row => {
            const email = row[2]?.trim().toLowerCase(); // IDs are email in this system
            const count = connectionsMap.get(email)?.size || 0;

            return {
                id: row[2] || '',
                name: row[1] || 'Unknown',
                email: row[2] || '',
                theme: row[7] || '',
                connections: count,
                bio: row[10] || '',
                participationType: row[8] || '',
                slug: row[16] || ''
            };
        });

        return NextResponse.json(users);

    } catch (error) {
        console.error('Directory API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch directory' }, { status: 500 });
    }
}
