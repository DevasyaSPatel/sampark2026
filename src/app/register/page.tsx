'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
                setMessage('Registration successful! Check your email for login credentials.');
                // Optionally redirect
                setTimeout(() => router.push('/login'), 3000);
            } else {
                setMessage(data.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            setMessage('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <nav className="glass fixed top-0 left-0 w-full z-50 px-6 py-4">
                <div className="container flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold gradient-text">Sampark 2026</Link>
                    <Link href="/" className="text-gray-400 hover:text-white">Back to Home</Link>
                </div>
            </nav>

            <div className="container max-w-2xl">
                <div className="glass p-8">
                    <h1 className="text-3xl font-bold mb-6 text-center">Register for Sampark</h1>

                    {message && (
                        <div className={`p-4 rounded-lg mb-6 text-center ${message.includes('successful') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Name & Email */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                <input required name="name" type="text" onChange={handleChange} className="input-field" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                <input required name="email" type="email" onChange={handleChange} className="input-field" placeholder="john@example.com" />
                            </div>
                        </div>

                        {/* Phone & Uni */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                                <input required name="phone" type="tel" onChange={handleChange} className="input-field" placeholder="1234567890" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">University / Institution</label>
                                <input required name="university" type="text" onChange={handleChange} className="input-field" />
                            </div>
                        </div>

                        {/* Dept & Year */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Department</label>
                                <input required name="department" type="text" onChange={handleChange} className="input-field" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Year of Study</label>
                                <select name="year" onChange={handleChange} className="input-field">
                                    <option>1st Year</option>
                                    <option>2nd Year</option>
                                    <option>3rd Year</option>
                                    <option>4th Year</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Theme */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Preferred Theme</label>
                            <select name="theme" onChange={handleChange} className="input-field">
                                <option>AI Agents</option>
                                <option>Green Tech</option>
                                <option>Blockchain</option>
                                <option>IoT</option>
                                <option>Management</option>
                            </select>
                        </div>

                        {/* Participation Type */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Participation Type</label>
                            <select name="participationType" onChange={handleChange} className="input-field">
                                <option>Individual</option>
                                <option>Team</option>
                            </select>
                        </div>

                        {formData.participationType === 'Team' && (
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Team Name</label>
                                <input required name="teamName" type="text" onChange={handleChange} className="input-field" />
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn btn-primary mt-4 py-3">
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .input-field {
                    width: 100%;
                    background: rgba(0,0,0,0.5);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 0.5rem;
                    padding: 0.75rem;
                    color: white;
                    outline: none;
                }
                .input-field:focus {
                    border-color: var(--primary);
                }
            `}</style>
        </div>
    );
}
