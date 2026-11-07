"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  UserCheck,
  Clock,
  Award,
  CalendarCheck,
  HeartPulse,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: UserCheck,
    title: "Verified Specialist Doctors",
    description:
      "Access top-rated, BMDC-certified medical professionals across various specialties for personalized care.",
  },
  {
    id: 2,
    icon: Clock,
    title: "Instant 20-Minute Slots",
    description:
      "Skip long queues. Book precise time slots that fit your schedule without unnecessary waiting.",
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Secure E-Prescriptions",
    description:
      "Get digital prescriptions and automated lab reports directly sent to your profile and email instantly.",
  },
  {
    id: 4,
    icon: CalendarCheck,
    title: "Seamless Booking & bKash Pay",
    description:
      "Hassle-free appointment booking with fast, automated, and secure online payment options.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold tracking-wide mb-4"
          >
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <span>Why Choose WellOra</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Redefining Healthcare Management for You & Your Family
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600"
          >
            We combine expert clinical care with cutting-edge digital convenience to provide a seamless healthcare experience.
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Feature Items */}
          <div className="lg:col-span-7 space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-300 group"
                >
                  <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Image with Floating Stats Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982500/othersDoctor_gq34od.jpg"
                alt="WellOra Experienced Doctors"
                className="w-full h-[480px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            </div>

            {/* Floating Experience Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 max-w-xs"
            >
              <div className="p-3 bg-emerald-500 text-white rounded-xl">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-2xl font-extrabold text-slate-900">100%</h4>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Verified Specialists
                </p>
              </div>
            </motion.div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}