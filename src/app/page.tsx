'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Users, Calendar, Award, ArrowRight } from 'lucide-react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('user_id')) {
      setIsLoggedIn(true);
    }
  }, []);

  const societies = [
    { name: 'Computer Society', logo: '/placeholder-cs.png' },
    { name: 'ComSoc', logo: '/placeholder-comsoc.png' },
    { name: 'IAS', logo: '/placeholder-ias.png' },
    { name: 'PES', logo: '/placeholder-pes.png' },
  ];

  const galleryImages = [
    { src: '/gallery/New You, New AI workshop by ieee ias/1759774521333.jpg', caption: 'New You, New AI Workshop' },
    { src: '/gallery/NVIDIA Deep Learning workshop by ieee cis and ieee sb/1753177229171.jpg', caption: 'NVIDIA Deep Learning Workshop' },
    { src: '/gallery/Road Safety ideathon by ieee its , ieee gs and ieee sb pdeu/1759134009881.jpg', caption: 'Road Safety Ideathon' },
    { src: '/gallery/ROS workshop by ieee ras and ieee sb/1760647632350.jpg', caption: 'ROS Workshop' },
  ];

  return (
    <div className="min-h-screen bg-ieee-light">
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-5 bg-[url('/grid-pattern.png')] bg-repeat"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-ieee-blue text-sm font-semibold tracking-wide mb-6">
              OFFICIAL IEEE EVENT
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-ieee-navy mb-6 leading-tight">
              SAMPARK <span className="text-ieee-blue">2026</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connecting minds, fostering innovation. Join the premier academic and professional networking event of the year.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="bg-ieee-blue hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Register for Conference <ArrowRight size={20} />
              </Link>
              <Link
                href="/about"
                className="bg-white border text-ieee-navy hover:bg-gray-50 border-gray-200 px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About & Institutional Identity */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl font-bold text-ieee-navy mb-6">About the Conference</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Sampark 2026 is the flagship event of the IEEE Student Branch at PDEU.
                  It brings together students, professionals, and industry leaders for a
                  symposium of knowledge exchange and networking.
                </p>
                <p>
                  Supported by the <strong>IEEE Gujarat Section</strong>, this event aims to
                  bridge the gap between academic learning and industrial application.
                </p>
              </div>

              {/* Special Highlight: Gujarat Section */}
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4">
                <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm text-ieee-blue font-bold text-xs text-center border">
                  IEEE<br />Gujarat
                </div>
                <div>
                  <h4 className="font-bold text-ieee-navy">Supported by IEEE Gujarat Section</h4>
                  <p className="text-sm text-gray-500">Empowering technical excellence across the region.</p>
                </div>
              </div>
            </div>

            {/* Societies Grid */}
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-center font-semibold text-gray-400 mb-6 text-sm uppercase tracking-widest">Organizing Societies</h3>
              <div className="grid grid-cols-2 gap-4">
                {societies.map((society, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center aspect-[4/3] hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-3"></div> {/* Placeholder for Logo */}
                    <span className="text-ieee-navy font-medium text-sm">{society.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Gallery */}
      <section className="py-16 bg-ieee-light overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <h2 className="text-3xl font-bold text-ieee-navy">Gallery</h2>
        </div>

        {/* Carousel Container */}
        <div className="w-full overflow-x-auto no-scrollbar pb-8">
          <div className="flex gap-6 px-4 md:px-8 w-max">
            {galleryImages.map((img, idx) => (
              <motion.div
                key={idx}
                className="relative w-80 md:w-96 rounded-xl overflow-hidden shadow-lg bg-white shrink-0 group"
                whileHover={{ y: -5 }}
              >
                <div className="aspect-[16/9] bg-gray-300 w-full relative">
                  <img src={img.src} alt={img.caption} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="p-4 border-t border-gray-100">
                  <p className="text-ieee-navy font-semibold text-sm">{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-12 bg-ieee-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-blue-900/50">
            <div className="flex flex-col items-center px-4">
              <div className="w-12 h-12 bg-ieee-blue/20 rounded-full flex items-center justify-center mb-3 text-ieee-sky">
                <Users size={24} />
              </div>
              <span className="text-3xl font-bold mb-1">1200+</span>
              <span className="text-blue-200 text-sm">Members</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="w-12 h-12 bg-ieee-blue/20 rounded-full flex items-center justify-center mb-3 text-ieee-sky">
                <Calendar size={24} />
              </div>
              <span className="text-3xl font-bold mb-1">50+</span>
              <span className="text-blue-200 text-sm">Events</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="w-12 h-12 bg-ieee-blue/20 rounded-full flex items-center justify-center mb-3 text-ieee-sky">
                <Award size={24} />
              </div>
              <span className="text-3xl font-bold mb-1">15+</span>
              <span className="text-blue-200 text-sm">Awards</span>
            </div>
            <div className="flex flex-col items-center px-4">
              <div className="w-12 h-12 bg-ieee-blue/20 rounded-full flex items-center justify-center mb-3 text-ieee-sky">
                <Users size={24} />
              </div>
              <span className="text-3xl font-bold mb-1">4</span>
              <span className="text-blue-200 text-sm">Societies</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 border-t border-gray-200 py-12 text-center text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-2">© 2026 IEEE Student Branch PDEU. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-ieee-blue transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ieee-blue transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-ieee-blue transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
