import { google } from 'googleapis';
import { randomUUID } from 'crypto';

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

export function generateSlug() {
    // Generate a secure random slug (12 chars hex)
    // Using randomUUID is good, but might be too long. 
    // Let's use a substring of it or a custom hex string for cleaner URLs.
    return randomUUID().replace(/-/g, '').substring(0, 12);
}

export async function appendUserAndGetCredentials(userData: any) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    const rangeData = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Form Responses 1!A:A',
    });
    const nextRow = (rangeData.data.values?.length || 0) + 1;

    const { username, password } = await generateCredentials(nextRow);
    const slug = generateSlug();

    await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Form Responses 1!A:Q',
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
                'Pending',                   // M: Status
                '',                          // N: LinkedIn
                '',                          // O: Instagram
                '',                          // P: GitHub
                slug                         // Q: Slug (New)
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
            github: row[15] || '',
            slug: row[16] || '' // Column Q
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
            range: 'Connections', // Just the sheet name is safer for append
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    data.sourceEmail || '',
                    data.targetEmail,
                    new Date().toISOString(),
                    data.sourceName || '',
                    data.sourcePhone || '',
                    data.note || '',
                    'Pending' // G: Status
                ]],
            },
        });
        return true;
    } catch (error) {
        console.error("Error adding connection:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
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

        // Count where I am the TARGET and Status is 'Accepted'
        const count = rows.filter((row: string[]) =>
            (row[1]?.trim() === email.trim()) && (row[6]?.trim() === 'Accepted')
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
            range: 'Connections!A:G', // Updated to G to ensure status is included if not covered
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return [];

        // Fetch all users to map emails to names (Inefficient but necessary without a relational DB)
        const usersResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Form Responses 1!B:C', // B=Name, C=Email
        });
        const userRows = usersResponse.data.values || [];
        const emailToNameMap = new Map();
        userRows.forEach(row => {
            if (row[1]) emailToNameMap.set(row[1].trim().toLowerCase(), row[0]);
        });

        // Find rows where user is the TARGET (for incoming requests) OR SOURCE (for sent requests)
        const normalizedEmail = email.trim().toLowerCase();

        const myConnections = rows
            .filter((row: string[]) =>
                row[1]?.trim().toLowerCase() === normalizedEmail || row[0]?.trim().toLowerCase() === normalizedEmail
            )
            .map((row: string[]) => {
                const rowSourceEmail = row[0]?.trim().toLowerCase();
                const rowTargetEmail = row[1]?.trim().toLowerCase();
                const isTarget = rowTargetEmail === normalizedEmail;

                // Determine the "Other" person
                const otherEmail = isTarget ? rowSourceEmail : rowTargetEmail;
                const otherNameRaw = isTarget ? row[3] : null; // Use stored name if incoming, else lookup

                // Lookup name if not present or if it's the target
                const resolvedName = emailToNameMap.get(otherEmail) || otherNameRaw || 'Anonymous';

                return {
                    sourceEmail: row[0],
                    targetEmail: row[1],
                    timestamp: row[2],
                    sourceName: row[3] || 'Anonymous', // Original stored value
                    sourcePhone: row[4] || '',
                    note: row[5] || '',
                    status: row[6] || 'Pending',
                    direction: isTarget ? 'incoming' : 'outgoing',
                    name: resolvedName // The name of the *other* person to display
                };
            });

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
            range: 'Form Responses 1!A:Q',
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
                phone: userRow[3] || '',
                role: 'user',
                theme: userRow[7] || '',
                bio: userRow[10] || '',
                linkedin: userRow[13] || '',
                instagram: userRow[14] || '',
                github: userRow[15] || '',
                slug: userRow[16] || '',
                connections: connections,
            };
        }
        return null;
    } catch (error) {
        console.error("Error accessing Google Sheets:", error);
        return null;
    }
}

export async function getConnectionStatus(sourceEmail: string, targetEmail: string) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Connections!A:G',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return 'None';

        // Check if there is ANY interaction between these two
        const connection = rows.find((row: string[]) => {
            const s = row[0]?.trim().toLowerCase();
            const t = row[1]?.trim().toLowerCase();
            const se = sourceEmail.trim().toLowerCase();
            const te = targetEmail.trim().toLowerCase();

            // Check both directions
            return (s === se && t === te) || (s === te && t === se);
        });

        if (connection) {
            // Status is in column G (index 6)
            return connection[6] || 'Pending';
        }
        return 'None';
    } catch (error) {
        console.error("Error checking connection status:", error);
        return 'None';
    }
}

export async function getUserBySlug(slug: string) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Form Responses 1!A:Q',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return null;

        // Find row where Column Q (index 16) matches slug
        const userRow = rows.find((row: string[]) => row[16]?.trim() === slug.trim());

        if (userRow) {
            // For public profile, fetch connection count
            // We need to use the email (userRow[2]) to search connections
            const connectionsCount = await getConnectionsCount(userRow[2]);

            return {
                id: userRow[2], // Email still internal ID
                name: userRow[1],
                // email: userRow[2], // Maybe hide email for public profile?
                role: 'user',
                theme: userRow[7] || '',
                bio: userRow[10] || '',
                linkedin: userRow[13] || '',
                instagram: userRow[14] || '',
                github: userRow[15] || '',
                slug: userRow[16] || '',
                connections: connectionsCount,
            };
        }
        return null;
    } catch (error) {
        console.error("Error getting user by slug:", error);
        return null;
    }
}

export async function searchUsers(query: string) {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Form Responses 1!A:Q',
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) return [];

        const lowerQuery = query.toLowerCase();

        return rows.slice(1)
            .filter((row: string[]) => {
                const name = row[1]?.toLowerCase() || '';
                const email = row[2]?.toLowerCase() || '';
                // const handle = row[16]?.toLowerCase() || ''; // Slug is random, so searching by it is rare but okay.
                return name.includes(lowerQuery) || email.includes(lowerQuery);
            })
            .map((row: string[]) => ({
                name: row[1],
                theme: row[7] || '',
                slug: row[16] || '', // Return slug so we can link to them
                // Do not return email/phone in search results for privacy
            }))
            .slice(0, 10); // Limit results
    } catch (error) {
        console.error("Error searching users:", error);
        return [];
    }
}

export async function updateConnectionStatus(sourceEmail: string, targetEmail: string, newStatus: 'Accepted' | 'Rejected') {
    if (!SHEET_ID) throw new Error("Missing GOOGLE_SHEET_ID");

    // We need to find the row index in Connections sheet
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Connections!A:G',
    });

    const rows = response.data.values;
    if (!rows) return false;

    // Find row: Source=SourceEmail AND Target=TargetEmail
    // Note: If I am "Accepting", I am the Target in the DB row?
    // When A requests B: Source=A, Target=B, Status=Pending.
    // B accepts: We need to find Source=A, Target=B and set Status=Accepted.

    const rowIndex = rows.findIndex((row: string[]) =>
        row[0]?.trim() === sourceEmail.trim() && row[1]?.trim() === targetEmail.trim()
    );

    if (rowIndex !== -1) {
        // 1-indexed, +1 for header if we searched full sheet? 
        // We searched 'Connections!A:G'. rows[0] is typically header if we included it?
        // Wait, `values.get` usually returns headers if they exist.
        // Assuming headers are row 1. rows array index 0 is headers.
        // So actual sheet row is rowIndex + 1.

        const sheetRow = rowIndex + 1;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range: `Connections!G${sheetRow}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[newStatus]]
            }
        });
        return true;
    }
    return false;
}
