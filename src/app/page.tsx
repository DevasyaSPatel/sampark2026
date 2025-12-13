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

  const societyLogos = [
    "/gallery/IEEE LOGOs/IEEE APS.png",
    "/gallery/IEEE LOGOs/IEEE CIS.png",
    "/gallery/IEEE LOGOs/IEEE CS.png",
    "/gallery/IEEE LOGOs/IEEE IAS.png",
    "/gallery/IEEE LOGOs/IEEE RAS.png",
    "/gallery/IEEE LOGOs/IEEE SPS.png",
    "/gallery/IEEE LOGOs/IEEE WIE.png",
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ieee-navy mb-6">About the Conference</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Sampark 2026 is the flagship event of the IEEE Student Branch at PDEU, designed to bridge the gap between academic learning and industrial application.
            </p>
          </div>

          {/* Tier 1: Strategic Leaders & Hosts */}
          <div className="mb-20">
            <h3 className="text-xl md:text-2xl font-bold text-ieee-navy text-center mb-10">Organized & Strategically Led By</h3>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
              {/* Left Col: IEEE Gujarat Section */}
              <div className="flex flex-col items-center text-center p-8 bg-blue-50/50 rounded-2xl border border-blue-100 hover:shadow-md transition-all">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-sm border p-4 mb-6">
                  {/* Placeholder for Gujarat Section Logo */}
                  <img src="/gallery/IEEE LOGOs/IEEE Gujarat Section.png" alt="IEEE Gujarat Section" className="max-w-full max-h-full object-contain" />
                </div>
                <h4 className="text-xl font-bold text-ieee-navy mb-2">IEEE Gujarat Section</h4>
                <p className="text-ieee-blue font-medium tracking-wide text-sm uppercase">Main Section Lead & Supporter</p>
              </div>

              {/* Right Col: IEEE Student Branch PDEU */}
              <div className="flex flex-col items-center text-center p-8 bg-blue-50/50 rounded-2xl border border-blue-100 hover:shadow-md transition-all">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-sm border p-4 mb-6">
                  {/* Placeholder for SB PDEU Logo */}
                  <img src="/gallery/IEEE LOGOs/IEEE Student Branch.png" alt="IEEE Student Branch PDEU" className="max-w-full max-h-full object-contain" />
                </div>
                <h4 className="text-xl font-bold text-ieee-navy mb-2">IEEE Student Branch PDEU</h4>
                <p className="text-ieee-blue font-medium tracking-wide text-sm uppercase">Host & Student Partner</p>
              </div>
            </div>
          </div>

          {/* Tier 2: Technical Co-Partners (River Animation) */}
          <div className="mb-20 overflow-hidden">
            <h3 className="text-xl md:text-2xl font-bold text-ieee-navy text-center mb-10">Technical Co-Partners: IEEE Societies</h3>

            <div className="relative w-full overflow-hidden group">
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
              <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

              <div className="flex items-center w-max animate-scroll group-hover:paused">
                {/* Duplicate the array to ensure seamless loop */}
                {[...societyLogos, ...societyLogos].map((logo, idx) => (
                  <div key={idx} className="mx-6 md:mx-10 w-24 md:w-32 transition-transform duration-300 hover:scale-110">
                    <img src={logo} alt={`IEEE Society ${idx}`} className="w-full h-auto object-contain transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tier 3: Legacy CTA */}
          <div className="text-center bg-gray-50 rounded-3xl p-10 md:p-16 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Users size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-ieee-navy mb-4">A Legacy of Excellence</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Discover the journey and impact of previous Sampark editions.</p>
              <Link
                href="/sampark-history"
                className="inline-flex items-center gap-2 bg-ieee-blue text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Learn More About Sampark's Legacy <ArrowRight size={18} />
              </Link>
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
