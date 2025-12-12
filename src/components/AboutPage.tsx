import React from 'react';
import { Lightbulb, Globe, Users, Linkedin, Zap, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="font-sans text-gray-800">

            {/* A. The Hero Section */}
            <section className="relative bg-gray-50 py-20 px-4 md:py-32 overflow-hidden">
                {/* Subtle pattern background */}
                <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-[#002855] mb-6">
                        Empowering Future Innovators
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                        Building a bridge between technology and community at PDEU.
                    </p>
                </div>
            </section>

            {/* B. Who We Are (Split Layout) */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <div className="border-l-4 border-[#00629B] pl-6 md:pl-10">
                            <h2 className="text-3xl font-bold text-[#002855] mb-6">Who We Are</h2>
                            <p className="text-lg text-gray-600 leading-relaxed mb-6">
                                We are a vibrant technical community where students connect, share ideas, and grow together.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                More than just a student chapter, we are a catalyst for professional development and collaborative innovation. Our members don't just attend events; they shape the future of technology through shared knowledge and collective ambition.
                            </p>
                        </div>
                        {/* Right: Graphic/Image Placeholder */}
                        <div className="relative h-64 md:h-96 bg-gray-100 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
                            <div className="absolute inset-0 bg-blue-50 flex items-center justify-center text-[#002855]/20 font-bold text-4xl">
                                IEEE COMMUNITY
                            </div>
                            {/*  Replace with actual image later */}
                            {/* <img src="/path/to/about-image.jpg" alt="IEEE Team" className="object-cover w-full h-full" /> */}
                        </div>
                    </div>
                </div>
            </section>

            {/* C. Mission & Vision Cards */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Mission Card */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <Share2 className="w-8 h-8 text-[#00629B]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#002855] mb-4">Our Mission</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Fostering connection among students, professionals, and industry leaders to create a robust network of innovation and support.
                            </p>
                        </div>

                        {/* Vision Card */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                                <Zap className="w-8 h-8 text-[#00629B]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#002855] mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To achieve technical excellence by nurturing a culture of continuous learning, research, and collaborative problem-solving.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* D. Why Connect With Us? (Feature Highlights) */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#002855]">Why Connect With Us?</h2>
                        <p className="mt-4 text-gray-600">Join a network that propels your professional journey.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {/* Feature 1 */}
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-gray-50 rounded-full mb-4">
                                <Users className="w-10 h-10 text-[#00629B]" />
                            </div>
                            <h4 className="text-xl font-bold text-[#002855] mb-2">Professional Network</h4>
                            <p className="text-gray-600">
                                Connect with successful alumni and industry leaders who can provide mentorship and career guidance.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-gray-50 rounded-full mb-4">
                                <Lightbulb className="w-10 h-10 text-[#00629B]" />
                            </div>
                            <h4 className="text-xl font-bold text-[#002855] mb-2">Collaborative Projects</h4>
                            <p className="text-gray-600">
                                Work together on innovative technical projects that challenge your skills and solve real-world problems.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex flex-col items-center">
                            <div className="p-4 bg-gray-50 rounded-full mb-4">
                                <Globe className="w-10 h-10 text-[#00629B]" />
                            </div>
                            <h4 className="text-xl font-bold text-[#002855] mb-2">Knowledge Exchange</h4>
                            <p className="text-gray-600">
                                Participate in seminars, tech talks, and workshops to stay updated with the latest industry trends.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* E. The "Connect" CTA */}
            <section className="bg-[#002855] py-16">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Stay updated with our latest events and professional network.
                    </h2>
                    <div className="flex justify-center">
                        <a
                            href="https://www.linkedin.com/company/ieee-pdeu-sb/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors duration-300 text-lg shadow-lg"
                        >
                            Connect on LinkedIn <Linkedin className="ml-2 w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
