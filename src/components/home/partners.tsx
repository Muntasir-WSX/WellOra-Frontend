"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Ambulance,
  Building2,
  FlaskConical,
  HeartHandshake,
  HeartPulse,
  Pill,
  ShieldCheck,
  Stethoscope,
  Syringe,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface IPartnerBrand {
  name: string;
  category: string;
  tagline: string;
  icon: React.ElementType;
  accentClass: string;
}

const PARTNER_BRANDS: IPartnerBrand[] = [
  {
    name: "RapidAid 24/7 Ambulance",
    category: "Emergency Ambulance",
    tagline: "ICU & Cardiac Life-Support Fleet",
    icon: Ambulance,
    accentClass: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  },
  {
    name: "NovaCare Pharmaceuticals",
    category: "Pharmaceuticals",
    tagline: "WHO-GMP Certified Medicines",
    icon: Pill,
    accentClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    name: "BioScan Diagnostics",
    category: "Pathology & Imaging",
    tagline: "Home Sample Collection & Lab",
    icon: FlaskConical,
    accentClass: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  },
  {
    name: "MedShield Health Cover",
    category: "Health Insurance",
    tagline: "Cashless Consultation Protection",
    icon: ShieldCheck,
    accentClass: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  },
  {
    name: "Arogya Pharma Ltd.",
    category: "Medicine Delivery",
    tagline: "60-Min E-Prescription Fulfillment",
    icon: Syringe,
    accentClass: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  },
  {
    name: "PulseLine Air & Road Rescue",
    category: "Critical Transfer",
    tagline: "Nationwide Emergency Dispatch",
    icon: HeartPulse,
    accentClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  {
    name: "Apex City Hospital Network",
    category: "Hospital Partner",
    tagline: "Tertiary Referral & Surgery Support",
    icon: Building2,
    accentClass: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  },
  {
    name: "VitalWave MedTech",
    category: "Smart Health Devices",
    tagline: "Remote ECG & Vitals Monitoring",
    icon: Activity,
    accentClass: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
];

export default function Partners() {
  const [isPaused, setIsPaused] = useState(false);

  // Seamless infinite loop এর জন্য লিস্ট ডাবল করা হয়েছে
  const marqueeItems = [...PARTNER_BRANDS, ...PARTNER_BRANDS];

  return (
    <section className="overflow-hidden border-y border-slate-200/70 bg-slate-50/70 py-16 dark:border-border dark:bg-slate-950/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge
            variant="secondary"
            className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-emerald-700 dark:text-emerald-400"
          >
            <HeartHandshake className="h-3.5 w-3.5 text-emerald-600" />
            Trusted Healthcare Ecosystem
          </Badge>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Our Clinical & Logistics Partners
          </h2>
          <p className="mt-2.5 text-sm text-muted-foreground sm:text-base">
            Collaborating with leading pharmaceutical companies, 24/7 emergency
            ambulances, diagnostic labs, and health insurers for end-to-end care.
          </p>
        </div>
      </div>

      {/* Continuous Smooth Slide Show */}
      <div
        className="relative mx-auto max-w-[1600px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left & Right Soft Edge Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-slate-50 to-transparent dark:from-background sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-slate-50 to-transparent dark:from-background sm:w-28" />

        <motion.div
          className="flex w-max gap-5 px-4"
          animate={{
            x: isPaused ? undefined : ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 32,
              ease: "linear",
            },
          }}
        >
          {marqueeItems.map((brand, idx) => {
            const Icon = brand.icon;

            return (
              <div
                key={`${brand.name}-${idx}`}
                className="group flex w-72 shrink-0 items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md dark:border-border dark:bg-card"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 ${brand.accentClass}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {brand.category}
                  </span>
                  <h3 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                    {brand.name}
                  </h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {brand.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom Trust Strip */}
      <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-xs font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Ambulance className="h-3.5 w-3.5 text-emerald-600" />
          24/7 Emergency Dispatch
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Pill className="h-3.5 w-3.5 text-emerald-600" />
          Authentic Pharmacy Network
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Stethoscope className="h-3.5 w-3.5 text-emerald-600" />
          ISO-Certified Diagnostics
        </span>
      </div>
    </section>
  );
}