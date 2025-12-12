'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span className="text-ieee-blue font-bold text-xl leading-none tracking-tight">IEEE</span>
                                <span className="text-ieee-navy text-xs font-semibold tracking-wider">SAMPARK 2026</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-ieee-navy hover:text-ieee-blue font-medium transition-colors">Home</Link>
                        <Link href="/about" className="text-ieee-navy hover:text-ieee-blue font-medium transition-colors">About</Link>
                        <Link href="/gallery" className="text-ieee-navy hover:text-ieee-blue font-medium transition-colors">Gallery</Link>
                        <Link href="/contact" className="text-ieee-navy hover:text-ieee-blue font-medium transition-colors">Contact</Link>

                        <div className="flex items-center gap-3 ml-4">
                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    className="bg-ieee-blue hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/register"
                                    className="bg-ieee-blue hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    Register Now
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-ieee-navy hover:text-ieee-blue focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <Link href="/" className="block px-3 py-2 text-base font-medium text-ieee-navy hover:bg-gray-50 rounded-md">Home</Link>
                            <Link href="/about" className="block px-3 py-2 text-base font-medium text-ieee-navy hover:bg-gray-50 rounded-md">About</Link>
                            <Link href="/gallery" className="block px-3 py-2 text-base font-medium text-ieee-navy hover:bg-gray-50 rounded-md">Gallery</Link>
                            <Link href="/contact" className="block px-3 py-2 text-base font-medium text-ieee-navy hover:bg-gray-50 rounded-md">Contact</Link>
                            <div className="pt-4 px-3">
                                {isLoggedIn ? (
                                    <Link
                                        href="/dashboard"
                                        className="block w-full text-center bg-ieee-blue text-white px-4 py-3 rounded-lg font-semibold shadow-md active:scale-95 transition-transform"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href="/register"
                                        className="block w-full text-center bg-ieee-blue text-white px-4 py-3 rounded-lg font-semibold shadow-md active:scale-95 transition-transform"
                                    >
                                        Register Now
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
