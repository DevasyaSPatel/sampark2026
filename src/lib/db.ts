// In-memory mock database
// In a real app, this would be Firebase/Postgres

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin' | 'dignitary';
    theme: string;
    bio: string;
    connections: number;
    password: string; // Plaintext for demo
};

const users: User[] = [
    {
        id: "EMP123",
        name: "John Doe",
        email: "john@example.com",
        role: "user",
        theme: "AI Agents",
        bio: "Passionate about building autonomous systems.",
        connections: 42,
        password: "password123"
    },
    {
        id: "ADM001",
        name: "Admin User",
        email: "admin@sampark.com",
        role: "admin",
        theme: "Management",
        bio: "Event Organizer",
        connections: 100,
        password: "admin"
    }
];

export const getUser = async (id: string) => {
    return users.find(u => u.id === id);
};

export const loginUser = async (id: string, password: string) => {
    const user = users.find(u => u.id === id && u.password === password);
    if (user) {
        const { password, ...safeUser } = user;
        return safeUser;
    }
    return null;
};

export const updateUser = async (id: string, data: Partial<User>) => {
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
        users[idx] = { ...users[idx], ...data };
        const { password, ...safeUser } = users[idx];
        return safeUser;
    }
    return null;
};

export const connectWithUser = async (id: string) => {
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
        users[idx].connections += 1;
        return users[idx].connections;
    }
    return null;
}
