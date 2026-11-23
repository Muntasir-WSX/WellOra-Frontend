"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Briefcase,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  Loader2,
  Pause,
  Play,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";

import {
  getPublicDoctorsApi,
  type IDoctorApplication,
} from "@/lib/doctor.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OurDoctors() {
  const [doctors, setDoctors] = useState<IDoctorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let active = true;

    getPublicDoctorsApi({
      page: 1,
      limit: 12,
    })
      .then((res) => {
        if (active) setDoctors(res.doctors);
      })
      .catch((error: unknown) => {
        if (active) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load doctors",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

 
  useEffect(() => {
    if (!isAutoPlaying || doctors.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % doctors.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, doctors.length]);

  const handlePrev = () => {
    if (doctors.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + doctors.length) % doctors.length);
  };

  const handleNext = () => {
    if (doctors.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % doctors.length);
  };

 
  const visibleDoctors: IDoctorApplication[] = [];
  if (doctors.length > 0) {
    const count = Math.min(3, doctors.length);
    for (let i = 0; i < count; i++) {
      visibleDoctors.push(doctors[(activeIndex + i) % doctors.length]);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Section Header + Sequential Controls */}
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl space-y-3">
          <Badge
            variant="secondary"
            className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400"
          >
            <HeartPulse className="h-3.5 w-3.5 text-emerald-600" />
            BMDC Verified Specialists
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Meet Our Experienced Doctors
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Connect directly with verified medical specialists for dedicated
            20-minute consultations and digital prescriptions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {doctors.length > 1 && (
            <div className="flex items-center gap-1.5 rounded-xl border bg-background p-1 shadow-xs">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={handlePrev}
                aria-label="Previous doctor"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                aria-label={isAutoPlaying ? "Pause slide" : "Play slide"}
              >
                {isAutoPlaying ? (
                  <Pause className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Play className="h-3.5 w-3.5 text-emerald-600" />
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={handleNext}
                aria-label="Next doctor"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button
            asChild
            variant="outline"
            className="gap-2 rounded-xl border-slate-300 font-semibold"
          >
            <Link href="/doctors">
              View All Doctors
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Sequential One-by-One Dynamic Doctors Showcase */}
      {loading ? (
        <div className="flex h-72 items-center justify-center gap-2 rounded-3xl border border-dashed text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Loading specialist doctors...</span>
        </div>
      ) : doctors.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center">
          <Stethoscope className="h-10 w-10 text-muted-foreground/40" />
          <h3 className="mt-3 text-base font-semibold">
            No verified doctors available yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Approved doctors will appear here automatically.
          </p>
        </div>
      ) : (
        <div
          className="space-y-6"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibleDoctors.map((doctor, idx) => (
                <motion.div
                  key={`${doctor.id}-${activeIndex}`}
                  layout
                  initial={{ opacity: 0, x: 40, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.97 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.12, 
                    ease: "easeOut",
                  }}
                >
                  <Card className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border-slate-200/80 shadow-sm transition-all hover:border-emerald-500/40 hover:shadow-lg">
                    <div>
                      {/* Doctor Header */}
                      <div className="relative flex items-center gap-4 border-b bg-gradient-to-br from-emerald-500/10 via-slate-50 to-teal-500/5 p-5 dark:from-emerald-950/30 dark:via-card dark:to-card">
                        <Avatar className="h-16 w-16 shrink-0 border-2 border-emerald-500/30 shadow-sm">
                          <AvatarImage
                            src={doctor.profilePhoto || ""}
                            alt={doctor.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-emerald-600/10 text-base font-bold text-emerald-700">
                            {doctor.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <Badge
                            variant="secondary"
                            className="bg-emerald-500/10 text-[11px] text-emerald-700 dark:text-emerald-400"
                          >
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            {doctor.department?.name || doctor.specialization}
                          </Badge>

                          <CardTitle className="mt-1.5 truncate text-lg font-bold text-slate-900 dark:text-slate-100">
                            {doctor.name}
                          </CardTitle>
                          <p className="truncate text-xs font-medium text-muted-foreground">
                            {doctor.qualifications}
                          </p>
                        </div>
                      </div>

                      <CardHeader className="pb-2 pt-4">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1 font-medium text-foreground">
                            <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
                            {doctor.experienceYears}+ Years Exp.
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <Award className="h-3.5 w-3.5 text-emerald-600" />
                            BMDC: {doctor.licenseNumber}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4 pb-4">
                        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {doctor.bio ||
                            `Experienced ${doctor.specialization} specialist providing personalized, evidence-based medical consultations.`}
                        </p>

                        <div className="flex items-center justify-between rounded-xl border bg-slate-50/80 px-3.5 py-2.5 text-xs dark:bg-slate-900/50">
                          <span className="text-muted-foreground">
                            Consultation Fee
                          </span>
                          <span className="text-sm font-extrabold text-emerald-600">
                            {doctor.consultationFee
                              ? `৳${doctor.consultationFee}`
                              : "Standard Fee"}
                          </span>
                        </div>
                      </CardContent>
                    </div>

                    <CardFooter className="flex items-center gap-2.5 border-t pt-4">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl"
                      >
                        <Link href={`/doctors/${doctor.id}`}>Profile</Link>
                      </Button>
                      <Button
                        asChild
                        size="sm"
                        className="flex-1 gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        <Link href="/available-today">
                          <CalendarCheck className="h-4 w-4" />
                          Book Slot
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom Step Indicators (One per Doctor) */}
          {doctors.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {doctors.map((doc, idx) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Show ${doc.name}`}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === idx
                      ? "w-8 bg-emerald-600"
                      : "w-2 bg-slate-300 hover:bg-emerald-400 dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}