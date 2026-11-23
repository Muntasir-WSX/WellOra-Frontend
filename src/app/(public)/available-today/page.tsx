"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Award,
  Banknote,
  Building2,
  CalendarCheck2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { bookAppointmentApi } from "@/lib/appointment.api";
import { getDepartmentsApi, type IDepartment } from "@/lib/department.api";
import {
  getAvailableDoctorsTodayApi,
  type IAvailableTodayDoctor,
  type ITodaysScheduleSlot,
} from "@/lib/doctor.api";
import { getMyProfile } from "@/lib/user.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AvailableTodayPage() {
  const router = useRouter();

  const [doctors, setDoctors] = useState<IAvailableTodayDoctor[]>([]);
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [page, setPage] = useState(1);

  // Booking Dialog State
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] =
    useState<IAvailableTodayDoctor | null>(null);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ITodaysScheduleSlot | null>(null);
  const [consultationType, setConsultationType] = useState<
    "ONLINE" | "IN_PERSON"
  >("ONLINE");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load public departments for filtering
  useEffect(() => {
    getDepartmentsApi()
      .then((departments) => setDepartments(departments))
      .catch(() => {});
  }, []);

  const fetchTodaysDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAvailableDoctorsTodayApi({
        page,
        limit: 9,
        searchTerm: debouncedSearch || undefined,
        departmentId: selectedDepartment || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setDoctors(res.doctors);
      setMeta(res.meta);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load today's available doctors",
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedDepartment]);

  useEffect(() => {
    fetchTodaysDoctors();
  }, [fetchTodaysDoctors]);

  const handleOpenBookingModal = (
    doctor: IAvailableTodayDoctor,
    schedule: ITodaysScheduleSlot,
  ) => {
    setSelectedDoctor(doctor);
    setSelectedSchedule(schedule);
    setConsultationType("ONLINE");
    setBookingOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedSchedule) return;

    setBookingSubmitting(true);
    try {
      // Verify user is logged in as PATIENT before initiating bKash checkout
      const profile = await getMyProfile().catch(() => null);
      if (!profile) {
        toast.info("Please log in as a patient to book this appointment.");
        router.push("/login?redirect=/available-today");
        return;
      }

      if (profile.role !== "PATIENT") {
        toast.error("Only patient accounts can book doctor appointments.");
        setBookingSubmitting(false);
        return;
      }

      const res = await bookAppointmentApi({
        scheduleId: selectedSchedule.id,
        type: consultationType,
      });

      const paymentUrl = res?.data?.paymentUrl;
      if (!paymentUrl) {
        throw new Error("bKash payment checkout URL was not received");
      }

      window.location.href = paymentUrl;
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to initiate appointment booking",
      );
      setBookingSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      {/* 1. HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-xl sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-3">
            <Badge className="gap-1.5 border-emerald-400/30 bg-emerald-500/20 text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              Live Chamber Windows • {format(new Date(), "EEEE, dd MMM yyyy")}
            </Badge>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Doctors Available Today
            </h1>
            <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
              Browse verified specialists with active consultation slots open
              today. Book instantly via bKash—your exact serial number, joining
              time, and meeting link unlock immediately after payment.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={fetchTodaysDoctors}
            disabled={loading}
            className="gap-1.5 self-start rounded-xl bg-white/10 text-white hover:bg-white/20 lg:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Slots
          </Button>
        </div>
      </div>

      {/* 2. SEARCH & DEPARTMENT FILTERS */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border bg-card p-4 shadow-xs sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctor name or specialty (e.g. Cardiology, Medicine)..."
            className="bg-background pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedDepartment}
            onChange={(e) => {
              setSelectedDepartment(e.target.value);
              setPage(1);
            }}
            className="h-9 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          {(searchTerm || selectedDepartment) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedDepartment("");
                setPage(1);
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* 3. AVAILABLE DOCTORS GRID */}
      {loading ? (
        <div className="flex h-72 items-center justify-center gap-2 rounded-3xl border border-dashed text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Checking live chamber schedules for today...</span>
        </div>
      ) : doctors.length === 0 ? (
        <div className="flex h-80 flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center">
          <CalendarClock className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-3 text-lg font-bold">
            No upcoming schedules left for today
          </h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            All published consultation windows for today have either started or
            been fully booked. Browse our full specialist directory to check
            doctor profiles.
          </p>
          <Button
            asChild
            className="mt-5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
          >
            <Link href="/doctors">Browse All Doctors</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor, idx) => {
            const fee = Number(doctor.consultationFee || 0);
            const hasFee = fee > 0;

            return (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (idx % 6) * 0.05 }}
              >
                <Card className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border-slate-200/80 shadow-xs transition-all hover:border-emerald-500/40 hover:shadow-md">
                  <div>
                    <CardHeader className="border-b bg-slate-50/70 pb-4 dark:bg-slate-900/40">
                      <div className="flex items-start gap-3.5">
                        <Avatar className="h-14 w-14 shrink-0 border-2 border-emerald-500/30">
                          <AvatarImage
                            src={doctor.profilePhoto || ""}
                            alt={doctor.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-emerald-600/15 font-bold text-emerald-700">
                            {doctor.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {doctor.department?.name && (
                              <Badge
                                variant="secondary"
                                className="bg-emerald-500/10 text-[11px] text-emerald-700 dark:text-emerald-400"
                              >
                                {doctor.department.name}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-[11px]">
                              {doctor.experienceYears}+ yrs exp
                            </Badge>
                          </div>

                          <CardTitle className="mt-1.5 truncate text-lg font-extrabold">
                            <Link
                              href={`/doctors/${doctor.id}`}
                              className="hover:text-emerald-600"
                            >
                              {doctor.name}
                            </Link>
                          </CardTitle>

                          <CardDescription className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                            <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">
                              {doctor.specialization}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4 text-xs">
                      <div className="flex items-center justify-between gap-2 text-muted-foreground">
                        <span className="inline-flex items-center gap-1 truncate">
                          <Award className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                          {doctor.qualifications}
                        </span>

                        <span className="inline-flex shrink-0 items-center gap-1 font-extrabold text-foreground">
                          <Banknote className="h-3.5 w-3.5 text-emerald-600" />
                          {hasFee ? `৳${fee.toLocaleString()}` : "Fee Not Set"}
                        </span>
                      </div>

                      {/* Today's Active Schedules */}
                      <div className="space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Today&apos;s Open Windows ({doctor.schedules.length})
                        </p>

                        {doctor.schedules.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between gap-2 rounded-2xl border bg-slate-50/80 p-3 dark:bg-slate-900/50"
                          >
                            <div className="space-y-0.5">
                              <p className="flex items-center gap-1.5 font-bold text-foreground">
                                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                                {format(
                                  new Date(slot.startDateTime),
                                  "hh:mm a",
                                )}{" "}
                                –{" "}
                                {format(new Date(slot.endDateTime), "hh:mm a")}
                              </p>
                              <p className="flex items-center gap-1 text-[11px] text-emerald-600">
                                <Users className="h-3 w-3" />
                                {slot.availableSlots} of {slot.totalSlots} slots
                                left
                              </p>
                            </div>

                            <Button
                              type="button"
                              size="sm"
                              disabled={!hasFee || slot.availableSlots <= 0}
                              onClick={() =>
                                handleOpenBookingModal(doctor, slot)
                              }
                              className="rounded-xl bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
                            >
                              Book Slot
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className="border-t pt-3">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-muted-foreground hover:text-foreground"
                    >
                      <Link href={`/doctors/${doctor.id}`}>
                        View Full Specialist Profile
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* 4. PAGINATION */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
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

      {/* 5. BOOKING MODE & CHECKOUT DIALOG */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarCheck2 className="h-5 w-5 text-emerald-600" />
              Confirm Consultation Slot
            </DialogTitle>
            <DialogDescription>
              Choose your consultation mode and proceed to bKash payment.
            </DialogDescription>
          </DialogHeader>

          {selectedDoctor && selectedSchedule && (
            <div className="space-y-4 pt-2 text-sm">
              <div className="rounded-2xl border bg-slate-50/80 p-3.5 dark:bg-slate-900/50">
                <p className="font-bold text-foreground">
                  {selectedDoctor.name}
                </p>
                <p className="text-xs text-emerald-600">
                  {selectedDoctor.specialization}
                </p>
                <div className="mt-2 flex items-center justify-between border-t pt-2 text-xs">
                  <span className="text-muted-foreground">
                    {format(
                      new Date(selectedSchedule.startDateTime),
                      "hh:mm a",
                    )}{" "}
                    –{" "}
                    {format(new Date(selectedSchedule.endDateTime), "hh:mm a")}
                  </span>
                  <span className="font-extrabold text-foreground">
                    Fee: ৳
                    {Number(
                      selectedDoctor.consultationFee || 0,
                    ).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Consultation Mode</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConsultationType("ONLINE")}
                    className={`flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition ${
                      consultationType === "ONLINE"
                        ? "border-emerald-600 bg-emerald-500/10 text-foreground"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                      <Video className="h-4 w-4 text-emerald-600" />
                      Online Video
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Video link sent after payment
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultationType("IN_PERSON")}
                    className={`flex flex-col items-start gap-1 rounded-2xl border p-3 text-left transition ${
                      consultationType === "IN_PERSON"
                        ? "border-emerald-600 bg-emerald-500/10 text-foreground"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                      <Building2 className="h-4 w-4 text-sky-600" />
                      In-Person Visit
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Visit doctor chamber
                    </span>
                  </button>
                </div>
              </div>

              <p className="flex items-start gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                <span>
                  Your serial number, exact joining time, and meeting link will
                  be generated automatically once bKash payment succeeds.
                </span>
              </p>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setBookingOpen(false)}
              disabled={bookingSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmBooking}
              disabled={bookingSubmitting}
              className="gap-2 bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {bookingSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Proceed to bKash Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}