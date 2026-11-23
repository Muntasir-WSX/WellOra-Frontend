"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Building2,
  Calendar,
  CalendarCheck2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  ExternalLink,
  Eye,
  Hash,
  Loader2,
  Play,
  RefreshCw,
  Search,
  Stethoscope,
  User,
  Video,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  cancelAppointmentApi,
  getAllAppointmentsAdminApi,
  getDoctorAppointmentsApi,
  getMyAppointmentsApi,
  getSingleAppointmentApi,
  payPendingAppointmentApi,
  updateAppointmentStatusApi,
  type IAppointmentRecord,
} from "@/lib/appointment.api";
import { getMyProfile } from "@/lib/user.api";
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
import { Separator } from "@/components/ui/separator";

function getAppointmentStatusBadge(status: string) {
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

export default function AppointmentsPage() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<IAppointmentRecord[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Action states
  const [payingId, setPayingId] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [cancellingItem, setCancellingItem] =
    useState<IAppointmentRecord | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Details modal states
  const [selectedAppointment, setSelectedAppointment] =
    useState<IAppointmentRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const isDoctor = role === "DOCTOR";
  const isPatient = role === "PATIENT";

  // Handle bKash redirect feedback (?status=success / cancel / failue)
  useEffect(() => {
    const paymentStatus = searchParams.get("status");
    const paymentError = searchParams.get("error");

    if (paymentStatus === "success") {
      toast.success(
        "Payment verified! Your appointment is confirmed and invoice has been emailed.",
      );
    } else if (paymentStatus === "cancel") {
      toast.warning("bKash payment was cancelled. You can pay anytime while pending.");
    } else if (paymentStatus === "failue" || paymentError) {
      toast.error("Payment could not be completed. Please try again.");
    }
  }, [searchParams]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      let currentRole = role;
      if (!currentRole) {
        const profile = await getMyProfile();
        currentRole = profile.role;
        setRole(profile.role);
      }

      const query = {
        page,
        limit: 9,
        status: statusFilter || undefined,
        sortBy: "createdAt",
        sortOrder: "desc" as const,
      };

      if (currentRole === "ADMIN" || currentRole === "SUPER_ADMIN") {
        const res = await getAllAppointmentsAdminApi(query);
        setAppointments(res.appointments);
        setMeta(res.meta);
      } else if (currentRole === "DOCTOR") {
        const res = await getDoctorAppointmentsApi(query);
        setAppointments(res.appointments);
        setMeta(res.meta);
      } else {
        const res = await getMyAppointmentsApi(query);
        setAppointments(res.appointments);
        setMeta(res.meta);
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load appointments",
      );
    } finally {
      setLoading(false);
    }
  }, [page, role, statusFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handlePayPending = async (appointmentId: string) => {
    setPayingId(appointmentId);
    try {
      const res = await payPendingAppointmentApi(appointmentId);
      const url = res?.data?.paymentUrl;
      if (!url) {
        throw new Error("bKash payment gateway URL was not returned");
      }
      window.location.href = url;
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to initiate payment",
      );
      setPayingId(null);
    }
  };

  const handleStatusTransition = async (
    appointmentId: string,
    nextStatus: "ONGOING" | "COMPLETED",
  ) => {
    setUpdatingStatusId(appointmentId);
    try {
      await updateAppointmentStatusApi(appointmentId, nextStatus);
      toast.success(
        nextStatus === "ONGOING"
          ? "Consultation marked as Ongoing!"
          : "Consultation marked as Completed!",
      );
      fetchAppointments();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update appointment status",
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingItem) return;
    setCancelling(true);
    try {
      const res = await cancelAppointmentApi(cancellingItem.id);
      const refunded = res?.data?.payment?.status === "REFUNDED";
      toast.success(
        refunded
          ? "Appointment cancelled and bKash refund processed!"
          : "Appointment cancelled successfully.",
      );
      setCancellingItem(null);
      fetchAppointments();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to cancel appointment",
      );
    } finally {
      setCancelling(false);
    }
  };

  const handleOpenDetails = async (item: IAppointmentRecord) => {
    setSelectedAppointment(item);
    setDetailsOpen(true);
    setLoadingDetails(true);
    try {
      const fresh = await getSingleAppointmentApi(item.id);
      setSelectedAppointment(fresh);
    } catch {
      // Keep fallback row state
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return appointments;

    return appointments.filter((item) => {
      const docName = (item.doctor?.name || "").toLowerCase();
      const spec = (item.doctor?.specialization || "").toLowerCase();
      const patName = (item.patient?.name || "").toLowerCase();
      const patEmail = (item.patient?.email || "").toLowerCase();
      const id = item.id.toLowerCase();

      return (
        docName.includes(q) ||
        spec.includes(q) ||
        patName.includes(q) ||
        patEmail.includes(q) ||
        id.includes(q)
      );
    });
  }, [appointments, searchQuery]);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div className="space-y-1.5">
          <Badge
            variant="secondary"
            className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          >
            <CalendarCheck2 className="h-3.5 w-3.5 text-emerald-600" />
            {isAdmin
              ? "Hospital Appointment Registry"
              : isDoctor
                ? "Doctor Consultation Queue"
                : "Patient Consultation Portal"}
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {isAdmin
              ? "All Appointments"
              : isDoctor
                ? "Patient Appointments"
                : "My Appointments"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Monitor all booked consultations, serial queues, payments, and cancellations."
              : isDoctor
                ? "Manage your consultation queue: start ongoing sessions, join video calls, and mark visits completed."
                : "View your serial number, exact joining time, complete pending bKash payments, or join online consultations."}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fetchAppointments}
          disabled={loading}
          className="gap-1.5 self-start rounded-xl sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* 2. STATUS FILTER TABS & SEARCH */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "All", value: "" },
            { label: "Confirmed", value: "CONFIRMED" },
            { label: "Ongoing", value: "ONGOING" },
            { label: "Completed", value: "COMPLETED" },
            { label: "Pending", value: "PENDING" },
            { label: "Cancelled", value: "CANCELLED" },
          ].map((tab) => (
            <Button
              key={tab.value}
              type="button"
              size="sm"
              variant={statusFilter === tab.value ? "default" : "outline"}
              className="rounded-full"
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              isDoctor
                ? "Search patient name or email..."
                : "Search doctor, specialty, or patient..."
            }
            className="bg-background pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 3. APPOINTMENTS GRID */}
      {loading ? (
        <div className="flex h-64 items-center justify-center gap-2 rounded-3xl border border-dashed text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Loading appointments...</span>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center">
          <Calendar className="h-11 w-11 text-muted-foreground/40" />
          <h3 className="mt-3 text-base font-bold">No appointments found</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {statusFilter || searchQuery
              ? "No appointments match your active filter or search term."
              : "Booked appointments will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredAppointments.map((item, idx) => {
            const statusUpper = item.status?.toUpperCase();
            const isOnline = item.type === "ONLINE";
            const canJoinCall =
              isOnline &&
              Boolean(item.schedule?.meetingLink) &&
              (statusUpper === "CONFIRMED" || statusUpper === "ONGOING");

            const canCancel =
              (isPatient || isAdmin) &&
              (statusUpper === "PENDING" || statusUpper === "CONFIRMED");

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (idx % 6) * 0.04 }}
              >
                <Card className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border-slate-200/80 shadow-xs transition-all hover:border-emerald-500/40 hover:shadow-md">
                  <div>
                    <CardHeader className="border-b bg-slate-50/70 pb-4 dark:bg-slate-900/40">
                      <div className="flex items-center justify-between gap-2">
                        {getAppointmentStatusBadge(item.status)}

                        <Badge variant="outline" className="gap-1 text-[11px]">
                          {isOnline ? (
                            <Video className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Building2 className="h-3 w-3 text-sky-600" />
                          )}
                          {isOnline ? "Online" : "In-Person"}
                        </Badge>
                      </div>

                      {/* Primary Person Title (Doctor for Patient, Patient for Doctor) */}
                      <CardTitle className="mt-2.5 text-lg font-extrabold">
                        {isDoctor
                          ? item.patient?.name || "Patient"
                          : item.doctor?.name || "Specialist"}
                      </CardTitle>
                      <CardDescription className="text-xs font-medium">
                        {isDoctor
                          ? item.patient?.email || item.patient?.contactNumber
                          : item.doctor?.specialization}
                        {isAdmin && item.patient?.name && (
                          <span className="mt-0.5 block text-foreground">
                            Patient: {item.patient.name}
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3.5 pt-4 text-xs">
                      {/* Serial & Joining Time */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="rounded-xl border bg-slate-50/70 p-2.5 dark:bg-slate-900/40">
                          <p className="text-[11px] text-muted-foreground">
                            Serial No.
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-sm font-extrabold text-foreground">
                            <Hash className="h-3.5 w-3.5 text-emerald-600" />
                            {item.serialNumber ?? "Pending"}
                          </p>
                        </div>

                        <div className="rounded-xl border bg-slate-50/70 p-2.5 dark:bg-slate-900/40">
                          <p className="text-[11px] text-muted-foreground">
                            Joining Time
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-sm font-extrabold text-emerald-600">
                            <Clock className="h-3.5 w-3.5" />
                            {item.joiningTime
                              ? format(new Date(item.joiningTime), "hh:mm a")
                              : item.schedule?.startDateTime
                                ? format(
                                    new Date(item.schedule.startDateTime),
                                    "hh:mm a",
                                  )
                                : "—"}
                          </p>
                        </div>
                      </div>

                      {/* Schedule Date */}
                      {item.schedule?.startDateTime && (
                        <div className="flex items-center justify-between rounded-xl border px-3 py-2">
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                            Date
                          </span>
                          <span className="font-semibold text-foreground">
                            {format(
                              new Date(item.schedule.startDateTime),
                              "EEE, dd MMM yyyy",
                            )}
                          </span>
                        </div>
                      )}

                      {/* Payment Status Row */}
                      {item.payment && (
                        <div className="flex items-center justify-between rounded-xl border px-3 py-2">
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                            <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
                            Fee (৳{Number(item.payment.amount).toLocaleString()})
                          </span>
                          <Badge
                            variant="secondary"
                            className={
                              item.payment.status === "PAID"
                                ? "bg-emerald-500/15 text-emerald-700"
                                : item.payment.status === "REFUNDED"
                                  ? "bg-amber-500/15 text-amber-700"
                                  : "bg-slate-500/10"
                            }
                          >
                            {item.payment.status}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </div>

                  {/* ROLE-SPECIFIC WORKFLOW BUTTONS */}
                  <CardFooter className="flex flex-wrap items-center gap-2 border-t pt-4">
                    {/* Patient: Pay Pending Appointment */}
                    {isPatient && statusUpper === "PENDING" && (
                      <Button
                        type="button"
                        size="sm"
                        disabled={payingId === item.id}
                        onClick={() => handlePayPending(item.id)}
                        className="flex-1 gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        {payingId === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CreditCard className="h-3.5 w-3.5" />
                        )}
                        Pay Now
                      </Button>
                    )}

                    {/* Doctor: CONFIRMED -> ONGOING */}
                    {isDoctor && statusUpper === "CONFIRMED" && (
                      <Button
                        type="button"
                        size="sm"
                        disabled={updatingStatusId === item.id}
                        onClick={() =>
                          handleStatusTransition(item.id, "ONGOING")
                        }
                        className="flex-1 gap-1.5 rounded-xl bg-amber-600 text-white hover:bg-amber-500"
                      >
                        {updatingStatusId === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Play className="h-3.5 w-3.5" />
                        )}
                        Start Session
                      </Button>
                    )}

                    {/* Doctor: ONGOING -> COMPLETED */}
                    {isDoctor && statusUpper === "ONGOING" && (
                      <Button
                        type="button"
                        size="sm"
                        disabled={updatingStatusId === item.id}
                        onClick={() =>
                          handleStatusTransition(item.id, "COMPLETED")
                        }
                        className="flex-1 gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        {updatingStatusId === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Complete
                      </Button>
                    )}

                    {/* Join Online Consultation */}
                    {canJoinCall && item.schedule?.meetingLink && (
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="gap-1.5 rounded-xl bg-sky-500/15 text-sky-700 hover:bg-sky-500/25 dark:text-sky-300"
                      >
                        <a
                          href={item.schedule.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Video className="h-3.5 w-3.5" />
                          Join Call
                        </a>
                      </Button>
                    )}

                    {/* Details Button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetails(item)}
                      className="gap-1.5 rounded-xl"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Details
                    </Button>

                    {/* Patient / Admin Cancel Button */}
                    {canCancel && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCancellingItem(item)}
                        className="rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30"
                      >
                        Cancel
                      </Button>
                    )}
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

      {/* 5. APPOINTMENT DETAILS MODAL */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarCheck2 className="h-5 w-5 text-emerald-600" />
              Appointment Details
            </DialogTitle>
            <DialogDescription>
              Complete consultation schedule, serial, and payment summary.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4 pt-2 text-xs">
              {loadingDetails && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                  <span>Syncing latest status...</span>
                </div>
              )}

              <div className="flex items-center justify-between rounded-2xl border bg-slate-50/80 p-3.5 dark:bg-slate-900/50">
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Serial & Joining Time
                  </p>
                  <p className="mt-0.5 text-base font-extrabold text-foreground">
                    Serial #{selectedAppointment.serialNumber ?? "Pending"}
                    {selectedAppointment.joiningTime &&
                      ` • ${format(new Date(selectedAppointment.joiningTime), "hh:mm a")}`}
                  </p>
                </div>
                {getAppointmentStatusBadge(selectedAppointment.status)}
              </div>

              <div className="space-y-2.5 rounded-2xl border p-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Stethoscope className="h-3.5 w-3.5 text-emerald-600" />
                    Doctor
                  </span>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {selectedAppointment.doctor?.name || "N/A"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {selectedAppointment.doctor?.specialization}
                    </p>
                  </div>
                </div>

                {selectedAppointment.patient && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <User className="h-3.5 w-3.5 text-emerald-600" />
                      Patient
                    </span>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {selectedAppointment.patient.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {selectedAppointment.patient.email}
                      </p>
                    </div>
                  </div>
                )}

                {selectedAppointment.schedule && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Schedule Date
                      </span>
                      <span className="font-semibold text-foreground">
                        {format(
                          new Date(selectedAppointment.schedule.startDateTime),
                          "EEEE, dd MMM yyyy",
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Chamber Window
                      </span>
                      <span className="font-medium text-foreground">
                        {format(
                          new Date(selectedAppointment.schedule.startDateTime),
                          "hh:mm a",
                        )}{" "}
                        –{" "}
                        {format(
                          new Date(selectedAppointment.schedule.endDateTime),
                          "hh:mm a",
                        )}
                      </span>
                    </div>

                    {selectedAppointment.type === "ONLINE" &&
                      selectedAppointment.schedule.meetingLink && (
                        <div className="flex items-center justify-between gap-4 pt-1">
                          <span className="text-muted-foreground">
                            Meeting Link
                          </span>
                          <a
                            href={selectedAppointment.schedule.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:underline"
                          >
                            Open Video Room
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                  </>
                )}

                {selectedAppointment.payment && (
                  <>
                    <Separator className="my-2" />
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">
                        Consultation Fee
                      </span>
                      <span className="font-bold text-foreground">
                        ৳
                        {Number(
                          selectedAppointment.payment.amount,
                        ).toLocaleString()}{" "}
                        ({selectedAppointment.payment.status})
                      </span>
                    </div>
                    {selectedAppointment.payment.bkashTrxId && (
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">
                          bKash TrxID
                        </span>
                        <span className="font-mono font-semibold text-foreground">
                          {selectedAppointment.payment.bkashTrxId}
                        </span>
                      </div>
                    )}
                    {selectedAppointment.payment.refundTrxId && (
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">
                          Refund TrxID
                        </span>
                        <span className="font-mono font-semibold text-amber-600">
                          {selectedAppointment.payment.refundTrxId}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 6. CANCEL CONFIRMATION DIALOG */}
      <Dialog
        open={Boolean(cancellingItem)}
        onOpenChange={(open) => {
          if (!open) setCancellingItem(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
              Cancel Appointment?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? If you paid via
              bKash and cancel at least <strong>1 hour before</strong> the
              schedule starts, your consultation fee will be automatically
              refunded.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCancellingItem(null)}
              disabled={cancelling}
            >
              Keep Appointment
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={cancelling}
              className="gap-2"
            >
              {cancelling && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}