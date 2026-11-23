"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  FilterX,
  HeartPulse,
  Loader2,
  Search,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";

import {
  getPublicDoctorsApi,
  type IDoctorApplication,
} from "@/lib/doctor.api";
import { getDepartmentsApi, type IDepartment } from "@/lib/department.api";
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
import { Input } from "@/components/ui/input";

const DOCTORS_BANNER_URL =
  "https://res.cloudinary.com/dnk0bvpym/image/upload/v1794296412/banner6_rqu8k8.jpg";

const DOCTOR_BANNER_SLIDES = [
  {
    badge: "BMDC Verified Medical Specialists",
    title: "Consult Experienced Doctors You Can Trust",
    description:
      "Every doctor on WellOra goes through strict credential verification to ensure safe, accurate, and compassionate medical consultations.",
  },
  {
    badge: "Dedicated 20-Minute Consultations",
    title: "Zero Waiting Lines, Instant Slot Confirmation",
    description:
      "Filter specialists by clinical department, check real-time availability, and reserve your preferred 20-minute appointment slot in seconds.",
  },
  {
    badge: "Digital E-Prescriptions & Care",
    title: "Complete Healthcare Guidance from Home",
    description:
      "Connect with top specialists across multiple departments and access verified digital e-prescriptions right after your session.",
  },
];

function OurDoctorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialDepartmentId = searchParams.get("departmentId") || "";

  const [doctors, setDoctors] = useState<IDoctorApplication[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [selectedDepartmentId, setSelectedDepartmentId] =
    useState<string>(initialDepartmentId);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Sync departmentId if URL query changes (e.g., navigating from Departments page)
  useEffect(() => {
    const deptFromUrl = searchParams.get("departmentId") || "";
    setSelectedDepartmentId(deptFromUrl);
    setPage(1);
  }, [searchParams]);

  // Auto-slide banner text every 4.5 seconds (image stays fixed)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % DOCTOR_BANNER_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch departments for filter pills
  useEffect(() => {
    let active = true;
    getDepartmentsApi()
      .then((data) => {
        if (active) setDepartments(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  // Fetch approved doctors publicly (works without login)
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPublicDoctorsApi({
        page,
        limit: 9,
        departmentId: selectedDepartmentId || undefined,
        searchTerm: debouncedSearch || undefined,
      });
      setDoctors(res.doctors);
      setMeta(res.meta);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load doctors",
      );
    } finally {
      setLoading(false);
    }
  }, [page, selectedDepartmentId, debouncedSearch]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleSelectDepartment = (deptId: string) => {
    setSelectedDepartmentId(deptId);
    setPage(1);
    if (deptId) {
      router.push(`/doctors?departmentId=${deptId}`, { scroll: false });
    } else {
      router.push("/doctors", { scroll: false });
    }
  };

  const handleDoctorAction = (doctorId: string, isBookAction = false) => {
    if (isBookAction) {
      router.push("/available-today");
      return;
    }

    router.push(`/doctors/${doctorId}`);
  };

  const activeDepartment = departments.find(
    (d) => d.id === selectedDepartmentId,
  );
  const activeSlide = DOCTOR_BANNER_SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-24 dark:bg-background">
      {/* 1. HERO BANNER (Fixed Image + Sliding Title & Paragraph) */}
      <section className="mx-auto mb-14 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-2xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <img
            src={DOCTORS_BANNER_URL}
            alt="WellOra Verified Specialists"
            className="h-[420px] w-full object-cover object-center sm:h-[480px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />

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

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/available-today"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] hover:bg-emerald-500 active:scale-95 sm:text-base"
                >
                  <Clock className="h-5 w-5" />
                  <span>Available Today</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/departments"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-95 sm:text-base"
                >
                  <Building2 className="h-5 w-5 text-emerald-400" />
                  <span>All Departments</span>
                </Link>
              </div>
            </div>

            {/* Slide Controls & Dots */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                {DOCTOR_BANNER_SLIDES.map((_, idx) => (
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
                        (prev - 1 + DOCTOR_BANNER_SLIDES.length) %
                        DOCTOR_BANNER_SLIDES.length,
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
                    setCurrentSlide(
                      (prev) => (prev + 1) % DOCTOR_BANNER_SLIDES.length,
                    )
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

      {/* 2. FILTER BAR & DOCTORS GRID */}
      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Top Bar: Heading + Search */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge
              variant="secondary"
              className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              {activeDepartment
                ? `${activeDepartment.name} Specialists (${meta.total})`
                : `All Verified Doctors (${meta.total})`}
            </Badge>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              {activeDepartment
                ? `Available Doctors in ${activeDepartment.name}`
                : "Meet Our Specialist Doctors"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a specialist to view their profile, consultation fee, and
              available booking slots.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedDepartmentId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectDepartment("")}
                className="gap-1.5 text-xs"
              >
                <FilterX className="h-3.5 w-3.5" />
                Show All
              </Button>
            )}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctor or specialty..."
                className="bg-background pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Department Filter Pills */}
        {departments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={selectedDepartmentId === "" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => handleSelectDepartment("")}
            >
              All Departments
            </Button>
            {departments.map((dept) => (
              <Button
                key={dept.id}
                size="sm"
                variant={
                  selectedDepartmentId === dept.id ? "default" : "outline"
                }
                className="rounded-full"
                onClick={() => handleSelectDepartment(dept.id)}
              >
                {dept.name}
              </Button>
            ))}
          </div>
        )}

        {/* Dynamic Doctors Cards */}
        {loading ? (
          <div className="flex h-64 items-center justify-center gap-2 rounded-3xl border border-dashed text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <span>Loading available doctors...</span>
          </div>
        ) : doctors.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center">
            <Stethoscope className="h-10 w-10 text-muted-foreground/40" />
            <h3 className="mt-3 text-base font-semibold">
              No available doctors found
            </h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {selectedDepartmentId
                ? "There are currently no approved doctors listed under this department."
                : "Try adjusting your search keywords or department filter."}
            </p>
            {selectedDepartmentId && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => handleSelectDepartment("")}
              >
                View All Doctors
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor, idx) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (idx % 6) * 0.05 }}
              >
                <Card className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border-slate-200/80 transition-all hover:border-emerald-500/40 hover:shadow-lg">
                  <div>
                    {/* Top Cover / Photo Area */}
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
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="secondary"
                            className="bg-emerald-500/10 text-[11px] text-emerald-700 dark:text-emerald-400"
                          >
                            {doctor.department?.name || doctor.specialization}
                          </Badge>
                        </div>
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
                          `Experienced ${doctor.specialization} specialist dedicated to evidence-based patient care and personalized consultation.`}
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
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDoctorAction(doctor.id, false)}
                      className="flex-1 rounded-xl"
                    >
                      Details
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleDoctorAction(doctor.id, true)}
                      className="flex-1 gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                    >
                      <CalendarCheck className="h-4 w-4" />
                      Book Slot
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page <strong className="text-foreground">{meta.page}</strong> of{" "}
              <strong className="text-foreground">{meta.totalPages}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function OurDoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Loading doctors...</span>
        </div>
      }
    >
      <OurDoctorsContent />
    </Suspense>
  );
}