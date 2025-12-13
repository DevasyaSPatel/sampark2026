'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Clock, Ticket } from 'lucide-react';

export default function HistoryPage() {
    const samparkHistory = [
        { year: "2006", edition: "1st", venue: "Gandhinagar", highlight: "The Inception. Founded to empower student voices." },
        { year: "2007", edition: "2nd", venue: "AMA, Ahmedabad", highlight: "Gained momentum as a collaborative platform." },
        { year: "2008", edition: "3rd", venue: "ADIT, VV Nagar", highlight: "Focused on expanding student branch networks." },
        { year: "2009", edition: "4th", venue: "Indroda Park, Gandhinagar", highlight: "A unique nature-based networking event." },
        { year: "2010", edition: "5th", venue: "Science City, Ahmedabad", highlight: "First major milestone at Science City." },
        { year: "2011", edition: "6th", venue: "Greenwoods Resort", highlight: "Focused on team building and bonding." },
        { year: "2012", edition: "7th", venue: "Science City, Ahmedabad", highlight: "Returned by popular demand." },
        { year: "2013", edition: "8th", venue: "GCET, VV Nagar", highlight: "Strong focus on technical activity planning." },
        { year: "2014", edition: "9th", venue: "Marwadi College, Rajkot", highlight: "Expanded reach to the Saurashtra region." },
        { year: "2015", edition: "10th", venue: "SVBIT, Gandhinagar", highlight: "10th Anniversary Celebration." },
        { year: "2016", edition: "11th", venue: "IET, Ahmedabad Univ", highlight: "Valentine's Day Special: Love for Engineering." },
        { year: "2017", edition: "12th", venue: "DDU, Nadiad", highlight: "Mid-year review and vitality boost." },
        { year: "2018", edition: "13th", venue: "Adani Institute (AII)", highlight: "Hosted at premier infrastructure institute." },
        { year: "2019", edition: "14th", venue: "ADIT, Anand", highlight: "Theme: Reach Out and Engage." },
        { year: "2020", edition: "15th", venue: "U.V. Patel, Mehsana", highlight: "15th Edition. Last physical event pre-COVID." },
        { year: "2021", edition: "16th", venue: "Virtual Mode", highlight: "Resilience: First fully virtual Sampark." },
        { year: "2022", edition: "17th", venue: "Virtual Mode", highlight: "Digital networking across the state." },
        { year: "2023", edition: "18th", venue: "Gir Forest, Junagadh", highlight: "Sampark in the Wild: A historic nature edition." },
        { year: "2024", edition: "19th", venue: "Nirma University", highlight: "Massive turnout post-pandemic." },
        { year: "2025", edition: "20th", venue: "SCET, Surat", highlight: "20th Jubilee Edition: Connecting Minds." },
        { year: "2026", edition: "21st", venue: "PDEU, Gandhinagar", highlight: "The Next Chapter. Join us for the future of connection." }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-ieee-navy">
            {/* Background Texture */}
            <div className="fixed inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#00629B 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-16">

                {/* Header */}
                <div className="mb-16 text-center">
                    <div className="inline-flex justify-center mb-6">
                        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-ieee-blue transition-colors px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                            <ArrowLeft size={16} /> Back to Home
                        </Link>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">Two Decades of Connection</h1>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">Tracing the journey of IEEE Gujarat Section's flagship event.</p>
                </div>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 rounded-full md:-ml-0.5"></div>

                    {/* Timeline Items */}
                    <div className="space-y-12 pb-24">
                        {samparkHistory.map((item, index) => {
                            const isCurrent = item.year === "2026";
                            const isEven = index % 2 === 0;

                            return (
                                <div key={index} className={`relative flex items-center md:justify-between ${isEven ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Spacer for desktop layout balance */}
                                    <div className="hidden md:block w-5/12"></div>

                                    {/* Node */}
                                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                                        <div className={`
                                            rounded-full border-4 border-white shadow-md flex items-center justify-center
                                            ${isCurrent ? 'w-10 h-10 bg-ieee-blue animate-pulse' : 'w-6 h-6 bg-white'}
                                        `}>
                                            {isCurrent && (
                                                <div className="absolute inset-0 rounded-full bg-ieee-blue opacity-30 animate-ping"></div>
                                            )}
                                            {!isCurrent && <div className="w-2.5 h-2.5 bg-ieee-blue rounded-full"></div>}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="w-full pl-20 md:pl-0 md:w-5/12">
                                        <div className={`
                                            bg-white p-6 rounded-2xl border transition-all hover:shadow-lg
                                            ${isCurrent ? 'border-ieee-blue shadow-lg ring-4 ring-blue-50' : 'border-gray-100 shadow-sm'}
                                        `}>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`text-3xl font-bold ${isCurrent ? 'text-ieee-blue' : 'text-gray-300'}`}>
                                                    {item.year}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${isCurrent ? 'bg-blue-100 text-ieee-blue' : 'bg-gray-100 text-gray-500'}`}>
                                                    {item.edition} Edition
                                                </span>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-start gap-2 text-gray-600">
                                                    <MapPin size={16} className="mt-0.5 shrink-0 text-ieee-blue" />
                                                    <span className="text-sm font-medium">{item.venue}</span>
                                                </div>
                                            </div>

                                            <p className={`${isCurrent ? 'text-ieee-navy font-semibold' : 'text-gray-500'} text-sm leading-relaxed`}>
                                                {item.highlight}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA Section */}
                    <div className="relative z-30 flex justify-center mt-[-60px] pb-20">
                        <div className="bg-white p-3 rounded-full shadow-xl border border-blue-50">
                            <Link
                                href="/register"
                                className="group bg-ieee-blue hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
                            >
                                <Ticket size={24} className="group-hover:-rotate-12 transition-transform" />
                                Register for Sampark 2026 at PDEU
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="text-center text-gray-400 text-sm mt-8">
                    <p>© IEEE Gujarat Section & IEEE SB PDEU</p>
                </div>
            </div>
        </div>
    );
}
