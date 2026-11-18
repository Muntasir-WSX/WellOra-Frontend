"use client";

import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  Eye,
  FileText,
  Hash,
  Loader2,
  Receipt,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Stethoscope,
  User,
  Wallet,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  getAllPayments,
  getSinglePayment,
  PaymentItem,
  PaymentMeta,
  PaymentStatus,
} from "@/lib/payments";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUS_CONFIG: Record<
  PaymentStatus,
  {
    label: string;
    badgeClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  PAID: {
    label: "Paid",
    badgeClass:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-400",
    icon: CheckCircle2,
  },
  REFUNDED: {
    label: "Refunded",
    badgeClass:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-400",
    icon: RotateCcw,
  },
  PENDING: {
    label: "Pending",
    badgeClass:
      "border-slate-500/30 bg-slate-500/10 text-slate-700 hover:bg-slate-500/15 dark:text-slate-300",
    icon: Clock,
  },
  FAILED: {
    label: "Failed",
    badgeClass:
      "border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 dark:text-rose-400",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass:
      "border-rose-500/30 bg-rose-500/10 text-rose-700 hover:bg-rose-500/15 dark:text-rose-400",
    icon: XCircle,
  },
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [meta, setMeta] = useState<PaymentMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [patientEmail, setPatientEmail] = useState<string>("");
  const [debouncedEmail, setDebouncedEmail] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Details Modal
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmail(patientEmail.trim());
      setPage(1);
    }, 450);
    return () => clearTimeout(timer);
  }, [patientEmail]);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAllPayments({
        page,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
        patientEmail: debouncedEmail || undefined,
        status: statusFilter,
      });

      setPayments(result.data);
      setMeta(result.meta);
    } catch (error: any) {
      toast.error(error?.message || "Could not fetch payment records");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedEmail, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleViewDetails = async (item: PaymentItem) => {
    setSelectedPayment(item);
    setDetailsOpen(true);
    setDetailsLoading(true);

    try {
      const fullPayment = await getSinglePayment(item.id);
      setSelectedPayment(fullPayment);
    } catch {
      // Keep row fallback data if detail fetch fails
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCopy = (text?: string | null) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedText(null), 2000);
  };

  const renderStatusBadge = (status: PaymentStatus) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`gap-1 font-medium ${config.badgeClass}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Financial Summary (Current Page)
  const paidItems = payments.filter((p) => p.status === "PAID");
  const refundedItems = payments.filter((p) => p.status === "REFUNDED");

  const paidVolume = paidItems.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0,
  );
  const refundedVolume = refundedItems.reduce(
    (sum, p) => sum + Number(p.refundAmount || p.amount || 0),
    0,
  );
  const netVolume = Math.max(0, paidVolume - refundedVolume);

  return (
    <div className="space-y-6 p-6">
      {/* Top Banner Header */}
      <div className="flex flex-col gap-4 rounded-xl border bg-gradient-to-r from-card via-card to-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Payments & Financial Ledger
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor bKash tokenized checkouts, verify transaction IDs, and
            inspect refund settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(patientEmail || statusFilter !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPatientEmail("");
                setStatusFilter("ALL");
                setPage(1);
              }}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Clear Filters
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPayments}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Sync Ledger
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Records
            </CardTitle>
            <div className="rounded-md bg-primary/10 p-1.5 text-primary">
              <Receipt className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.total}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Showing {payments.length} on page {meta.page}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Gross Collected
            </CardTitle>
            <div className="rounded-md bg-emerald-500/10 p-1.5 text-emerald-600">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ৳{paidVolume.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {paidItems.length} settled transactions (page)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Refunded
            </CardTitle>
            <div className="rounded-md bg-amber-500/10 p-1.5 text-amber-600">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              ৳{refundedVolume.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {refundedItems.length} reversed payments (page)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-pink-600">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Net Page Settlement
            </CardTitle>
            <div className="rounded-md bg-pink-600/10 p-1.5 text-pink-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{netVolume.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Gateway: bKash Checkout (BDT)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Ledger Card */}
      <Card>
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg">Transaction History</CardTitle>
              <CardDescription>
                Filter settlements by status or look up a patient&apos;s exact
                email address.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Filter by patient email..."
                  className="bg-background pl-9"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                />
              </div>

              <Tabs
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
              >
                <TabsList className="h-auto flex-wrap">
                  <TabsTrigger value="ALL">All</TabsTrigger>
                  <TabsTrigger value="PAID">Paid</TabsTrigger>
                  <TabsTrigger value="PENDING">Pending</TabsTrigger>
                  <TabsTrigger value="REFUNDED">Refunded</TabsTrigger>
                  <TabsTrigger value="FAILED">Failed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="pl-6">Patient / Payer</TableHead>
                  <TableHead>Consultation</TableHead>
                  <TableHead>bKash TrxID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="pr-6 text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-44 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <span className="text-sm">
                          Fetching payment ledger...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-44 text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                        <Receipt className="h-8 w-8 opacity-40" />
                        <p className="text-sm font-medium text-foreground">
                          No payment records found
                        </p>
                        <p className="text-xs">
                          Try adjusting your status tab or email filter.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => {
                    const patientName =
                      payment.appointment?.patient?.name ||
                      payment.payerReference ||
                      "Patient";
                    const patientSub =
                      payment.appointment?.patient?.email ||
                      payment.payerReference ||
                      "No email attached";

                    return (
                      <TableRow
                        key={payment.id}
                        className="group transition-colors hover:bg-muted/30"
                      >
                        {/* Payer */}
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 border">
                              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                {patientName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {patientName}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {patientSub}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Doctor & Session */}
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {payment.appointment?.doctor?.name ||
                                "Medical Appointment"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {payment.appointment?.doctor?.specialization ||
                                (payment.appointment?.schedule?.startDateTime
                                  ? format(
                                      new Date(
                                        payment.appointment.schedule.startDateTime,
                                      ),
                                      "dd MMM yyyy",
                                    )
                                  : "Standard Consultation")}
                            </p>
                          </div>
                        </TableCell>

                        {/* bKash TrxID */}
                        <TableCell>
                          {payment.bkashTrxId ? (
                            <div className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-0.5">
                              <span className="font-mono text-xs font-medium">
                                {payment.bkashTrxId}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => handleCopy(payment.bkashTrxId)}
                              >
                                {copiedText === payment.bkashTrxId ? (
                                  <Check className="h-3 w-3 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3 w-3 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs italic text-muted-foreground">
                              Awaiting TrxID
                            </span>
                          )}
                        </TableCell>

                        {/* Amount */}
                        <TableCell>
                          <div className="font-semibold tabular-nums">
                            ৳{Number(payment.amount).toLocaleString()}
                          </div>
                          {payment.status === "REFUNDED" &&
                            payment.refundAmount && (
                              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                                -৳{Number(payment.refundAmount).toLocaleString()} refunded
                              </span>
                            )}
                        </TableCell>

                        {/* Status */}
                        <TableCell>{renderStatusBadge(payment.status)}</TableCell>

                        {/* Timestamp */}
                        <TableCell className="text-xs text-muted-foreground">
                          <div className="font-medium text-foreground/80">
                            {format(
                              new Date(payment.paidAt || payment.createdAt),
                              "dd MMM yyyy",
                            )}
                          </div>
                          <div>
                            {format(
                              new Date(payment.paidAt || payment.createdAt),
                              "hh:mm a",
                            )}
                          </div>
                        </TableCell>

                        {/* Action */}
                        <TableCell className="pr-6 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 border border-transparent hover:border-border hover:bg-background"
                            onClick={() => handleViewDetails(payment)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Receipt
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          {meta.totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t px-6 py-4 sm:flex-row">
              <p className="text-xs text-muted-foreground">
                Showing page <span className="font-semibold text-foreground">{meta.page}</span> of{" "}
                <span className="font-semibold text-foreground">{meta.totalPages}</span> ({meta.total} total records)
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

      {/* Receipt & Gateway Inspection Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Payment Audit Receipt</span>
              {detailsLoading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </DialogTitle>
            <DialogDescription>
              Verified gateway settlement record, invoice reference, and
              consultation metadata.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4">
              {/* Top Receipt Summary Strip */}
              <div className="flex flex-col justify-between gap-3 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Settlement Amount
                  </p>
                  <p className="mt-0.5 text-3xl font-bold tracking-tight">
                    ৳{Number(selectedPayment.amount).toLocaleString()}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      BDT
                    </span>
                  </p>
                </div>

                <div className="flex flex-col items-start gap-1.5 sm:items-end">
                  {renderStatusBadge(selectedPayment.status)}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(
                      new Date(
                        selectedPayment.paidAt || selectedPayment.createdAt,
                      ),
                      "dd MMM yyyy, hh:mm a",
                    )}
                  </span>
                </div>
              </div>

              {/* Gateway Identifiers */}
              <div className="grid gap-3 rounded-xl border p-4 text-sm sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    Merchant Invoice Number
                  </span>
                  <div className="flex items-center gap-1.5">
                    <code className="truncate rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                      {selectedPayment.merchantInvoiceNumber}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() =>
                        handleCopy(selectedPayment.merchantInvoiceNumber)
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Receipt className="h-3 w-3" />
                    bKash Transaction ID
                  </span>
                  <div className="flex items-center gap-1.5">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                      {selectedPayment.bkashTrxId || "Not settled"}
                    </code>
                    {selectedPayment.bkashTrxId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={() => handleCopy(selectedPayment.bkashTrxId)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">
                    bKash Payment ID
                  </span>
                  <span className="font-mono text-xs break-all">
                    {selectedPayment.bkashPaymentId || "N/A"}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground block">
                    Payer Reference
                  </span>
                  <span className="text-xs font-medium">
                    {selectedPayment.payerReference || "N/A"}
                  </span>
                </div>
              </div>

              {/* Refund Block */}
              {selectedPayment.status === "REFUNDED" && (
                <div className="space-y-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
                    <RotateCcw className="h-4 w-4" />
                    Refund Settlement Trail
                  </div>
                  <div className="grid gap-3 text-xs sm:grid-cols-2">
                    <div>
                      <span className="block text-muted-foreground">
                        Refund TrxID
                      </span>
                      <span className="font-mono font-medium">
                        {selectedPayment.refundTrxId || "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-muted-foreground">
                        Refunded Amount
                      </span>
                      <span className="font-semibold">
                        ৳
                        {Number(
                          selectedPayment.refundAmount || selectedPayment.amount,
                        ).toLocaleString()}{" "}
                        BDT
                      </span>
                    </div>
                    {selectedPayment.refundReason && (
                      <div className="sm:col-span-2">
                        <span className="block text-muted-foreground">
                          Refund Reason
                        </span>
                        <p className="mt-0.5 rounded bg-background/60 p-2">
                          {selectedPayment.refundReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Patient & Doctor Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1 rounded-xl border p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <User className="h-3.5 w-3.5 text-primary" />
                    Patient Information
                  </div>
                  <p className="text-sm font-semibold">
                    {selectedPayment.appointment?.patient?.name ||
                      selectedPayment.payerReference ||
                      "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedPayment.appointment?.patient?.email ||
                      "No email recorded"}
                  </p>
                </div>

                <div className="space-y-1 rounded-xl border p-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Stethoscope className="h-3.5 w-3.5 text-primary" />
                    Doctor Information
                  </div>
                  <p className="text-sm font-semibold">
                    {selectedPayment.appointment?.doctor?.name || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedPayment.appointment?.doctor?.specialization ||
                      "Specialist"}
                  </p>
                </div>
              </div>

              {/* Raw Gateway JSON */}
              {selectedPayment.gatewayResponse && (
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5" />
                    Raw Gateway Response
                  </p>
                  <pre className="max-h-36 overflow-auto rounded-xl border bg-muted/40 p-3 font-mono text-[11px]">
                    {JSON.stringify(selectedPayment.gatewayResponse, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}