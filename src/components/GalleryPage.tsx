'use client';

import React from 'react';
import { motion } from 'framer-motion';

// 1. The Data Structure
const eventGallery = [
    { id: 1, imageSrc: '/gallery/New You, New AI workshop by ieee ias/1759774521333.jpg', eventName: 'New You, New AI Workshop' },
    { id: 2, imageSrc: '/gallery/NVIDIA Deep Learning workshop by ieee cis and ieee sb/1753177229171.jpg', eventName: 'NVIDIA Deep Learning Workshop' },
    { id: 3, imageSrc: '/gallery/Public speaking by ieee sb and debsoc club of pdeu/1761884287452.jpg', eventName: 'Public Speaking Session' },
    { id: 4, imageSrc: '/gallery/RF Systems and Antenna Design Workshop by ieee aps and ieee sb pdeu/1754367118783.jpg', eventName: 'RF Systems & Antenna Design' },
    { id: 5, imageSrc: '/gallery/Road Safety ideathon by ieee its , ieee gs and ieee sb pdeu/1759134009881.jpg', eventName: 'Road Safety Ideathon' },
    { id: 6, imageSrc: '/gallery/ROS workshop by ieee ras and ieee sb/1760647632350.jpg', eventName: 'ROS Workshop' },
    { id: 7, imageSrc: '/gallery/STMania by ieee ias pdeu sbc with ieee sb pdeu and ieeegs/1756662363739.jpg', eventName: 'STMania' },
];

export default function GalleryPage() {
    // Duplicate the array to create a seamless loop
    const duplicatedGallery = [...eventGallery, ...eventGallery];

    return (
        <div className="min-h-screen bg-white py-12 overflow-hidden font-sans">
            {/* 4. Theme Integration - Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#002855]">
                    Celebrating Our History
                </h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    A glimpse into the vibrant events and milestones of the IEEE Student Branch.
                </p>
            </div>

            <div className="space-y-8">
                {/* Row 1: Scrolls Left */}
                <div className="relative w-full flex overflow-hidden">
                    <motion.div
                        className="flex gap-4 sm:gap-6 whitespace-nowrap"
                        animate={{ x: [0, '-50%'] }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 30, // Adjust speed here
                                ease: "linear",
                            },
                        }}
                        style={{ width: "200%" }} // Ensure container is wide enough
                    >
                        {duplicatedGallery.map((event, index) => (
                            <EventCard key={`row1-${event.id}-${index}`} event={event} />
                        ))}
                    </motion.div>
                </div>

                {/* Row 2: Scrolls Right */}
                <div className="relative w-full flex overflow-hidden">
                    <motion.div
                        className="flex gap-4 sm:gap-6 whitespace-nowrap"
                        animate={{ x: ['-50%', 0] }} // Start from -50% to scroll right seamlessly
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 35, // Slightly different speed for visual interest
                                ease: "linear",
                            },
                        }}
                        style={{ width: "200%" }}
                    >
                        {duplicatedGallery.map((event, index) => (
                            <EventCard key={`row2-${event.id}-${index}`} event={event} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// 3. The Image Card Component
function EventCard({ event }: { event: { id: number, imageSrc: string, eventName: string } }) {
    return (
        <div className="relative flex-none w-[20rem] h-40 sm:w-[28rem] sm:h-64 rounded-xl overflow-hidden shadow-md group cursor-pointer bg-gray-200">
            {/* 3. Aspect Ratio & Image */}
            {/* Using a simple img for placeholder/checking. In production, Next.js Image is better but keeping it simple as requested. */}
            {/* Ideally we would use next/image but for flexibility with placeholders user might not have, standard img is safer to start. */}
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-400">
                <img
                    src={event.imageSrc}
                    alt={event.eventName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>


            {/* 3. The Hover Interaction */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                <h3 className="text-white font-bold text-xl px-4 text-center">
                    {event.eventName}
                </h3>
            </div>
        </div>
    );
}
