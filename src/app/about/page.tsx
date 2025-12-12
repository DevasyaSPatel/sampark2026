'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AboutPage from '@/components/AboutPage';

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
            {/* Add padding-top to account for fixed Navbar */}
            <div className="pt-16">
                <AboutPage />
            </div>
        </div>
    );
}
