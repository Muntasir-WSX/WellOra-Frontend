"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  HeartPulse,
  Loader2,
  Search,
  Stethoscope,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { getDepartmentsApi, type IDepartment } from "@/lib/department.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const BANNER_IMAGE_URL =
  "https://res.cloudinary.com/dnk0bvpym/image/upload/v1793982501/banner5_af84h9.jpg";

const BANNER_SLIDES = [
  {
    badge: "Specialized Clinical Departments",
    title: "Expert Care Across Every Medical Specialty",
    description:
      "Browse WellOra's verified clinical departments and connect directly with BMDC-certified specialists for dedicated 20-minute consultations.",
  },
  {
    badge: "Precision Diagnosis & Treatment",
    title: "Find the Right Specialist for Your Health Needs",
    description:
      "From Cardiology and Neurology to Pediatrics and Preventive Care—explore structured departments tailored for accurate, compassionate treatment.",
  },
  {
    badge: "Seamless Appointment Booking",
    title: "Real-Time Doctor Schedules & Instant E-Prescriptions",
    description:
      "Select your preferred department, pick an available time slot, and manage your digital prescriptions effortlessly from anywhere.",
  },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide banner text every 4.5 seconds (image stays static)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Fetch all departments
  useEffect(() => {
    let active = true;

    getDepartmentsApi()
      .then((data) => {
        if (active) setDepartments(data);
      })
      .catch((error: unknown) => {
        if (active) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load departments",
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

  const filteredDepartments = departments.filter((dept) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return (
      dept.name.toLowerCase().includes(query) ||
      (dept.description?.toLowerCase().includes(query) ?? false)
    );
  });

  const activeSlide = BANNER_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-24 dark:bg-background">
      {/* 1. HERO BANNER (Fixed Image + Sliding Title & Paragraph) */}
      <section className="mx-auto mb-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-2xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Static Background Image */}
          <img
            src={BANNER_IMAGE_URL}
            alt="WellOra Clinical Departments Banner"
            className="h-[420px] w-full object-cover object-center sm:h-[480px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />

          {/* Sliding Text Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between px-6 py-8 sm:px-12 sm:py-12 lg:px-16">
            <div className="my-auto max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45 }}
                  className="space-y-4"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-emerald-300 backdrop-blur-md sm:text-sm">
                    <HeartPulse className="h-4 w-4 animate-pulse text-emerald-400" />
                    <span>{activeSlide.badge}</span>
                  </div>

                  <h1 className="text-3xl font-black leading-tight tracking-tight text-white drop-shadow-md sm:text-5xl">
                    {activeSlide.title}
                  </h1>

                  <p className="max-w-xl text-sm leading-relaxed text-slate-200 sm:text-base">
                    {activeSlide.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Static Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] hover:bg-emerald-500 active:scale-95 sm:text-base"
                >
                  <CalendarCheck className="h-5 w-5" />
                  <span>Find Specialists</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/available-today"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-95 sm:text-base"
                >
                  <Clock className="h-5 w-5 text-emerald-400" />
                  <span>Available Today</span>
                </Link>
              </div>
            </div>

            {/* Slide Controls & Dots */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                {BANNER_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === idx
                        ? "w-8 bg-emerald-400"
                        : "w-2 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide(
                      (prev) =>
                        (prev - 1 + BANNER_SLIDES.length) %
                        BANNER_SLIDES.length,
                    )
                  }
                  aria-label="Previous slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length)
                  }
                  aria-label="Next slide"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ALL DEPARTMENTS SECTION */}
      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Header & Search Filter */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge
              variant="secondary"
              className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400"
            >
              <Building2 className="h-3.5 w-3.5 text-emerald-600" />
              All Medical Departments ({departments.length})
            </Badge>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              Choose a Clinical Specialty
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select any department below to view available doctors and book
              your appointment.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search department..."
              className="bg-background pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Departments Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center gap-2 rounded-3xl border border-dashed text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <span>Loading all departments...</span>
          </div>
        ) : filteredDepartments.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground/40" />
            <h3 className="mt-3 text-base font-semibold">
              No departments found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm
                ? "Try searching with a different department name."
                : "Clinical departments will appear here once added."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDepartments.map((dept, idx) => {
              const doctorCount = dept._count?.doctors ?? 0;

              return (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: (idx % 6) * 0.05 }}
                >
                  <Card className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border-slate-200/80 transition-all hover:border-emerald-500/40 hover:shadow-lg">
                    <div>
                      {dept.imageUrl && (
                        <div className="relative h-40 w-full overflow-hidden bg-muted">
                          <img
                            src={dept.imageUrl}
                            alt={dept.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <CardHeader className="space-y-3 pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                            <Stethoscope className="h-5 w-5" />
                          </div>
                          <Badge
                            variant="secondary"
                            className="gap-1 text-[11px]"
                          >
                            <Users className="h-3 w-3 text-emerald-600" />
                            {doctorCount}{" "}
                            {doctorCount === 1 ? "Doctor" : "Doctors"}
                          </Badge>
                        </div>

                        <CardTitle className="text-lg font-bold leading-snug text-slate-900 dark:text-slate-100">
                          {dept.name}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pb-4">
                        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {dept.description ||
                            `Specialized diagnosis, consultation, and treatment services under the ${dept.name} department.`}
                        </p>
                      </CardContent>
                    </div>

                    <CardFooter className="border-t pt-4">
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-between px-2 font-semibold text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700"
                      >
                        <Link href={`/doctors?departmentId=${dept.id}`}>
                          <span>View Specialists</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}