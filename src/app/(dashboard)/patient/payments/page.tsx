"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Banknote,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Eye,
  FileSpreadsheet,
  Loader2,
  Receipt,
  RefreshCw,
  RotateCcw,
  Search,
  Stethoscope,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  getAllPaymentsAdminApi,
  getDoctorPaymentsApi,
  getMyPaymentsApi,
  getSinglePaymentApi,
  type IPaymentRecord,
} from "@/lib/payment.api";
import { getMyProfile } from "@/lib/user.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function getStatusBadge(status: string) {
  const upper = status?.toUpperCase();
  if (upper === "PAID") {
    return (
      <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="h-3 w-3" />
        PAID
      </Badge>
    );
  }
  if (upper === "REFUNDED") {
    return (
      <Badge className="gap-1 border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400">
        <RotateCcw className="h-3 w-3" />
        REFUNDED
      </Badge>
    );
  }
  if (upper === "FAILED" || upper === "CANCELLED") {
    return (
      <Badge className="gap-1 border-rose-500/30 bg-rose-500/15 text-rose-700 dark:text-rose-400">
        <XCircle className="h-3 w-3" />
        {upper}
      </Badge>
    );
  }
  return (
    <Badge
      variant="secondary"
      className="gap-1 border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300"
    >
      <Clock className="h-3 w-3" />
      {upper || "UNPAID"}
    </Badge>
  );
}

export default function PaymentPage() {
  const [role, setRole] = useState<string | null>(null);
  const [payments, setPayments] = useState<IPaymentRecord[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Receipt Modal State
  const [selectedPayment, setSelectedPayment] = useState<IPaymentRecord | null>(
    null,
  );
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [loadingReceipt, setLoadingReceipt] = useState(false);

  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const isDoctor = role === "DOCTOR";

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      let currentRole = role;
      if (!currentRole) {
        const profile = await getMyProfile();
        currentRole = profile.role;
        setRole(profile.role);
      }

      if (currentRole === "ADMIN" || currentRole === "SUPER_ADMIN") {
        const res = await getAllPaymentsAdminApi({
          page,
          limit: 10,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        setPayments(res.payments);
        setMeta(res.meta);
      } else if (currentRole === "DOCTOR") {
        const res = await getDoctorPaymentsApi({
          page,
          limit: 10,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        setPayments(res.payments);
        setMeta(res.meta);
      } else {
        const res = await getMyPaymentsApi({
          page,
          limit: 10,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        setPayments(res.payments);
        setMeta(res.meta);
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load payment history",
      );
    } finally {
      setLoading(false);
    }
  }, [page, role]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleOpenReceipt = async (payment: IPaymentRecord) => {
    setSelectedPayment(payment);
    setReceiptOpen(true);
    setLoadingReceipt(true);
    try {
      const freshDetails = await getSinglePaymentApi(payment.id);
      setSelectedPayment(freshDetails);
    } catch {
      // Keep row data as fallback
    } finally {
      setLoadingReceipt(false);
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const matchesStatus =
        !statusFilter || item.status?.toUpperCase() === statusFilter;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesStatus;

      const txId = (item.transactionId || item.id || "").toLowerCase();
      const doctorName = (item.appointment?.doctor?.name || "").toLowerCase();
      const specialty = (
        item.appointment?.doctor?.specialization || ""
      ).toLowerCase();
      const patientName = (item.appointment?.patient?.name || "").toLowerCase();
      const patientEmail = (
        item.appointment?.patient?.email || ""
      ).toLowerCase();

      return (
        matchesStatus &&
        (txId.includes(q) ||
          doctorName.includes(q) ||
          specialty.includes(q) ||
          patientName.includes(q) ||
          patientEmail.includes(q))
      );
    });
  }, [payments, statusFilter, searchQuery]);

  const summary = useMemo(() => {
    let totalPaid = 0;
    let totalRefunded = 0;
    let paidCount = 0;

    for (const p of payments) {
      const amt = Number(p.amount) || 0;
      const st = p.status?.toUpperCase();
      if (st === "PAID") {
        totalPaid += amt;
        paidCount += 1;
      } else if (st === "REFUNDED") {
        totalRefunded += amt;
      }
    }

    return { totalPaid, totalRefunded, paidCount };
  }, [payments]);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div className="space-y-1.5">
          <Badge
            variant="secondary"
            className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          >
            <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
            {isAdmin
              ? "Platform Payment Ledger"
              : isDoctor
                ? "Consultation Earnings & Payouts"
                : "Billing & Receipts"}
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {isAdmin
              ? "All Transactions"
              : isDoctor
                ? "Consultation Payments"
                : "My Payment History"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Monitor all consultation payments, transaction IDs, and automated patient refunds."
              : isDoctor
                ? "View patient consultation payments, transaction receipts, and refunded bookings."
                : "Track your consultation payments, view digital receipts, and check refund status."}
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fetchPayments}
          disabled={loading}
          className="gap-1.5 self-start rounded-xl sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card className="rounded-2xl border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card to-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {isAdmin
                ? "Total Collected (Page)"
                : isDoctor
                  ? "Total Earned (Page)"
                  : "Total Paid"}
            </CardTitle>
            <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-600">
              <Banknote className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-600">
              ৳{summary.totalPaid.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Across {summary.paidCount} successful transactions
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Refunded
            </CardTitle>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600">
              <RotateCcw className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              ৳{summary.totalRefunded.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Automated cancellation refunds
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Records
            </CardTitle>
            <div className="rounded-xl bg-sky-500/10 p-2 text-sky-600">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {meta.total}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              All recorded payment entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. FILTER & SEARCH BAR */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "All", value: "" },
            { label: "Paid", value: "PAID" },
            { label: "Unpaid", value: "UNPAID" },
            { label: "Refunded", value: "REFUNDED" },
          ].map((tab) => (
            <Button
              key={tab.value}
              type="button"
              size="sm"
              variant={statusFilter === tab.value ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setStatusFilter(tab.value)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              isAdmin
                ? "Search transaction ID, doctor, patient..."
                : isDoctor
                  ? "Search transaction ID or patient..."
                  : "Search transaction ID or doctor..."
            }
            className="bg-background pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 4. PAYMENTS TABLE */}
      <Card className="overflow-hidden rounded-3xl border-slate-200/80 shadow-xs">
        <CardHeader className="border-b bg-slate-50/70 pb-4 dark:bg-slate-900/40">
          <CardTitle className="text-base">Transaction Records</CardTitle>
          <CardDescription>
            Click on any receipt to view full appointment and transaction
            details.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span>Loading payment records...</span>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center p-8 text-center">
              <Receipt className="h-10 w-10 text-muted-foreground/40" />
              <h3 className="mt-3 text-base font-bold">No payments found</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {searchQuery || statusFilter
                  ? "No transactions match your current filter or search keywords."
                  : "Consultation payment records will appear here once transactions occur."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">
                      Transaction ID
                    </th>
                    {!isDoctor && (
                      <th className="px-6 py-3.5 font-semibold">Specialist</th>
                    )}
                    {(isAdmin || isDoctor) && (
                      <th className="px-6 py-3.5 font-semibold">Patient</th>
                    )}
                    <th className="px-6 py-3.5 font-semibold">
                      Schedule Date
                    </th>
                    <th className="px-6 py-3.5 font-semibold">Amount</th>
                    <th className="px-6 py-3.5 font-semibold">Status</th>
                    <th className="px-6 py-3.5 text-right font-semibold">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPayments.map((payment, idx) => {
                    const txDisplay =
                      payment.transactionId ||
                      `TXN-${payment.id.slice(0, 8).toUpperCase()}`;
                    const doctor = payment.appointment?.doctor;
                    const patient = payment.appointment?.patient;
                    const scheduleStart =
                      payment.appointment?.schedule?.startDateTime;

                    return (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-foreground">
                          {txDisplay}
                          <div className="mt-0.5 font-sans text-[11px] font-normal text-muted-foreground">
                            {format(
                              new Date(payment.createdAt),
                              "dd MMM yyyy, hh:mm a",
                            )}
                          </div>
                        </td>

                        {!isDoctor && (
                          <td className="px-6 py-4">
                            <div className="font-semibold text-foreground">
                              {doctor?.name || "Specialist"}
                            </div>
                            {doctor?.specialization && (
                              <div className="text-xs text-muted-foreground">
                                {doctor.specialization}
                              </div>
                            )}
                          </td>
                        )}

                        {(isAdmin || isDoctor) && (
                          <td className="px-6 py-4">
                            <div className="font-medium text-foreground">
                              {patient?.name || "Patient"}
                            </div>
                            {patient?.email && (
                              <div className="text-xs text-muted-foreground">
                                {patient.email}
                              </div>
                            )}
                          </td>
                        )}

                        <td className="px-6 py-4 text-xs text-muted-foreground">
                          {scheduleStart ? (
                            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                              {format(
                                new Date(scheduleStart),
                                "dd MMM yyyy, hh:mm a",
                              )}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td className="px-6 py-4 font-extrabold text-foreground">
                          ৳{Number(payment.amount).toLocaleString()}
                        </td>

                        <td className="px-6 py-4">
                          {getStatusBadge(payment.status)}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenReceipt(payment)}
                            className="gap-1.5 rounded-xl"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Details
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. PAGINATION */}
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

      {/* 6. SINGLE PAYMENT RECEIPT MODAL */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-emerald-600" />
              Payment Receipt
            </DialogTitle>
            <DialogDescription>
              Official WellOra consultation payment summary.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4 pt-2 text-sm">
              {loadingReceipt && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                  <span>Verifying latest transaction details...</span>
                </div>
              )}

              <div className="flex items-center justify-between rounded-2xl border bg-slate-50/80 p-4 dark:bg-slate-900/50">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="mt-0.5 text-2xl font-extrabold text-emerald-600">
                    ৳{Number(selectedPayment.amount).toLocaleString()}
                  </p>
                </div>
                {getStatusBadge(selectedPayment.status)}
              </div>

              <div className="space-y-2.5 rounded-2xl border p-4 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono font-semibold text-foreground">
                    {selectedPayment.transactionId || selectedPayment.id}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Payment Date</span>
                  <span className="font-medium text-foreground">
                    {format(
                      new Date(selectedPayment.createdAt),
                      "dd MMM yyyy, hh:mm a",
                    )}
                  </span>
                </div>

                <Separator className="my-2" />

                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                    <Stethoscope className="h-3.5 w-3.5 text-emerald-600" />
                    Doctor
                  </span>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {selectedPayment.appointment?.doctor?.name || "N/A"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {selectedPayment.appointment?.doctor?.specialization}
                    </p>
                  </div>
                </div>

                {selectedPayment.appointment?.patient && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <User className="h-3.5 w-3.5 text-emerald-600" />
                      Patient
                    </span>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {selectedPayment.appointment.patient.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {selectedPayment.appointment.patient.email}
                      </p>
                    </div>
                  </div>
                )}

                {selectedPayment.appointment?.schedule && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                      Consultation Slot
                    </span>
                    <div className="text-right font-medium text-foreground">
                      <p>
                        {format(
                          new Date(
                            selectedPayment.appointment.schedule.startDateTime,
                          ),
                          "EEE, dd MMM yyyy",
                        )}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {format(
                          new Date(
                            selectedPayment.appointment.schedule.startDateTime,
                          ),
                          "hh:mm a",
                        )}{" "}
                        –{" "}
                        {format(
                          new Date(
                            selectedPayment.appointment.schedule.endDateTime,
                          ),
                          "hh:mm a",
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}