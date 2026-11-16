"use client";

import React, { useCallback, useEffect, useState } from "react";
import { format, isBefore, subHours } from "date-fns";
import {
  Ban,
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  Eye,
  Filter,
  Loader2,
  Mail,
  RotateCcw,
  Search,
  Stethoscope,
  User,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Hash,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";

type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";

interface AppointmentItem {
  id: string;
  type: "ONLINE" | "IN_PERSON";
  status: AppointmentStatus;
  serialNumber?: number | null;
  joiningTime?: string | null;
  createdAt: string;
  patient: {
    id: string;
    name: string;
    email: string;
  };
  doctor: {
    id: string;
    name: string;
    specialization?: string;
  };
  schedule?: {
    id: string;
    startDateTime: string;
    endDateTime: string;
    meetingLink?: string | null;
  };
  payment?: {
    id: string;
    amount: string | number;
    status: PaymentStatus;
    bkashTrxId?: string | null;
    paidAt?: string | null;
    refundTrxId?: string | null;
    refundAmount?: string | number | null;
    refundedAt?: string | null;
  } | null;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const getAuthHeaders = (): HeadersInit => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || localStorage.getItem("token")
      : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [doctorEmail, setDoctorEmail] = useState<string>("");
  const [debouncedPatientEmail, setDebouncedPatientEmail] =
    useState<string>("");
  const [debouncedDoctorEmail, setDebouncedDoctorEmail] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // Details Modal
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  // Cancel Confirmation Dialog
  const [cancelTarget, setCancelTarget] = useState<AppointmentItem | null>(
    null,
  );
  const [cancelling, setCancelling] = useState<boolean>(false);

  // Debounce email filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPatientEmail(patientEmail.trim());
      setDebouncedDoctorEmail(doctorEmail.trim());
      setPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [patientEmail, doctorEmail]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (statusFilter !== "ALL") {
        params.append("status", statusFilter);
      }
      if (debouncedPatientEmail) {
        params.append("patientEmail", debouncedPatientEmail);
      }
      if (debouncedDoctorEmail) {
        params.append("doctorEmail", debouncedDoctorEmail);
      }

      const res = await fetch(
        `${API_BASE_URL}/appointment/all-appointments?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
          headers: getAuthHeaders(),
        },
      );

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to load appointments");
      }

      setAppointments(json.data || []);
      if (json.meta) {
        setMeta(json.meta);
      }
    } catch (error: any) {
      toast.error(error?.message || "Could not fetch appointments");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, debouncedPatientEmail, debouncedDoctorEmail]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleViewDetails = async (item: AppointmentItem) => {
    setSelectedAppointment(item);
    setDetailsOpen(true);
    setDetailsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/appointment/${item.id}`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setSelectedAppointment(json.data);
      }
    } catch {
      // Keep row fallback
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/appointment/cancel-appointment`,
        {
          method: "POST",
          credentials: "include",
          headers: getAuthHeaders(),
          body: JSON.stringify({ appointmentId: cancelTarget.id }),
        },
      );

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to cancel appointment");
      }

      toast.success(
        json.message || "Appointment cancelled successfully",
      );
      setCancelTarget(null);
      setDetailsOpen(false);
      fetchAppointments();
    } catch (error: any) {
      toast.error(error?.message || "Could not cancel appointment");
    } finally {
      setCancelling(false);
    }
  };

  const renderStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/20 dark:text-emerald-400">
            Confirmed
          </Badge>
        );
      case "ONGOING":
        return (
          <Badge className="bg-blue-600/15 text-blue-700 hover:bg-blue-600/20 dark:text-blue-400">
            Ongoing
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-purple-600/15 text-purple-700 hover:bg-purple-600/20 dark:text-purple-400">
            Completed
          </Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const renderPaymentBadge = (status?: PaymentStatus) => {
    if (!status) return <Badge variant="outline">Unpaid</Badge>;
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/20 dark:text-emerald-400">
            Paid
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge className="bg-amber-600/15 text-amber-700 hover:bg-amber-600/20 dark:text-amber-400">
            Refunded
          </Badge>
        );
      case "FAILED":
      case "CANCELLED":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const canCancel = (status: AppointmentStatus) =>
    status === "PENDING" || status === "CONFIRMED";

  const isRefundEligible = (item: AppointmentItem | null) => {
    if (!item?.schedule?.startDateTime || item.payment?.status !== "PAID") {
      return false;
    }
    const cutoff = subHours(new Date(item.schedule.startDateTime), 1);
    return isBefore(new Date(), cutoff);
  };

  // Current page summary metrics
  const confirmedCount = appointments.filter(
    (a) => a.status === "CONFIRMED" || a.status === "ONGOING",
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "COMPLETED",
  ).length;
  const cancelledCount = appointments.filter(
    (a) => a.status === "CANCELLED",
  ).length;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            Track patient consultations, serial queues, payment verification,
            and cancellations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(patientEmail || doctorEmail || statusFilter !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPatientEmail("");
                setDoctorEmail("");
                setStatusFilter("ALL");
                setPage(1);
              }}
            >
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Reset Filters
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAppointments}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Filter className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Appointments
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.total}</div>
            <p className="text-xs text-muted-foreground">
              All booked & pending sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active / Confirmed
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedCount}</div>
            <p className="text-xs text-muted-foreground">
              Confirmed or ongoing (this page)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <Stethoscope className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">
              Finished consultations (this page)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cancelled
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cancelledCount}</div>
            <p className="text-xs text-muted-foreground">
              Cancelled bookings (this page)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Appointment Records</CardTitle>
              <CardDescription>
                Filter by status or search using exact patient/doctor email.
              </CardDescription>
            </div>

            <Tabs
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="ALL">All</TabsTrigger>
                <TabsTrigger value="PENDING">Pending</TabsTrigger>
                <TabsTrigger value="CONFIRMED">Confirmed</TabsTrigger>
                <TabsTrigger value="ONGOING">Ongoing</TabsTrigger>
                <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
                <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Exact Email Search Inputs */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Filter by patient email (e.g. patient@gmail.com)..."
                className="pl-9"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Filter by doctor email (e.g. doctor@wellora.com)..."
                className="pl-9"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Schedule & Serial</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-40 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading appointments...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : appointments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-40 text-center text-muted-foreground"
                    >
                      No appointments found matching your filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((apt) => (
                    <TableRow key={apt.id}>
                      {/* Patient */}
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {apt.patient?.name || "Unknown Patient"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {apt.patient?.email}
                          </p>
                        </div>
                      </TableCell>

                      {/* Doctor */}
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {apt.doctor?.name || "Unknown Doctor"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {apt.doctor?.specialization || "Specialist"}
                          </p>
                        </div>
                      </TableCell>

                      {/* Schedule & Serial */}
                      <TableCell>
                        {apt.schedule ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm font-medium">
                              <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              {format(
                                new Date(apt.schedule.startDateTime),
                                "dd MMM yyyy",
                              )}
                              {apt.serialNumber && (
                                <Badge
                                  variant="outline"
                                  className="ml-1 px-1.5 py-0 text-[11px]"
                                >
                                  #{apt.serialNumber}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {apt.joiningTime
                                ? `Join: ${format(new Date(apt.joiningTime), "hh:mm a")}`
                                : `${format(new Date(apt.schedule.startDateTime), "hh:mm a")} – ${format(new Date(apt.schedule.endDateTime), "hh:mm a")}`}
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            N/A
                          </span>
                        )}
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {apt.type === "ONLINE" ? "Online" : "In-Person"}
                        </Badge>
                      </TableCell>

                      {/* Payment */}
                      <TableCell>
                        <div className="space-y-1">
                          {renderPaymentBadge(apt.payment?.status)}
                          {apt.payment?.amount && (
                            <p className="text-xs font-medium text-muted-foreground">
                              {apt.payment.amount} BDT
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>{renderStatusBadge(apt.status)}</TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(apt)}
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            View
                          </Button>
                          {canCancel(apt.status) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setCancelTarget(apt)}
                            >
                              <Ban className="mr-1.5 h-3.5 w-3.5" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page <span className="font-medium">{meta.page}</span> of{" "}
                <span className="font-medium">{meta.totalPages}</span> (
                {meta.total} total)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Appointment Details</span>
              {detailsLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </DialogTitle>
            <DialogDescription>
              Complete consultation, queue serial, and bKash transaction
              summary.
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              {/* Top Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Hash className="h-3.5 w-3.5" />
                  <span className="font-mono">{selectedAppointment.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedAppointment.type}</Badge>
                  {renderStatusBadge(selectedAppointment.status)}
                </div>
              </div>

              {/* Patient & Doctor Info */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    Patient Information
                  </div>
                  <p className="font-semibold">
                    {selectedAppointment.patient?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedAppointment.patient?.email}
                  </p>
                </div>

                <div className="rounded-md border p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Stethoscope className="h-3.5 w-3.5" />
                    Doctor Information
                  </div>
                  <p className="font-semibold">
                    {selectedAppointment.doctor?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedAppointment.doctor?.specialization || "Specialist"}
                  </p>
                </div>
              </div>

              {/* Schedule Info */}
              {selectedAppointment.schedule && (
                <div className="rounded-md border p-3.5 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Schedule & Queue Assignment
                  </p>
                  <div className="grid gap-2 text-sm sm:grid-cols-3">
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Date
                      </span>
                      <span className="font-medium">
                        {format(
                          new Date(selectedAppointment.schedule.startDateTime),
                          "dd MMM yyyy",
                        )}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Joining Time
                      </span>
                      <span className="font-medium">
                        {selectedAppointment.joiningTime
                          ? format(
                              new Date(selectedAppointment.joiningTime),
                              "hh:mm a",
                            )
                          : `${format(new Date(selectedAppointment.schedule.startDateTime), "hh:mm a")} – ${format(new Date(selectedAppointment.schedule.endDateTime), "hh:mm a")}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Serial Number
                      </span>
                      <span className="font-medium">
                        {selectedAppointment.serialNumber
                          ? `#${selectedAppointment.serialNumber}`
                          : "Assigned after payment"}
                      </span>
                    </div>
                  </div>

                  {selectedAppointment.schedule.meetingLink && (
                    <div className="pt-1">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={selectedAppointment.schedule.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Video className="mr-1.5 h-3.5 w-3.5 text-primary" />
                          Open Consultation Room
                          <ExternalLink className="ml-1.5 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <Separator />

              {/* Payment & Refund Details */}
              <div className="rounded-md border p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" />
                    Payment & Refund Details
                  </div>
                  {renderPaymentBadge(selectedAppointment.payment?.status)}
                </div>

                {selectedAppointment.payment ? (
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Consultation Fee
                      </span>
                      <span className="font-semibold">
                        {selectedAppointment.payment.amount} BDT
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        bKash Transaction ID
                      </span>
                      <span className="font-mono text-xs">
                        {selectedAppointment.payment.bkashTrxId || "N/A"}
                      </span>
                    </div>
                    {selectedAppointment.payment.paidAt && (
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Paid At
                        </span>
                        <span className="text-xs">
                          {format(
                            new Date(selectedAppointment.payment.paidAt),
                            "dd MMM yyyy, hh:mm a",
                          )}
                        </span>
                      </div>
                    )}
                    {selectedAppointment.payment.refundTrxId && (
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Refund TrxID ({selectedAppointment.payment.refundAmount}{" "}
                          BDT)
                        </span>
                        <span className="font-mono text-xs text-amber-600">
                          {selectedAppointment.payment.refundTrxId}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No payment record found for this appointment.
                  </p>
                )}
              </div>

              {canCancel(selectedAppointment.status) && (
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={() => setCancelTarget(selectedAppointment)}
                  >
                    <Ban className="mr-1.5 h-4 w-4" />
                    Cancel Appointment
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel & Refund Confirmation Dialog */}
      <AlertDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Cancel This Appointment?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                You are about to cancel{" "}
                <strong>{cancelTarget?.patient?.name}</strong>&apos;s
                appointment with <strong>{cancelTarget?.doctor?.name}</strong>.
              </span>
              {cancelTarget?.payment?.status === "PAID" && (
                <span className="block rounded-md bg-muted p-2.5 text-xs text-foreground">
                  {isRefundEligible(cancelTarget)
                    ? "Eligible for full bKash refund (cancelled more than 1 hour before schedule start) and the slot will be released."
                    : "Note: Less than 1 hour remains before schedule start—per policy, bKash refund will not be triggered automatically."}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Keep</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleCancelAppointment();
              }}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}