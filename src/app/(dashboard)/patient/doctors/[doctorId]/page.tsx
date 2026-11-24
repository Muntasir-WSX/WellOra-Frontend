"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";

import {
  getDoctorSchedulesApi,
  getSingleDoctorApi,
  type IDoctorDetails,
} from "@/lib/doctor.api";
import type { IDoctorSchedule } from "@/lib/schedule.api";
import { bookAppointmentApi } from "@/lib/appointment.api";
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
import { Separator } from "@/components/ui/separator";

export default function DoctorDetailsPage() {
  const params = useParams<{ id?: string; doctorId?: string }>();
  const router = useRouter();
  const doctorId = (params?.id || params?.doctorId)?.trim();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [doctor, setDoctor] = useState<IDoctorDetails | null>(null);
  const [schedules, setSchedules] = useState<IDoctorSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [booking, setBooking] = useState(false);

  // Private Route Auth Guard
  useEffect(() => {
    const hasAuth =
      typeof window !== "undefined" &&
      Boolean(
        localStorage.getItem("accessToken") ||
          localStorage.getItem("token") ||
          document.cookie.includes("accessToken="),
      );

    if (!hasAuth) {
      toast.info("Please login to view specialist details and book an appointment.");
      router.replace(
        doctorId ? `/login?redirect=/patient/doctors/${doctorId}` : "/login",
      );
      return;
    }

    setIsAuthorized(true);
  }, [doctorId, router]);

  const fetchDoctorData = useCallback(async () => {
    if (!doctorId || !isAuthorized) return;
    setLoading(true);
    try {
      const doctorRes = await getSingleDoctorApi(doctorId);
      setDoctor(doctorRes);
      setSchedules(await getDoctorSchedulesApi(doctorId));
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load doctor profile",
      );
    } finally {
      setLoading(false);
    }
  }, [doctorId, isAuthorized]);

  useEffect(() => {
    fetchDoctorData();
  }, [fetchDoctorData]);

  const handleBookAppointment = async () => {
    if (!doctor || !selectedSlotId) {
      toast.error("Please select an available time slot first.");
      return;
    }

    setBooking(true);
    try {
      const res = await bookAppointmentApi({
        scheduleId: selectedSlotId,
        type: "ONLINE",
      });

      const paymentUrl =
        res?.data?.paymentUrl;

      toast.success("Appointment slot reserved! Redirecting...");

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        router.push("/patient/appointments");
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not book appointment. Please try again.",
      );
    } finally {
      setBooking(false);
    }
  };

  if (!isAuthorized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-2 pt-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        <span>
          {!isAuthorized
            ? "Checking authentication..."
            : "Loading specialist profile..."}
        </span>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 pt-24 text-center">
        <Stethoscope className="h-12 w-12 text-muted-foreground/40" />
        <h1 className="mt-4 text-2xl font-bold">Doctor Not Found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The specialist profile you are looking for may have been removed or is
          unavailable.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link href="/doctors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Doctors
          </Link>
        </Button>
      </div>
    );
  }

  const availableSchedules = schedules.filter(
    (schedule) => schedule.status === "PUBLISHED" && schedule.availableSlots > 0,
  );
  const openSlotCount = availableSchedules.reduce(
    (total, schedule) => total + schedule.availableSlots,
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-24 dark:bg-background">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div>
          <Button variant="ghost" size="sm" asChild className="gap-1.5 pl-0">
            <Link href="/doctors">
              <ArrowLeft className="h-4 w-4" />
              Back to Specialists
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Doctor Profile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6 lg:col-span-7"
          >
            <Card className="overflow-hidden rounded-3xl border-slate-200/80 shadow-md">
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <Avatar className="h-24 w-24 shrink-0 border-4 border-emerald-500/40 shadow-lg">
                    <AvatarImage
                      src={doctor.profilePhoto || ""}
                      alt={doctor.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-emerald-600 text-xl font-bold text-white">
                      {doctor.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="border-emerald-400/30 bg-emerald-500/20 text-emerald-300">
                        <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                        BMDC Verified
                      </Badge>
                      {doctor.department?.name && (
                        <Badge
                          variant="secondary"
                          className="bg-white/10 text-white"
                        >
                          <Building2 className="mr-1 h-3 w-3" />
                          {doctor.department.name}
                        </Badge>
                      )}
                    </div>

                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                      {doctor.name}
                    </h1>
                    <p className="text-sm font-medium text-emerald-300">
                      {doctor.specialization}
                    </p>
                    <p className="text-xs text-slate-300">
                      {doctor.qualifications}
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-3">
                <div className="rounded-2xl border bg-slate-50/80 p-4 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Briefcase className="h-4 w-4 text-emerald-600" />
                    <span>Experience</span>
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-foreground">
                    {doctor.experienceYears}+ Years
                  </p>
                </div>

                <div className="rounded-2xl border bg-slate-50/80 p-4 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Award className="h-4 w-4 text-emerald-600" />
                    <span>BMDC License</span>
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-foreground">
                    {doctor.licenseNumber}
                  </p>
                </div>

                <div className="rounded-2xl border bg-emerald-500/5 p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span>Consultation Fee</span>
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-emerald-600">
                    {doctor.consultationFee
                      ? `৳${doctor.consultationFee}`
                      : "Standard Fee"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-slate-200/80 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">About Specialist</CardTitle>
                <CardDescription>
                  Clinical background, qualifications, and practice information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {doctor.bio ||
                    `${doctor.name} is a dedicated ${doctor.specialization} specialist committed to providing evidence-based diagnosis, preventive healthcare, and personalized treatment plans through WellOra.`}
                </p>

                <Separator />

                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{doctor.email}</p>
                    </div>
                  </div>

                  {doctor.contactNumber && (
                    <div className="flex items-start gap-3">
                      <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">Contact</p>
                        <p className="font-medium">{doctor.contactNumber}</p>
                      </div>
                    </div>
                  )}

                  {doctor.address && (
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Chamber / Location
                        </p>
                        <p className="font-medium">{doctor.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* RIGHT COLUMN: Slot Selection & Appointment Booking */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="lg:col-span-5"
          >
            <Card className="sticky top-24 rounded-3xl border-slate-200/80 shadow-lg">
              <CardHeader className="border-b pb-5">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  >
                    20-Min Dedicated Slot
                  </Badge>
                  <span className="text-xs font-medium text-muted-foreground">
                    {openSlotCount} slots open
                  </span>
                </div>
                <CardTitle className="mt-2 text-xl">
                  Book Appointment Slot
                </CardTitle>
                <CardDescription>
                  Choose an available schedule below to reserve your session.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 pt-6">
                {availableSchedules.length === 0 ? (
                  <div className="rounded-2xl border border-dashed p-6 text-center">
                    <Clock className="mx-auto h-8 w-8 text-muted-foreground/40" />
                    <p className="mt-2 text-sm font-semibold">
                      No open slots available right now
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Please check back later or browse other specialists in
                      this department.
                    </p>
                  </div>
                ) : (
                  <div className="grid max-h-72 grid-cols-1 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
                    {availableSchedules.map((schedule) => {
                      const isSelected = selectedSlotId === schedule.id;

                      return (
                        <button
                          key={schedule.id}
                          type="button"
                          onClick={() => setSelectedSlotId(schedule.id)}
                          className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                            isSelected
                              ? "border-emerald-600 bg-emerald-500/10 ring-2 ring-emerald-600/20"
                              : "border-border hover:border-emerald-500/50 hover:bg-muted/50"
                          }`}
                        >
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {format(
                              new Date(schedule.startDateTime),
                              "EEE, dd MMM yyyy",
                            )}
                          </span>
                          <span className="mt-1 text-xs font-bold text-foreground">
                            {format(new Date(schedule.startDateTime), "hh:mm a")} –{" "}
                            {format(new Date(schedule.endDateTime), "hh:mm a")}
                          </span>
                          <span className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                            {schedule.availableSlots} slots available
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="space-y-2 rounded-2xl border bg-slate-50/80 p-4 text-xs dark:bg-slate-900/50">
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Instant digital e-prescription after visit</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <span>100% automated refund if canceled 1 hour prior</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 border-t pt-5">
                <Button
                  size="lg"
                  disabled={!selectedSlotId || booking}
                  onClick={handleBookAppointment}
                  className="w-full gap-2 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-500"
                >
                  {booking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CalendarCheck className="h-4 w-4" />
                  )}
                  {booking
                    ? "Reserving Slot..."
                    : `Confirm & Pay ${doctor.consultationFee ? `(৳${doctor.consultationFee})` : ""}`}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}