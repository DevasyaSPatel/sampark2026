'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ContactPage from '@/components/ContactPage';

export default function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('user_id')) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="pt-20">
                <ContactPage />
            </div>
        </div>
    );
}
