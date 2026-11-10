"use client";

import React, { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  ShieldCheck,
  HeartPulse,
  Target,
  Eye,
  CalendarCheck,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Stethoscope,
  Award,
} from "lucide-react";
import Link from "next/link";

// 🔢 Scroll Animated CountUp Component
interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

function CountUp({
  from = 0,
  to,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    const node = ref.current;
    const controls = animate(from, to, {
      duration,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [isInView, from, to, duration, prefix, suffix, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {from.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function AboutUsPage() {
  const coreValues = [
    {
      id: 1,
      icon: ShieldCheck,
      title: "Integrity & Trust",
      description:
        "Every doctor on WellOra is BMDC-verified, ensuring legitimate and top-tier healthcare services for every patient.",
    },
    {
      id: 2,
      icon: Clock,
      title: "Punctuality & Precision",
      description:
        "We value your time. Our automated 20-minute slot schedule eliminates long hospital waiting lines completely.",
    },
    {
      id: 3,
      icon: HeartPulse,
      title: "Patient-Centric Care",
      description:
        "From instant digital prescriptions to automated refunds, every single feature is built with patient comfort in mind.",
    },
    {
      id: 4,
      icon: Sparkles,
      title: "Digital Innovation",
      description:
        "Seamless bKash payment gateway integration alongside Cloudinary-backed e-prescription PDF delivery.",
    },
  ];

  const milestones = [
    {
      target: 500,
      suffix: "+",
      label: "BMDC Doctors",
      icon: Stethoscope,
      decimals: 0,
    },
    {
      target: 15,
      suffix: "k+",
      label: "Happy Patients",
      icon: HeartPulse,
      decimals: 0,
    },
    {
      target: 25,
      suffix: "k+",
      label: "Successful Consultations",
      icon: Award,
      decimals: 0,
    },
    {
      target: 99.8,
      suffix: "%",
      label: "Satisfaction Rate",
      icon: CheckCircle2,
      decimals: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 select-none pt-24 pb-20">
      {/* 1. HERO BANNER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          <img
            src="https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982501/banner5_af84h9.jpg"
            alt="WellOra About Us Banner"
            className="w-full h-[400px] sm:h-[500px] object-cover object-center"
          />
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40" />

          {/* Banner Text Overlay */}
          <div className="absolute inset-0 flex items-center px-6 sm:px-12 lg:px-16">
            <div className="max-w-2xl space-y-4">
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md"
              >
                <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Empowering Healthcare Digitally</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md"
              >
                Transforming How You Connect With Healthcare Specialists
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl"
              >
                WellOra is Bangladesh's modern healthcare management platform designed to eliminate waiting rooms and bring certified medical consultations right to your fingertips.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR VISION & MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 w-fit mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              To make high-quality medical consultations accessible, transparent, and hassle-free for everyone by pairing top BMDC-certified doctors with efficient 20-minute digital appointment slots.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 w-fit mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              To create a fully paperless, integrated digital health ecosystem where patient appointment booking, instant bKash checkout, and e-prescription histories are managed effortlessly in one secure portal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. CORE VALUES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            The Principles That Drive Us
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Everything we build at WellOra is guided by our dedication to medical integrity and user simplicity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 w-fit mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    {value.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. STATS COUNTER BAR (SCROLL ANIMATED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="pt-4 lg:pt-0">
                <h3 className="text-3xl sm:text-4xl font-black text-emerald-400">
                  <CountUp
                    to={milestone.target}
                    suffix={milestone.suffix}
                    decimals={milestone.decimals}
                    duration={2.2}
                  />
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mt-2">
                  {milestone.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION (CTA) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Experience Hassle-Free Healthcare?
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base">
              Browse available doctor schedules today and book your 20-minute consultation slot in under 2 minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-700 hover:bg-slate-100 font-bold text-sm sm:text-base transition-all shadow-md hover:scale-[1.02] active:scale-95"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>Book Appointment</span>
            </Link>
            <Link
              href="/available-today"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-800 text-white font-semibold text-sm sm:text-base border border-emerald-500/50 transition-all hover:scale-[1.02] active:scale-95"
            >
              <span>Available Today</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}