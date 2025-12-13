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
                        <Link href="/" className="flex items-center gap-3 group">
                            <img src="/favicon.ico" alt="IEEE Sampark Logo" className="h-10 w-auto group-hover:scale-105 transition-transform" />
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
                        <Link href="/sampark-history" className="text-ieee-navy hover:text-ieee-blue font-medium transition-colors">Sampark</Link>
                        <Link href="/gallery" className="text-ieee-navy hover:text-ieee-blue font-medium transition-colors">Gallery</Link>
                        <Link href="/contact" className="text-ieee-navy hover:text-ieee-blue font-medium transition-colors">Contact</Link>

                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-100">
                            {isLoggedIn ? (
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-gray-200 group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-ieee-blue text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                        JD
                                    </div>
                                    <span className="text-sm font-semibold text-ieee-navy group-hover:text-ieee-blue">John Doe</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-slate-700 hover:text-ieee-blue font-semibold text-sm px-4 py-2 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-ieee-blue hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                                    >
                                        Register Now
                                    </Link>
                                </>
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
                            <Link href="/sampark-history" className="block px-3 py-2 text-base font-medium text-ieee-navy hover:bg-gray-50 rounded-md">Sampark</Link>
                            <Link href="/gallery" className="block px-3 py-2 text-base font-medium text-ieee-navy hover:bg-gray-50 rounded-md">Gallery</Link>
                            <Link href="/contact" className="block px-3 py-2 text-base font-medium text-ieee-navy hover:bg-gray-50 rounded-md">Contact</Link>
                            <div className="pt-4 px-3 border-t border-gray-50 mt-2">
                                {isLoggedIn ? (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-3 w-full bg-slate-50 text-ieee-navy px-4 py-3 rounded-lg font-semibold shadow-sm border border-gray-100"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-ieee-blue text-white flex items-center justify-center font-bold text-xs">
                                            JD
                                        </div>
                                        <span>My Dashboard</span>
                                    </Link>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        <Link
                                            href="/login"
                                            className="block w-full text-center bg-white border border-gray-200 text-ieee-navy hover:bg-gray-50 px-4 py-3 rounded-lg font-semibold transition-colors"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="block w-full text-center bg-ieee-blue text-white px-4 py-3 rounded-lg font-semibold shadow-md active:scale-95 transition-transform"
                                        >
                                            Register Now
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
