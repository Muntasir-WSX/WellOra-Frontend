"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, Activity, Clock } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982500/banner1_admw3z.jpg",
    tag: "Welcome to WellOra",
    title: "Compassionate Care, Advanced Medicine",
    description:
      "Connect with top medical specialists and manage your family's healthcare seamlessly from anywhere.",
    primaryBtn: "Book Appointment",
    primaryLink: "/doctors",
    secondaryBtn: "Available Today",
    secondaryLink: "/available-today",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982500/banner2_fqxfka.jpg",
    tag: "24/7 Digital Health",
    title: "Expert Doctors Available At Your Fingertips",
    description:
      "Skip the waiting room. Schedule instant online consultations with certified medical professionals today.",
    primaryBtn: "Find a Doctor",
    primaryLink: "/doctors",
    secondaryBtn: "View Schedule",
    secondaryLink: "/available-today",
  },
  {
    id: 3,
    image:
      "https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982500/banner3_wbo8ze.jpg",
    tag: "Specialized Treatment",
    title: "Your Health Journey Guided by Experts",
    description:
      "From routine checkups to specialized clinical care, discover personalized treatment plans tailored for you.",
    primaryBtn: "Book Appointment",
    primaryLink: "/doctors",
    secondaryBtn: "Explore Services",
    secondaryLink: "/departments",
  },
  {
    id: 4,
    image:
      "https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982924/banner4_fqwnzy.jpg",
    tag: "Seamless Experience",
    title: "Modern Diagnostics & E-Prescriptions",
    description:
      "Get instant access to digital prescription history, lab updates, and follow-up schedules in one place.",
    primaryBtn: "Get Started",
    primaryLink: "/register",
    secondaryBtn: "Available Today",
    secondaryLink: "/available-today",
  },
  {
    id: 5,
    image:
      "https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982501/banner5_af84h9.jpg",
    tag: "Dedicated Support",
    title: "Prioritizing Your Well-being Every Day",
    description:
      "Experience premium healthcare management designed to give you and your loved ones total peace of mind.",
    primaryBtn: "Book Appointment",
    primaryLink: "/doctors",
    secondaryBtn: "Contact Us",
    secondaryLink: "/contact-us",
  },
];

export default function Banner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative w-full h-[550px] md:h-[650px] overflow-hidden bg-slate-950 select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image (z-0) */}
          <motion.img
            src={currentSlide.image}
            alt={currentSlide.title}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 3.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
          />

          {/* Dark Overlay Gradient (z-10) - Enhanced visibility for text */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-slate-950/40 z-10" />

          {/* Text Content Area (z-20) */}
          <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-2xl space-y-6 pt-10">
              
              {/* Tag */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md"
              >
                <Activity className="w-4 h-4 animate-pulse text-emerald-400" />
                <span>{currentSlide.tag}</span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md"
              >
                {currentSlide.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-sm sm:text-base md:text-lg text-slate-200 font-normal leading-relaxed max-w-xl drop-shadow"
              >
                {currentSlide.description}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                {/* Primary Button */}
                <Link
                  href={currentSlide.primaryLink}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{currentSlide.primaryBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Secondary Button */}
                <Link
                  href={currentSlide.secondaryLink}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 font-semibold text-sm sm:text-base backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <span>{currentSlide.secondaryBtn}</span>
                </Link>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Progress Indicators (Dots at bottom) (z-30) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-500 ${
              currentIndex === index
                ? "w-8 bg-emerald-500"
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}