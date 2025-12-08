import { google } from 'googleapis';

// Environment variables for Google Sheets
const CLIENT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Handle newlines in env vars
const SHEET_ID = process.env.GOOGLE_SHEET_ID;

// Scopes required for the API
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
];

// Initialize Google Auth
const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
    },
    scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

export async function authenticateUser(username: string, pass: string) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    try {
        // Fetching range A:L from 'Form Responses 1'
        // A: Timestamp (0)
        // B: Name (1)
        // C: Email (2) - used as Login ID
        // ...
        // L: Password (11)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Form Responses 1!A:L',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return null;

        // Skip header row if it exists (usually row 0)
        // We can check if row[0] === 'Timestamp' to skip, or just find match.
        // The find matches exact string so header won't match likely.
        const user = rows.find((row: string[]) => {
            // Check if row has enough columns
            if (!row[2] || !row[11]) return false;
            // Case insensitive email check might be good, but strict for now
            return row[2].trim() === username.trim() && row[11].trim() === pass.trim();
        });

        if (user) {
            return {
                name: user[1],
                email: user[2],
                phone: user[3],
                // Return other useful info if needed
            };
        }
        return null;
    } catch (error) {
        console.error("Error accessing Google Sheets:", error);
        return null;
    }
}

export async function generateCredentials(rowId: number) {
    // Simple generator: SMPK + Row Number
    const username = `SMPK${1000 + rowId}`;

    // Random 6-char password
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, 1, O, 0 for clarity
    let password = '';
    for (let i = 0; i < 6; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return { username, password };
}

export async function appendUserAndGetCredentials(userData: any) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    // 1. Get current row count to generate unique ID
    const metaData = await sheets.spreadsheets.get({
        spreadsheetId: SHEET_ID
    });
    const sheet = metaData.data.sheets?.[0];

    // Actually, getting 'values' is better to count filled rows
    const rangeData = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Form Responses 1!A:A',
    });
    const nextRow = (rangeData.data.values?.length || 0) + 1; // 1-indexed

    // 2. Generate Credentials
    const { username, password } = await generateCredentials(nextRow);

    // 3. Append to Sheet
    // Order: Timestamp(A), Name(B), Email(C), Phone(D), Uni(E), Dept(F), Year(G), Theme(H), Type(I), Team(J), Misc(K), Password(L)
    await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Form Responses 1!A:L',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[
                new Date().toLocaleString(), // A: Timestamp
                userData.name,               // B
                userData.email,              // C
                userData.phone || '',        // D
                userData.university || '',   // E
                userData.department || '',   // F
                userData.year || '',         // G
                userData.theme || '',        // H
                userData.participationType || '', // I
                userData.teamName || '',     // J
                userData.anythingElse || '', // K
                password                     // L
            ]],
        },
    });

    return { username, password };
}

export async function addConnection(sourceEmail: string, targetEmail: string) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    try {
        // Append to 'Connections' sheet
        // Columns: Source (A), Target (B), Timestamp (C)
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Connections!A:C',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    sourceEmail,
                    targetEmail,
                    new Date().toISOString()
                ]],
            },
        });
        return true;
    } catch (error) {
        console.error("Error adding connection:", error);
        // If sheet missing, maybe try creating it? For now just log.
        return false;
    }
}

export async function getConnectionsCount(email: string) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Connections!A:B',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return 0;

        // bi-directional count
        const count = rows.filter((row: string[]) =>
            (row[0]?.trim() === email.trim()) || (row[1]?.trim() === email.trim())
        ).length;

        return count;
    } catch (error) {
        return 0;
    }
}

export async function getUser(email: string) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Form Responses 1!A:L',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return null;

        const userRow = rows.find((row: string[]) => row[2]?.trim() === email.trim());

        if (userRow) {
            const connections = await getConnectionsCount(email);
            return {
                id: userRow[2], // Email as ID
                name: userRow[1],
                email: userRow[2],
                role: 'user',
                theme: userRow[7] || '',
                bio: userRow[10] || '',
                connections: connections,
            };
        }
        return null;
    } catch (error) {
        console.error("Error accessing Google Sheets:", error);
        return null;
    }
}

