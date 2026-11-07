"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, HeartPulse, Users, Stethoscope } from "lucide-react";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-100">
              <img
                src="https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982500/banner2_fqxfka.jpg"
                alt="WellOra Doctors Consultation"
                className="w-full h-[420px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            </div>

            {/* Floating Experience Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-6 -right-4 sm:right-6 bg-emerald-600 text-white p-5 rounded-2xl shadow-xl border-4 border-white flex items-center gap-4 max-w-xs"
            >
              <div className="p-3 bg-white/20 rounded-xl">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-black">500+</h4>
                <p className="text-xs font-medium text-emerald-100 uppercase tracking-wider">
                  Certified Doctors
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Text & Features */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Sub-tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold tracking-wide"
            >
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              <span>About WellOra</span>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
            >
              Your Trusted Healthcare Partner for Digital Appointments
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base text-slate-600 leading-relaxed"
            >
              WellOra is a modern healthcare management platform designed to bridge the gap between patients and specialized medical doctors. We empower patients to schedule 20-minute consultation slots, receive digital e-prescriptions, and manage medical histories smoothly.
            </motion.p>

            {/* Highlights List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  BMDC Verified Doctors
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Easy Family Profile Sync
                </span>
              </div>
            </motion.div>

            {/* Action Button (Redirects to /about-us) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4"
            >
              <Link
                href="/about-us"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-emerald-600/20 hover:scale-[1.02] active:scale-95 group"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}