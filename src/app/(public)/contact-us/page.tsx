"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  CalendarCheck,
  FileText,
  Clock,
  ShieldCheck,
  Video,
  CreditCard,
  Building2,
  ArrowRight,
  HeartPulse,
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const servicesList = [
    {
      id: 1,
      icon: Stethoscope,
      title: "Specialist Doctor Consultation",
      description:
        "Connect with BMDC-verified specialist doctors across cardiology, neurology, pediatrics, dermatology, and more.",
      badge: "Primary Service",
      link: "/doctors",
    },
    {
      id: 2,
      icon: CalendarCheck,
      title: "20-Minute Scheduled Slots",
      description:
        "Guaranteed precise time-slot booking system that eliminates long hospital wait times and ensures prompt attention.",
      badge: "Instant Booking",
      link: "/available-today",
    },
    {
      id: 3,
      icon: FileText,
      title: "Digital E-Prescriptions",
      description:
        "Receive automated PDF prescriptions directly sent to your patient dashboard and registered email after consultations.",
      badge: "Paperless",
      link: "/help",
    },
    {
      id: 4,
      icon: CreditCard,
      title: "Automated bKash & Card Pay",
      description:
        "Instant and secure online payment processing with automated refund handling for early cancellations.",
      badge: "Secure Payment",
      link: "/help",
    },
    {
      id: 5,
      icon: Building2,
      title: "Departmental Healthcare",
      description:
        "Browse specialized medical departments, view available doctors, and check schedules by category.",
      badge: "Categorized",
      link: "/departments",
    },
    {
      id: 6,
      icon: Video,
      title: "24/7 Digital Health Support",
      description:
        "Round-the-clock emergency support line and instant patient assistance for smooth booking resolution.",
      badge: "24/7 Active",
      link: "/contact-us",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 select-none pt-24 pb-20">
      {/* 1. HERO BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          <img
            src="https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982501/NormalBanner2_bxyuhd.jpg"
            alt="WellOra Services Banner"
            className="w-full h-[380px] sm:h-[480px] object-cover object-center"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />

          {/* Text Content Overlay */}
          <div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-16">
            <div className="max-w-2xl space-y-4">
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md"
              >
                <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Comprehensive Clinical Solutions</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md"
              >
                Our Healthcare Services
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl"
              >
                Discover how WellOra simplifies doctor consultations, appointment schedules, and digital medical records with seamless efficiency.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Designed for Modern Patient Needs
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Everything you need for hassle-free online doctor bookings and digital prescription tracking in one platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                <Link
                  href={service.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors pt-2 border-t border-slate-100"
                >
                  <span>Explore Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. QUICK CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Looking for Available Doctor Slots Today?
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base">
              Check real-time specialist availability and book your 20-minute slot instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/available-today"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-700 hover:bg-slate-100 font-bold text-sm sm:text-base transition-all shadow-md hover:scale-[1.02] active:scale-95"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>Available Today</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}