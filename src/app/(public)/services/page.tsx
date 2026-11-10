"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  CalendarCheck,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  HeartPulse,
  CreditCard,
  FileText,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

export default function ServiceDetailPage() {
  const serviceFeatures = [
    {
      title: "BMDC Verified Specialists",
      description:
        "Every doctor listed in our system undergoes strict credential verification before taking consultations.",
    },
    {
      title: "Precise 20-Minute Time Slots",
      description:
        "Guaranteed dedicated time slots so patients never have to wait in long hospital lines.",
    },
    {
      title: "Instant Digital E-Prescriptions",
      description:
        "Get access to your PDF e-prescriptions right after the consultation finishes in your profile.",
    },
    {
      title: "Automated Refund System",
      description:
        "Cancel at least 1 hour prior to receive an automated refund back to your bKash/Card account.",
    },
  ];

  const steps = [
    { step: "01", title: "Select Department", desc: "Choose your required specialty category." },
    { step: "02", title: "Pick Doctor & Slot", desc: "Select an available doctor and 20-min schedule." },
    { step: "03", title: "bKash / Card Pay", desc: "Complete automated payment to confirm booking." },
    { step: "04", title: "Get Consultation", desc: "Attend appointment and receive e-prescription." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 select-none pt-24 pb-20">
      {/* 1. HERO BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          <img
            src="https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982500/doctor_appointment_z2jc1z.jpg"
            alt="WellOra Doctor Appointment Service"
            className="w-full h-[400px] sm:h-[500px] object-cover object-center"
          />
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />

          {/* Banner Text Overlay */}
          <div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-16">
            <div className="max-w-2xl space-y-5">
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md"
              >
                <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Specialized Doctor Appointment Service</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md"
              >
                Seamless Online Doctor Consultations & Scheduling
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl"
              >
                Book top-tier specialist appointments, view real-time doctor availability, and receive digital e-prescriptions effortlessly with WellOra.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="pt-2 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <CalendarCheck className="w-5 h-5" />
                  <span>Find Doctors</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/available-today"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700/80 font-semibold text-sm sm:text-base backdrop-blur-md transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <span>Available Today</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS / STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            How The Appointment Process Works
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Simple 4-step process to get expert healthcare advice from home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden"
            >
              <span className="text-4xl font-black text-emerald-500/20 absolute top-4 right-4">
                {item.step}
              </span>
              <h4 className="text-lg font-bold text-slate-900 mb-2 mt-2">{item.title}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. KEY SERVICE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Service Guarantees
              </span>
              <h3 className="text-3xl font-extrabold text-slate-900 leading-tight">
                Why Patients Trust Our Consultation System
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We combine experienced healthcare professionals with modern tech infrastructure to make scheduling effortless.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {serviceFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{feat.title}</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Book Your Doctor Slot?
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base">
              Browse specialists and reserve your 20-minute slot now.
            </p>
          </div>

          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-700 hover:bg-slate-100 font-bold text-sm sm:text-base transition-all shadow-md shrink-0 hover:scale-[1.02] active:scale-95"
          >
            <CalendarCheck className="w-5 h-5" />
            <span>Book Appointment</span>
          </Link>
        </div>
      </section>
    </div>
  );
}