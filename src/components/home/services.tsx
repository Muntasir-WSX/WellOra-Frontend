"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  CreditCard,
  FileText,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SERVICE_CARD_IMAGE =
  "https://res.cloudinary.com/dnk0bvpym/image/upload/v1794323701/health3_wm9wib.jpg";

const servicesList = [
  {
    title: "Specialist Doctor Consultations",
    description:
      "Connect with BMDC-verified specialists across Cardiology, Neurology, Pediatrics, and more with guaranteed 20-minute dedicated slots.",
    icon: Stethoscope,
    badge: "Most Popular",
    href: "/services",
    ctaLabel: "Service Details",
    featured: true,
  },
  {
    title: "Same-Day Urgent Slots",
    description:
      "View real-time doctor availability and book immediate same-day appointments without waiting in long hospital queues.",
    icon: Clock,
    badge: "Live Availability",
    href: "/available-today",
    ctaLabel: "Available Today",
    featured: false,
  },
  {
    title: "Instant Digital E-Prescriptions",
    description:
      "Access verified PDF e-prescriptions, diagnostic advice, and medication histories directly from your patient dashboard after every visit.",
    icon: FileText,
    badge: "Paperless Care",
    href: "/services",
    ctaLabel: "Learn More",
    featured: false,
  },
  {
    title: "Automated Payment & Refund",
    description:
      "Pay securely via bKash or Card with instant slot confirmation, plus automated 100% refund if canceled at least 1 hour prior.",
    icon: CreditCard,
    badge: "Protected Booking",
    href: "/services",
    ctaLabel: "How It Works",
    featured: false,
  },
];

export default function Services() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl space-y-3">
          <Badge
            variant="secondary"
            className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400"
          >
            <HeartPulse className="h-3.5 w-3.5 text-emerald-600" />
            Our Healthcare Services
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Complete Digital Care &amp; Smart Scheduling
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            From verified specialist consultations to instant e-prescriptions,
            WellOra streamlines every step of your healthcare journey.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="w-fit gap-2 rounded-xl border-slate-300 font-semibold"
        >
          <Link href="/services">
            Explore Full Service Guide
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Main Grid: Featured Image Card + Service Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Featured Card with Provided Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5"
        >
          <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border-slate-200/80 shadow-md transition-all hover:shadow-xl">
            <div className="relative h-64 w-full overflow-hidden bg-slate-900 sm:h-72">
              <img
                src={SERVICE_CARD_IMAGE}
                alt="WellOra Specialist Consultation Service"
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />

              <Badge className="absolute left-4 top-4 border-emerald-400/30 bg-emerald-600 text-white shadow-sm">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                BMDC Verified Care
              </Badge>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-300">
                  Core Service
                </p>
                <h3 className="mt-1 text-xl font-bold leading-snug">
                  20-Minute Dedicated Specialist Consultations
                </h3>
              </div>
            </div>

            <CardContent className="flex-1 pt-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Book top-tier specialist appointments, check live schedules, and
                receive digital e-prescriptions effortlessly with zero waiting
                room hassle.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border bg-slate-50/80 p-3.5 text-xs dark:bg-slate-900/50">
                <div>
                  <span className="block font-bold text-slate-900 dark:text-slate-100">
                    20 Mins / Slot
                  </span>
                  <span className="text-muted-foreground">
                    Guaranteed focus time
                  </span>
                </div>
                <div>
                  <span className="block font-bold text-emerald-600">
                    1-Hour Refund
                  </span>
                  <span className="text-muted-foreground">
                    Automated cancellation
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center gap-3 border-t pt-4">
              <Button
                asChild
                className="flex-1 gap-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
              >
                <Link href="/doctors">
                  <CalendarCheck className="h-4 w-4" />
                  Book Now
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 gap-1.5 rounded-xl"
              >
                <Link href="/services">
                  Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Right 2x2 Service Feature Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
          {servicesList.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Card className="group flex h-full flex-col justify-between rounded-2xl border-slate-200/80 transition-all hover:border-emerald-500/40 hover:shadow-md">
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary" className="text-[11px]">
                        {service.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold leading-snug text-slate-900 dark:text-slate-100">
                      {service.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Link
                      href={service.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                    >
                      <span>{service.ctaLabel}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}