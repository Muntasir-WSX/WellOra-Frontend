"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Building2,
  Calendar,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  CreditCard,
  Hash,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Stethoscope,
  UserCheck,
  Video,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  getMyAppointmentsApi,
  type IAppointmentRecord,
} from "@/lib/appointment.api";
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
import { Input } from "@/components/ui/input";

interface IBookedDoctorSummary {
  doctorId: string;
  doctorName: string;
  specialization: string;
  totalBookings: number;
  completedCount: number;
  activeCount: number;
  latestAppointment: IAppointmentRecord;
}

function getStatusBadge(status: string) {
  const upper = status?.toUpperCase();
  switch (upper) {
    case "CONFIRMED":
      return (
        <Badge className="gap-1 border-sky-500/30 bg-sky-500/15 text-sky-700 dark:text-sky-400">
          <CalendarCheck2 className="h-3 w-3" />
          CONFIRMED
        </Badge>
      );
    case "ONGOING":
      return (
        <Badge className="gap-1 border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400">
          <Activity className="h-3 w-3" />
          ONGOING
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3" />
          COMPLETED
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge className="gap-1 border-rose-500/30 bg-rose-500/15 text-rose-700 dark:text-rose-400">
          <XCircle className="h-3 w-3" />
          CANCELLED
        </Badge>
      );
    default:
      return (
        <Badge
          variant="secondary"
          className="gap-1 border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300"
        >
          <Clock className="h-3 w-3" />
          {upper || "PENDING"}
        </Badge>
      );
  }
}

export default function BookedDoctorsPage() {
  const [appointments, setAppointments] = useState<IAppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"ALL" | "ACTIVE" | "COMPLETED">(
    "ALL",
  );

  const fetchBookedDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMyAppointmentsApi({
        page: 1,
        limit: 100,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setAppointments(res.appointments);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load your booked doctors",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookedDoctors();
  }, [fetchBookedDoctors]);

  // Group patient's appointments by unique doctor
  const bookedDoctorsList = useMemo<IBookedDoctorSummary[]>(() => {
    const map = new Map<string, IBookedDoctorSummary>();

    for (const appt of appointments) {
      if (!appt.doctor?.id) continue;

      const docId = appt.doctor.id;
      const statusUpper = appt.status?.toUpperCase();
      const isCompleted = statusUpper === "COMPLETED";
      const isActive =
        statusUpper === "CONFIRMED" ||
        statusUpper === "ONGOING" ||
        statusUpper === "PENDING";

      const existing = map.get(docId);
      if (!existing) {
        map.set(docId, {
          doctorId: docId,
          doctorName: appt.doctor.name,
          specialization: appt.doctor.specialization,
          totalBookings: 1,
          completedCount: isCompleted ? 1 : 0,
          activeCount: isActive ? 1 : 0,
          latestAppointment: appt,
        });
      } else {
        existing.totalBookings += 1;
        if (isCompleted) existing.completedCount += 1;
        if (isActive) existing.activeCount += 1;
      }
    }

    return Array.from(map.values());
  }, [appointments]);

  const filteredDoctors = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return bookedDoctorsList.filter((item) => {
      if (filterMode === "ACTIVE" && item.activeCount === 0) return false;
      if (filterMode === "COMPLETED" && item.completedCount === 0) return false;

      if (!q) return true;
      return (
        item.doctorName.toLowerCase().includes(q) ||
        item.specialization.toLowerCase().includes(q)
      );
    });
  }, [bookedDoctorsList, filterMode, searchQuery]);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div className="space-y-1.5">
          <Badge
            variant="secondary"
            className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          >
            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
            My Care Team
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            My Booked Doctors
          </h1>
          <p className="text-sm text-muted-foreground">
            Specialists whose schedules you have booked—view your latest
            consultation status, serial numbers, or re-book a follow-up visit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchBookedDoctors}
            disabled={loading}
            className="gap-1.5 rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            asChild
            size="sm"
            className="gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
          >
            <Link href="/available-today">
              <Sparkles className="h-4 w-4" />
              Book New Slot
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. FILTER TABS & SEARCH */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: `All Doctors (${bookedDoctorsList.length})`, value: "ALL" },
            { label: "Active / Upcoming", value: "ACTIVE" },
            { label: "Completed Visits", value: "COMPLETED" },
          ].map((tab) => (
            <Button
              key={tab.value}
              type="button"
              size="sm"
              variant={filterMode === tab.value ? "default" : "outline"}
              className="rounded-full"
              onClick={() =>
                setFilterMode(tab.value as "ALL" | "ACTIVE" | "COMPLETED")
              }
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search booked doctor or specialty..."
            className="bg-background pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 3. BOOKED DOCTORS GRID */}
      {loading ? (
        <div className="flex h-64 items-center justify-center gap-2 rounded-3xl border border-dashed text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Loading your booked specialists...</span>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center">
          <Stethoscope className="h-11 w-11 text-muted-foreground/40" />
          <h3 className="mt-3 text-base font-bold">No booked doctors found</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {searchQuery || filterMode !== "ALL"
              ? "No doctors match your current filter."
              : "You haven't booked any doctor's schedule yet. Explore today's available specialists to book your first consultation."}
          </p>
          <Button
            asChild
            className="mt-5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
          >
            <Link href="/available-today">Find Doctors Available Today</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDoctors.map((doc, idx) => {
            const latest = doc.latestAppointment;
            const statusUpper = latest.status?.toUpperCase();
            const isOnline = latest.type === "ONLINE";
            const canJoinCall =
              isOnline &&
              Boolean(latest.schedule?.meetingLink) &&
              (statusUpper === "CONFIRMED" || statusUpper === "ONGOING");

            return (
              <motion.div
                key={doc.doctorId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (idx % 6) * 0.04 }}
              >
                <Card className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border-slate-200/80 shadow-xs transition-all hover:border-emerald-500/40 hover:shadow-md">
                  <div>
                    <CardHeader className="border-b bg-slate-50/70 pb-4 dark:bg-slate-900/40">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-emerald-500/10 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400"
                        >
                          {doc.totalBookings}{" "}
                          {doc.totalBookings === 1 ? "Booking" : "Bookings"}
                        </Badge>

                        {getStatusBadge(latest.status)}
                      </div>

                      <CardTitle className="mt-2.5 text-lg font-extrabold">
                        <Link
                          href={`/doctors/${doc.doctorId}`}
                          className="hover:text-emerald-600"
                        >
                          {doc.doctorName}
                        </Link>
                      </CardTitle>

                      <CardDescription className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                        {doc.specialization}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3.5 pt-4 text-xs">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Latest Consultation Summary
                      </p>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="rounded-xl border bg-slate-50/70 p-2.5 dark:bg-slate-900/40">
                          <p className="text-[11px] text-muted-foreground">
                            Serial No.
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-sm font-extrabold text-foreground">
                            <Hash className="h-3.5 w-3.5 text-emerald-600" />
                            {latest.serialNumber ?? "Pending"}
                          </p>
                        </div>

                        <div className="rounded-xl border bg-slate-50/70 p-2.5 dark:bg-slate-900/40">
                          <p className="text-[11px] text-muted-foreground">
                            Visit Mode
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-sm font-bold text-foreground">
                            {isOnline ? (
                              <>
                                <Video className="h-3.5 w-3.5 text-emerald-600" />
                                Online
                              </>
                            ) : (
                              <>
                                <Building2 className="h-3.5 w-3.5 text-sky-600" />
                                In-Person
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {latest.schedule?.startDateTime && (
                        <div className="flex items-center justify-between rounded-xl border px-3 py-2">
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                            Date & Time
                          </span>
                          <span className="font-semibold text-foreground">
                            {format(
                              new Date(
                                latest.joiningTime ||
                                  latest.schedule.startDateTime,
                              ),
                              "dd MMM, hh:mm a",
                            )}
                          </span>
                        </div>
                      )}

                      {latest.payment && (
                        <div className="flex items-center justify-between rounded-xl border px-3 py-2">
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                            Fee Paid
                          </span>
                          <span className="font-bold text-foreground">
                            ৳{Number(latest.payment.amount).toLocaleString()} (
                            {latest.payment.status})
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </div>

                  <CardFooter className="flex flex-wrap items-center gap-2 border-t pt-4">
                    {canJoinCall && latest.schedule?.meetingLink && (
                      <Button
                        asChild
                        size="sm"
                        className="flex-1 gap-1.5 rounded-xl bg-sky-600 text-white hover:bg-sky-500"
                      >
                        <a
                          href={latest.schedule.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Video className="h-3.5 w-3.5" />
                          Join Video Call
                        </a>
                      </Button>
                    )}

                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1.5 rounded-xl"
                    >
                      <Link href={`/doctors/${doc.doctorId}`}>
                        Doctor Profile
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}