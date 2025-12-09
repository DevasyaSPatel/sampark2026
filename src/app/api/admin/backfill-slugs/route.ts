import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { generateSlug } from '@/lib/google-sheets';

export async function POST(request: NextRequest) {
    try {
        const SHEET_ID = process.env.GOOGLE_SHEET_ID;
        if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // 1. Fetch all users
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Form Responses 1!A:Q',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return NextResponse.json({ message: "No users found" });

        // 2. Iterate and update those missing slugs (Column Q, index 16)
        // Note: rows[0] is header ?? Actually usually rows includes header.
        // Let's assume Row 1 is header.

        let updatedCount = 0;

        // Skip header
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const hasSlug = row[16] && row[16].trim().length > 0;

            if (!hasSlug) {
                const newSlug = generateSlug();
                const rowIndex = i + 1; // Google Sheets is 1-indexed

                // Update Column Q for this row
                await sheets.spreadsheets.values.update({
                    spreadsheetId: SHEET_ID,
                    range: `Form Responses 1!Q${rowIndex}`,
                    valueInputOption: 'USER_ENTERED',
                    requestBody: {
                        values: [[newSlug]]
                    }
                });
                updatedCount++;
            }
        }

        return NextResponse.json({ success: true, updated: updatedCount });

    } catch (error) {
        console.error("Backfill error:", error);
        return NextResponse.json({ error: "Failed to backfill slugs" }, { status: 500 });
    }
}
