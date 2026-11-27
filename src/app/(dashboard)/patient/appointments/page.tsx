"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  CalendarCheck2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Video,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  cancelAppointmentApi,
  getMyAppointmentsApi,
  getSingleAppointmentApi,
  payPendingAppointmentApi,
  type IAppointmentRecord,
} from "@/lib/appointment.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function getStatusBadge(status: string) {
  const value = status?.toUpperCase();
  if (value === "COMPLETED") return <Badge className="bg-emerald-600">{value}</Badge>;
  if (value === "CONFIRMED") return <Badge className="bg-sky-600">{value}</Badge>;
  if (value === "ONGOING") return <Badge className="bg-amber-600">{value}</Badge>;
  if (value === "CANCELLED") return <Badge className="bg-rose-600">{value}</Badge>;
  return <Badge variant="secondary">{value || "PENDING"}</Badge>;
}

function PatientAppointmentsContent() {
  const searchParams = useSearchParams();
  const [appointments, setAppointments] = useState<IAppointmentRecord[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 9, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<IAppointmentRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("status") === "success") {
      toast.success("Payment verified. Your appointment is confirmed.");
    } else if (searchParams.get("status") === "cancel") {
      toast.warning("Payment was cancelled.");
    } else if (searchParams.get("error") || searchParams.get("status") === "failue") {
      toast.error("Payment could not be completed.");
    }
  }, [searchParams]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getMyAppointmentsApi({
        page,
        limit: 9,
        status: statusFilter || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
      setAppointments(result.appointments);
      setMeta(result.meta);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filteredAppointments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return appointments;
    return appointments.filter((item) =>
      [
        item.doctor?.name,
        item.doctor?.specialization,
        item.serialNumber ? String(item.serialNumber) : "",
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [appointments, searchQuery]);

  const payAppointment = async (appointmentId: string) => {
    setPayingId(appointmentId);
    try {
      const result = await payPendingAppointmentApi(appointmentId);
      if (!result.data?.paymentUrl) throw new Error("Payment URL was not returned");
      window.location.href = result.data.paymentUrl;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to start payment");
      setPayingId(null);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    setCancellingId(appointmentId);
    try {
      await cancelAppointmentApi(appointmentId);
      toast.success("Appointment cancelled");
      await fetchAppointments();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  const viewDetails = async (appointment: IAppointmentRecord) => {
    setSelected(appointment);
    setDetailsOpen(true);
    try {
      setSelected(await getSingleAppointmentApi(appointment.id));
    } catch {
      // Keep the row data if the details request fails.
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 rounded-3xl border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge className="mb-2 bg-emerald-600">Patient Appointments</Badge>
          <h1 className="text-2xl font-extrabold">My Appointments</h1>
          <p className="text-sm text-muted-foreground">View, pay, join, and cancel appointments.</p>
        </div>
        <Button variant="outline" onClick={fetchAppointments} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {["", "PENDING", "CONFIRMED", "ONGOING", "COMPLETED", "CANCELLED"].map((status) => (
            <Button
              key={status || "ALL"}
              size="sm"
              variant={statusFilter === status ? "default" : "outline"}
              onClick={() => { setStatusFilter(status); setPage(1); }}
            >
              {status || "All"}
            </Button>
          ))}
        </div>
        <div className="relative lg:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search doctor or serial..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-3xl border border-dashed text-center">
          <Calendar className="h-10 w-10 text-muted-foreground/40" />
          <h3 className="mt-3 font-bold">No appointments found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAppointments.map((item) => {
            const online = item.type === "ONLINE";
            const canPay = item.status === "PENDING" && item.payment?.status !== "PAID";
            const canCancel = !["COMPLETED", "CANCELLED"].includes(item.status);
            const canJoin = online && item.schedule?.meetingLink &&
              ["CONFIRMED", "ONGOING"].includes(item.status);
            const prescriptionUrl = (item as IAppointmentRecord & { prescriptionUrl?: string }).prescriptionUrl;

            return (
              <Card key={item.id} className="flex h-full flex-col">
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>{item.doctor?.name || "Doctor"}</CardTitle>
                    <p className="text-xs text-muted-foreground">{item.doctor?.specialization}</p>
                  </div>
                  {getStatusBadge(item.status)}
                </CardHeader>
                <CardContent className="flex-1 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span>{online ? "Online" : "In-person"}</span>
                  </div>
                  {item.schedule && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span>{format(new Date(item.schedule.startDateTime), "PPP p")}</span>
                    </div>
                  )}
                  {item.serialNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Serial</span>
                      <span>#{item.serialNumber}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  {canPay && (
                    <Button size="sm" onClick={() => payAppointment(item.id)} disabled={payingId === item.id}>
                      {payingId === item.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Pay
                    </Button>
                  )}
                  {canJoin && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={item.schedule?.meetingLink} target="_blank" rel="noreferrer">
                        <Video className="mr-2 h-4 w-4" />Join
                      </a>
                    </Button>
                  )}
                  {prescriptionUrl && (
                    <a
                      href={prescriptionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={`prescription-${item.id}.pdf`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                    >
                      Download Prescription (PDF)
                    </a>
                  )}
                  {canCancel && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => cancelAppointment(item.id)}
                      disabled={cancellingId === item.id}
                    >
                      {cancellingId === item.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                      Cancel
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => viewDetails(item)}>
                    <Eye className="mr-2 h-4 w-4" />Details
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="flex items-center px-3 text-sm">Page {page} of {meta.totalPages}</span>
          <Button size="sm" variant="outline" disabled={page >= meta.totalPages} onClick={() => setPage((value) => value + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>Booking and payment information</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Doctor</span><strong>{selected.doctor?.name}</strong></div>
              <div className="flex justify-between"><span>Status</span><strong>{selected.status}</strong></div>
              {selected.schedule && (
                <div className="flex justify-between"><span>Starts</span><strong>{format(new Date(selected.schedule.startDateTime), "PPP p")}</strong></div>
              )}
              {selected.payment && (
                <div className="flex justify-between"><span>Payment</span><strong>{selected.payment.status}</strong></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PatientAppointmentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      }
    >
      <PatientAppointmentsContent />
    </Suspense>
  );
}
