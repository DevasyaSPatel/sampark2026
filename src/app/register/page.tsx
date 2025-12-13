'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, Building, BookOpen, GraduationCap, Layers, Users, Zap, CheckCircle, AlertCircle } from 'lucide-react';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        university: '',
        department: '',
        year: '1st Year',
        theme: 'AI Agents',
        participationType: 'Individual',
        teamName: '',
        anythingElse: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setMessage('Registration successful! Redirecting to login...');
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setMessage(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setMessage('Something went wrong. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00629B 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>

            <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 relative z-10">
                {/* Header / Nav */}
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-ieee-navy hover:text-ieee-blue transition-colors group">
                        <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all border border-gray-100">
                            <ArrowLeft size={20} />
                        </div>
                        <span className="font-semibold text-sm tracking-wide">Back to Home</span>
                    </Link>
                    <div className="text-right hidden sm:block">
                        <h2 className="text-lg font-bold text-ieee-navy tracking-tight">SAMPARK 2026</h2>
                        <p className="text-xs text-ieee-blue font-semibold tracking-widest uppercase">IEEE SB PDEU</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">

                    {/* Sidebar / Info Panel (Desktop) */}
                    <div className="hidden md:flex md:w-1/3 bg-ieee-navy text-white p-10 flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-ieee-blue rounded-full opacity-20 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-ieee-sky rounded-full opacity-20 blur-3xl"></div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-2">Join the Innovation</h3>
                            <p className="text-blue-200 text-sm leading-relaxed mb-6">Be part of the premier networking event connecting students and professionals.</p>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-2 rounded-lg"><Users size={18} className="text-ieee-sky" /></div>
                                    <div>
                                        <h4 className="font-semibold text-sm">Network</h4>
                                        <p className="text-xs text-gray-300">Connect with 1200+ peers</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-2 rounded-lg"><Zap size={18} className="text-ieee-sky" /></div>
                                    <div>
                                        <h4 className="font-semibold text-sm">Innovate</h4>
                                        <p className="text-xs text-gray-300">Showcase your ideas</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-white/10 p-2 rounded-lg"><GraduationCap size={18} className="text-ieee-sky" /></div>
                                    <div>
                                        <h4 className="font-semibold text-sm">Learn</h4>
                                        <p className="text-xs text-gray-300">Workshops & Experts</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 text-xs text-gray-400 mt-12">
                            <p>© 2026 IEEE Student Branch PDEU</p>
                        </div>
                    </div>

                    {/* Main Form Area */}
                    <div className="flex-1 p-8 md:p-12">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-ieee-navy mb-2">Register for Sampark</h1>
                            <p className="text-gray-500">Fill in your details to secure your spot.</p>
                        </div>

                        {message && (
                            <div className={`flex items-center gap-3 p-4 rounded-lg mb-6 text-sm font-medium ${message.includes('successful') ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                {message.includes('successful') ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Section 1: Personal Details */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-ieee-navy flex items-center gap-2">
                                            <User size={14} className="text-ieee-blue" /> Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-ieee-blue focus:ring-1 focus:ring-ieee-blue transition-all bg-gray-50 focus:bg-white text-gray-700 placeholder:text-gray-400"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-ieee-navy flex items-center gap-2">
                                            <Mail size={14} className="text-ieee-blue" /> Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-ieee-blue focus:ring-1 focus:ring-ieee-blue transition-all bg-gray-50 focus:bg-white text-gray-700 placeholder:text-gray-400"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-sm font-semibold text-ieee-navy flex items-center gap-2">
                                            <Phone size={14} className="text-ieee-blue" /> Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-ieee-blue focus:ring-1 focus:ring-ieee-blue transition-all bg-gray-50 focus:bg-white text-gray-700 placeholder:text-gray-400"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Academic Details */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Academic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-sm font-semibold text-ieee-navy flex items-center gap-2">
                                            <Building size={14} className="text-ieee-blue" /> University / Institution <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            name="university"
                                            type="text"
                                            value={formData.university}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-ieee-blue focus:ring-1 focus:ring-ieee-blue transition-all bg-gray-50 focus:bg-white text-gray-700"
                                            placeholder="e.g. PDEU"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-ieee-navy flex items-center gap-2">
                                            <BookOpen size={14} className="text-ieee-blue" /> Department <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            required
                                            name="department"
                                            type="text"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-ieee-blue focus:ring-1 focus:ring-ieee-blue transition-all bg-gray-50 focus:bg-white text-gray-700"
                                            placeholder="e.g. Computer Science"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-ieee-navy flex items-center gap-2">
                                            <GraduationCap size={14} className="text-ieee-blue" /> Year of Study
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="year"
                                                value={formData.year}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-ieee-blue focus:ring-1 focus:ring-ieee-blue transition-all bg-gray-50 focus:bg-white text-gray-700 appearance-none"
                                            >
                                                <option>1st Year</option>
                                                <option>2nd Year</option>
                                                <option>3rd Year</option>
                                                <option>4th Year</option>
                                                <option>Other</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg width="10" height="6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l4 4 4-4" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Event Preferences */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Event Preferences</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-ieee-navy flex items-center gap-2">
                                            <Layers size={14} className="text-ieee-blue" /> Preferred Theme
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="theme"
                                                value={formData.theme}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-ieee-blue focus:ring-1 focus:ring-ieee-blue transition-all bg-gray-50 focus:bg-white text-gray-700 appearance-none"
                                            >
                                                <option>AI Agents</option>
                                                <option>Green Tech</option>
                                                <option>Blockchain</option>
                                                <option>IoT</option>
                                                <option>Management</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg width="10" height="6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l4 4 4-4" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-ieee-navy flex items-center gap-2">
                                            <Users size={14} className="text-ieee-blue" /> Participation Type
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="participationType"
                                                value={formData.participationType}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-ieee-blue focus:ring-1 focus:ring-ieee-blue transition-all bg-gray-50 focus:bg-white text-gray-700 appearance-none"
                                            >
                                                <option>Individual</option>
                                                <option>Team</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <svg width="10" height="6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l4 4 4-4" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Conditional Team Name Input */}
                                    {formData.participationType === 'Team' && (
                                        <div className="space-y-1 md:col-span-2 animate-fadeIn">
                                            <label className="text-sm font-semibold text-ieee-navy flex items-center gap-2">
                                                <Users size={14} className="text-ieee-blue" /> Team Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                required
                                                name="teamName"
                                                type="text"
                                                value={formData.teamName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-ieee-blue focus:ring-1 focus:ring-ieee-blue transition-all bg-gray-50 focus:bg-white text-gray-700 placeholder:text-gray-400"
                                                placeholder="Enter your team name"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-ieee-blue hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Complete Registration</span>
                                        <ArrowLeft size={18} className="rotate-180" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-gray-400 mt-4">
                                By registering, you agree to our <a href="#" className="text-ieee-blue hover:underline">Privacy Policy</a> and <a href="#" className="text-ieee-blue hover:underline">Terms of Service</a>.
                            </p>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500">
                                Already have an account? <Link href="/login" className="font-bold text-ieee-blue hover:text-blue-700 hover:underline transition-colors">Login here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
