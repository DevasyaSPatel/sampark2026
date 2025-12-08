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
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Form Responses 1!A:L',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return null;

        const user = rows.find((row: string[]) => {
            if (!row[2] || !row[11]) return false;
            return row[2].trim() === username.trim() && row[11].trim() === pass.trim();
        });

        if (user) {
            return {
                name: user[1],
                email: user[2],
                phone: user[3],
            };
        }
        return null;
    } catch (error) {
        console.error("Error accessing Google Sheets:", error);
        return null;
    }
}

export async function generateCredentials(rowId: number) {
    const username = `SMPK${1000 + rowId}`;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return { username, password };
}

export async function appendUserAndGetCredentials(userData: any) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    const rangeData = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Form Responses 1!A:A',
    });
    const nextRow = (rangeData.data.values?.length || 0) + 1;

    const { username, password } = await generateCredentials(nextRow);

    await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Form Responses 1!A:L',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[
                new Date().toLocaleString(), // A
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
                password,                    // L
                'Pending'                    // M: Status
            ]],
        },
    });

    return { username, password };
}

export async function getAllUsers() {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Form Responses 1!A:P', // Fetch up to P (GitHub)
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return [];

        return rows.slice(1).map((row, index) => ({
            rowIndex: index + 2,
            timestamp: row[0],
            name: row[1],
            email: row[2],
            phone: row[3],
            university: row[4],
            department: row[5],
            year: row[6],
            theme: row[7],
            participationType: row[8],
            teamName: row[9],
            anythingElse: row[10],
            status: row[12] || 'Pending',
            linkedin: row[13] || '',
            instagram: row[14] || '',
            github: row[15] || ''
        }));
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
}

export async function updateUserStatus(rowIndex: number, newStatus: string) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `Form Responses 1!M${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[newStatus]]
        }
    });
}

export async function updateUserDetails(rowIndex: number, data: any) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    const mainValues = [
        data.name,
        data.email,
        data.phone,
        data.university,
        data.department,
        data.year,
        data.theme,
        data.participationType,
        data.teamName,
        data.anythingElse
    ];

    await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `Form Responses 1!B${rowIndex}:K${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [mainValues]
        }
    });

    // Update Socials: N, O, P
    const socialValues = [
        data.linkedin || '',
        data.instagram || '',
        data.github || ''
    ];

    await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `Form Responses 1!N${rowIndex}:P${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [socialValues]
        }
    });
}

export async function addConnection(data: {
    sourceEmail?: string,
    targetEmail: string,
    sourceName?: string,
    sourcePhone?: string,
    note?: string
}) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    try {
        // Append to 'Connections' sheet
        // Columns: SourceEmail (A), TargetEmail (B), Timestamp (C), SourceName (D), SourcePhone (E), Note (F)
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Connections!A:F',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    data.sourceEmail || '',
                    data.targetEmail,
                    new Date().toISOString(),
                    data.sourceName || '',
                    data.sourcePhone || '',
                    data.note || ''
                ]],
            },
        });
        return true;
    } catch (error) {
        console.error("Error adding connection:", error);
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

        // Count where I am the TARGET
        const count = rows.filter((row: string[]) =>
            (row[1]?.trim() === email.trim())
        ).length;

        return count;
    } catch (error) {
        return 0;
    }
}

export async function getUserConnections(email: string) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Connections!A:F',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return [];

        // Find rows where user is the TARGET
        const myConnections = rows
            .filter((row: string[]) => row[1]?.trim() === email.trim())
            .map((row: string[]) => ({
                sourceEmail: row[0],
                timestamp: row[2],
                sourceName: row[3] || 'Anonymous',
                sourcePhone: row[4] || '',
                note: row[5] || ''
            }));

        return myConnections.reverse(); // Newest first
    } catch (error) {
        console.error("Error getting connections:", error);
        return [];
    }
}

export async function getPassword(rowIndex: number) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `Form Responses 1!L${rowIndex}`,
        });

        return response.data.values?.[0]?.[0] || null;
    } catch (error) {
        return null;
    }
}

export async function getUser(email: string) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Form Responses 1!A:P',
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
                linkedin: userRow[13] || '',
                instagram: userRow[14] || '',
                github: userRow[15] || '',
                connections: connections,
            };
        }
        return null;
    } catch (error) {
        console.error("Error accessing Google Sheets:", error);
        return null;
    }
}
