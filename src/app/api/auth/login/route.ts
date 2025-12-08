import { NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/google-sheets';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { message: 'Username and password are required' },
                { status: 400 }
            );
        }

        const user = await authenticateUser(username, password);

        if (user) {
            // In a real production app, checking credentials via Sheet is slow but secure enough for this.
            // We should return a session token or similar, but for simplicity we rely on client state
            // or set a cookie here. Given the scope, a simple success response is likely fine,
            // and the client can store the user details in Context/LocalStorage.
            return NextResponse.json({ success: true, user });
        } else {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
