"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  Search,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Find Your Specialist",
    description:
      "Browse verified doctors by department, specialty, or consultation fee—no login required to explore profiles.",
    highlight: "Public Doctor Directory",
    icon: Search,
    accent: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    step: "02",
    title: "Pick Today's Schedule & Mode",
    description:
      "Select an active 20-minute consultation window for today and choose between Online Video Call or In-Person visit.",
    highlight: "Live Slot Availability",
    icon: CalendarClock,
    accent: "text-sky-600 bg-sky-500/10 border-sky-500/20",
  },
  {
    step: "03",
    title: "Instant bKash Checkout",
    description:
      "Complete your consultation fee securely via tokenized bKash payment. Free auto-refund if cancelled 1+ hour early.",
    highlight: "100% Refund Protected",
    icon: CreditCard,
    accent: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
  {
    step: "04",
    title: "Get Serial, Time & PDF Invoice",
    description:
      "Receive your exact serial number, calculated joining time, meeting link, and PDF receipt directly in your email.",
    highlight: "Instant Confirmation",
    icon: FileCheck2,
    accent: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
  },
];

export default function AppointmentWorkflowSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Badge
            variant="secondary"
            className="mb-4 gap-1.5 rounded-full border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-emerald-700 dark:text-emerald-400"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Simple 4-Step Booking Process
          </Badge>

          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            How to Book Your Doctor Appointment
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            From choosing a verified specialist to getting your exact serial
            number and PDF invoice—everything happens seamlessly in minutes.
          </p>
        </motion.div>

        {/* 4-Step Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Card className="group relative flex h-full flex-col justify-between rounded-3xl border-slate-200/80 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${item.accent}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-2xl font-black text-muted-foreground/25 transition-colors group-hover:text-emerald-500/40">
                        {item.step}
                      </span>
                    </div>

                    <CardTitle className="mt-4 text-lg font-extrabold text-foreground">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="pt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-2">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1 text-xs font-semibold text-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      {item.highlight}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Patient Assurance & CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-xl sm:p-8 lg:flex-row lg:items-center"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-emerald-300">
              <span className="inline-flex items-center gap-1.5">
                <Video className="h-4 w-4" />
                Online & In-Person Visits
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Auto-Refund 1h Before Schedule
              </span>
            </div>

            <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Ready to consult with a specialist today?
            </h3>
            <p className="max-w-2xl text-sm text-slate-300">
              Check live chamber windows, pick your preferred slot, and get your
              exact consultation joining time automatically calculated.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="gap-2 rounded-2xl bg-emerald-600 font-semibold text-white shadow-md hover:bg-emerald-500"
            >
              <Link href="/doctors">
                Find a Doctor Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-2xl bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/dashboard/my-appointments">My Appointments</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}