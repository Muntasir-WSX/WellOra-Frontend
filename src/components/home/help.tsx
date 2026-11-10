"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  PhoneCall,
  Mail,
  CalendarCheck2,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function HelpSection() {
  const helpItems = [
    {
      id: 1,
      icon: CalendarCheck2,
      title: "How to Book an Appointment?",
      description:
        "Select your preferred specialist, pick a 20-minute available schedule slot, and pay via bKash to confirm.",
    },
    {
      id: 2,
      icon: FileText,
      title: "Where can I get E-Prescriptions?",
      description:
        "Once your doctor completes the consultation, PDF e-prescriptions are automatically emailed and saved to your profile.",
    },
    {
      id: 3,
      icon: Clock,
      title: "What if I need to cancel or refund?",
      description:
        "Cancel at least 1 hour prior to your schedule to receive an automated refund directly back to your payment account.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold tracking-wide mb-4"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Help & Patient Support</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            How Can We Assist You Today?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600"
          >
            Have questions about booking doctor slots, payment processing, or downloading e-prescriptions? We're here to help 24/7.
          </motion.p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982501/banner5_af84h9.jpg"
                alt="WellOra Support & Doctor Guidance"
                className="w-full h-[460px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              
              {/* Overlay Contact Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 shadow-lg">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  24/7 Emergency Support Hotline
                </p>
                <div className="flex items-center gap-3 text-slate-900">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                    <PhoneCall className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black">+013 98345673</h4>
                    <p className="text-xs text-slate-500 font-medium">Instant Patient Assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: FAQ & Contact Boxes */}
          <div className="lg:col-span-7 space-y-6">
            {helpItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Bottom Support Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-4 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base shadow-md shadow-emerald-600/20 transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Support Team</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}