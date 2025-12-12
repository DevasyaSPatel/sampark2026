import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-[#002855] sm:text-4xl">
                        Contact Us
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Get in touch with the Sampark 2026 team.
                    </p>
                </div>

                {/* Contact Cards Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
                    {/* Card 1: General Inquiries (Email) */}
                    <a
                        href="mailto:ieee.sampark2026@gmail.com"
                        className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100"
                    >
                        <div className="p-4 bg-blue-50 rounded-full mb-4 group-hover:bg-[#00629B] transition-colors duration-300">
                            <Mail className="w-8 h-8 text-[#00629B] group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-[#002855] mb-2 group-hover:text-[#00629B] transition-colors">
                            Email Us
                        </h3>
                        <p className="text-gray-600 text-center">
                            ieee.sampark2026@gmail.com
                            <br />
                            <span className="text-sm text-gray-400">(General Inquiries)</span>
                        </p>
                    </a>

                    {/* Card 2: Helpline (Phone) */}
                    <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100">
                        <div className="p-4 bg-blue-50 rounded-full mb-4 group-hover:bg-[#00629B] transition-colors duration-300">
                            <Phone className="w-8 h-8 text-[#00629B] group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-[#002855] mb-4 group-hover:text-[#00629B] transition-colors">
                            Call Us
                        </h3>
                        <div className="flex flex-col space-y-3 w-full">
                            <span
                                className="w-full py-2 px-4 text-center rounded-lg bg-gray-50 text-[#002855] font-medium text-lg"
                            >
                                xxx
                            </span>
                            <span
                                className="w-full py-2 px-4 text-center rounded-lg bg-gray-50 text-[#002855] font-medium text-lg"
                            >
                                xxx
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Visit Us (Location) */}
                    <a
                        href="https://maps.google.com/?q=Pandit+Deendayal+Energy+University"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100"
                    >
                        <div className="p-4 bg-blue-50 rounded-full mb-4 group-hover:bg-[#00629B] transition-colors duration-300">
                            <MapPin className="w-8 h-8 text-[#00629B] group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-[#002855] mb-2 group-hover:text-[#00629B] transition-colors">
                            Our Office
                        </h3>
                        <p className="text-gray-600 text-center">
                            Pandit Deendayal Energy University
                            <br />
                            Knowledge Corridor, Raisan
                            <br />
                            Gandhinagar, Gujarat - 382426
                        </p>
                    </a>
                </div>

                {/* Map Section */}
                <div className="relative w-full h-96 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        src="https://maps.google.com/maps?q=Pandit%20Deendayal%20Energy%20University&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        title="PDEU Location Map"
                        className="absolute inset-0 w-full h-full border-0"
                        aria-label="Map showing location of Pandit Deendayal Energy University"
                    ></iframe>
                </div>

                <div className="mt-8 text-center">
                    <a
                        href="https://maps.google.com/?q=Pandit+Deendayal+Energy+University"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-8 py-3 bg-[#00629B] text-white font-bold rounded-lg shadow-md hover:bg-[#005080] transition-colors text-lg"
                    >
                        <MapPin className="w-5 h-5 mr-2" />
                        Get Directions
                    </a>
                </div>
            </div>
        </div>
    );
}
