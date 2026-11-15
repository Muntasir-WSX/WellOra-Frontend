"use client";

import React, { useEffect, useState } from "react";
import {
  Stethoscope,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  MailCheck,
  MailWarning,
  Award,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getAllDoctorsAdminApi,
  reviewDoctorApplicationApi,
  IDoctorApplication,
  DoctorVerificationStatus,
} from "@/lib/doctor.api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type StatusFilter = "ALL" | DoctorVerificationStatus;

export default function AdminDoctorApplicationsPage() {
  const [doctors, setDoctors] = useState<IDoctorApplication[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("PENDING");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Inspect / Review Modal State
  const [selectedDoctor, setSelectedDoctor] =
    useState<IDoctorApplication | null>(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllDoctorsAdminApi({
        page,
        limit: 10,
        searchTerm,
        verificationStatus: statusFilter === "ALL" ? "" : statusFilter,
      });
      setDoctors(res.doctors);
      setMeta(res.meta);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load doctor applications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [page, statusFilter, searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearchTerm(searchInput);
  };

  const openReviewModal = (
    doctor: IDoctorApplication,
    startInRejectMode = false
  ) => {
    setSelectedDoctor(doctor);
    setRejectMode(startInRejectMode);
    setRejectionReason("");
    setModalError("");
  };

  const handleReviewDecision = async (decision: "APPROVED" | "REJECTED") => {
    if (!selectedDoctor) return;
    setModalError("");
    setSuccessMsg("");

    if (decision === "REJECTED" && rejectionReason.trim().length < 5) {
      setModalError(
        "Please provide a clear rejection reason (at least 5 characters)."
      );
      return;
    }

    try {
      setActionLoading(true);
      await reviewDoctorApplicationApi({
        doctorId: selectedDoctor.id,
        verificationStatus: decision,
        ...(decision === "REJECTED" && {
          rejectionReason: rejectionReason.trim(),
        }),
      });

      setSuccessMsg(
        `Dr. ${selectedDoctor.name}'s application has been ${decision.toLowerCase()}.`
      );
      setSelectedDoctor(null);
      await fetchDoctors();
    } catch (err: any) {
      setModalError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update application status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: DoctorVerificationStatus) => {
    switch (status) {
      case "APPROVED":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200 gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
    }
  };

  const filterTabs: { label: string; value: StatusFilter }[] = [
    { label: "Pending Review", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "All Doctors", value: "ALL" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Doctor Applications
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Verify BMDC credentials, inspect resumes, and approve or reject specialist applications.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchDoctors}
          disabled={loading}
          className="self-start sm:self-auto rounded-xl font-semibold"
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh List
        </Button>
      </div>

      {/* Feedback Alerts */}
      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMsg && (
        <Alert className="rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <AlertTitle>Status Updated</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {/* Main Directory Card */}
      <Card className="rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="space-y-4 border-b bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {filterTabs.map((tab) => (
                <Button
                  key={tab.value}
                  variant={statusFilter === tab.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setStatusFilter(tab.value);
                    setPage(1);
                  }}
                  className={`rounded-xl font-semibold ${
                    statusFilter === tab.value
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "text-slate-600"
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 w-full lg:w-auto"
            >
              <div className="relative flex-1 lg:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Name, email, or BMDC license..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 rounded-xl"
                />
              </div>
              <Button type="submit" variant="secondary" className="rounded-xl">
                Search
              </Button>
            </form>
          </div>

          <CardDescription className="text-xs">
            Total matching records: <span className="font-bold">{meta.total}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-1/3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="py-16 text-center px-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <Stethoscope className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-900">
                No doctor applications found
              </p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                There are no applications matching the selected filter or search query.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/70">
                    <TableHead className="font-bold">Applicant</TableHead>
                    <TableHead className="font-bold">
                      Department & Specialty
                    </TableHead>
                    <TableHead className="font-bold">BMDC & Exp.</TableHead>
                    <TableHead className="font-bold">Email Status</TableHead>
                    <TableHead className="font-bold">Application</TableHead>
                    <TableHead className="text-right font-bold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doc) => {
                    const isEmailVerified = doc.user?.emailVerified ?? false;
                    const isPending = doc.verificationStatus === "PENDING";

                    return (
                      <TableRow key={doc.id}>
                        {/* Applicant Info */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {doc.profilePhoto ? (
                              <img
                                src={doc.profilePhoto}
                                alt={doc.name}
                                className="w-10 h-10 rounded-full object-cover border shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center shrink-0">
                                {doc.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-slate-900 text-sm">
                                {doc.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {doc.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Department & Specialization */}
                        <TableCell>
                          <p className="text-xs font-bold text-slate-800">
                            {doc.department?.name || "Unassigned"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.specialization}
                          </p>
                        </TableCell>

                        {/* License & Experience */}
                        <TableCell>
                          <p className="text-xs font-semibold text-slate-800">
                            {doc.licenseNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.experienceYears}{" "}
                            {doc.experienceYears === 1 ? "year" : "years"} exp.
                          </p>
                        </TableCell>

                        {/* Email Verification Status */}
                        <TableCell>
                          {isEmailVerified ? (
                            <Badge
                              variant="outline"
                              className="border-emerald-200 bg-emerald-50/70 text-emerald-700 gap-1 text-[11px]"
                            >
                              <MailCheck className="w-3 h-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="border-amber-200 bg-amber-50/70 text-amber-700 gap-1 text-[11px]"
                            >
                              <MailWarning className="w-3 h-3" />
                              Unverified
                            </Badge>
                          )}
                        </TableCell>

                        {/* Verification Status */}
                        <TableCell>
                          {getStatusBadge(doc.verificationStatus)}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openReviewModal(doc, false)}
                              className="h-8 rounded-lg text-xs font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1.5" />
                              Inspect
                            </Button>

                            {isPending && (
                              <>
                                <Button
                                  size="sm"
                                  disabled={!isEmailVerified}
                                  onClick={() => openReviewModal(doc, false)}
                                  className="h-8 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                                  title={
                                    !isEmailVerified
                                      ? "Doctor must verify email via OTP first"
                                      : "Approve application"
                                  }
                                >
                                  Approve
                                </Button>

                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={!isEmailVerified}
                                  onClick={() => openReviewModal(doc, true)}
                                  className="h-8 rounded-lg text-xs font-bold"
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
              <p className="text-xs text-muted-foreground">
                Page <span className="font-bold">{meta.page}</span> of{" "}
                <span className="font-bold">{meta.totalPages}</span>
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg h-8"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg h-8"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doctor Details & Verification Dialog */}
      <Dialog
        open={Boolean(selectedDoctor)}
        onOpenChange={(open) => !open && setSelectedDoctor(null)}
      >
        <DialogContent className="sm:max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          {selectedDoctor && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-3 pr-6">
                  <div className="flex items-center gap-3.5">
                    {selectedDoctor.profilePhoto ? (
                      <img
                        src={selectedDoctor.profilePhoto}
                        alt={selectedDoctor.name}
                        className="w-14 h-14 rounded-2xl object-cover border"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold text-xl flex items-center justify-center">
                        {selectedDoctor.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <DialogTitle className="text-xl font-extrabold">
                        {selectedDoctor.name}
                      </DialogTitle>
                      <DialogDescription className="text-xs mt-0.5">
                        {selectedDoctor.email} •{" "}
                        {selectedDoctor.department?.name}
                      </DialogDescription>
                    </div>
                  </div>
                  {getStatusBadge(selectedDoctor.verificationStatus)}
                </div>
              </DialogHeader>

              <div className="space-y-5 pt-2">
                {modalError && (
                  <Alert variant="destructive" className="rounded-xl py-2.5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {modalError}
                    </AlertDescription>
                  </Alert>
                )}

                {!selectedDoctor.user?.emailVerified && (
                  <Alert className="rounded-xl border-amber-200 bg-amber-50 text-amber-800 py-2.5">
                    <MailWarning className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-xs font-medium">
                      This applicant has not verified their email via OTP yet. Approval/Rejection is disabled until email verification completes.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Credential Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
                    <span className="text-muted-foreground font-medium">
                      BMDC / License Number
                    </span>
                    <p className="font-bold text-slate-900 text-sm">
                      {selectedDoctor.licenseNumber}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
                    <span className="text-muted-foreground font-medium">
                      Specialization & Experience
                    </span>
                    <p className="font-bold text-slate-900 text-sm">
                      {selectedDoctor.specialization} (
                      {selectedDoctor.experienceYears} yrs)
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Qualifications
                    </span>
                    <p className="font-bold text-slate-900">
                      {selectedDoctor.qualifications}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
                    <span className="text-muted-foreground font-medium">
                      Proposed Consultation Fee
                    </span>
                    <p className="font-bold text-slate-900">
                      {selectedDoctor.consultationFee !== undefined &&
                      selectedDoctor.consultationFee !== null
                        ? `৳ ${selectedDoctor.consultationFee}`
                        : "Not specified"}
                    </p>
                  </div>

                  {selectedDoctor.contactNumber && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
                      <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> Contact Number
                      </span>
                      <p className="font-bold text-slate-900">
                        {selectedDoctor.contactNumber}
                      </p>
                    </div>
                  )}

                  {selectedDoctor.address && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1">
                      <span className="text-muted-foreground font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Chamber / Address
                      </span>
                      <p className="font-bold text-slate-900">
                        {selectedDoctor.address}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {selectedDoctor.bio && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border space-y-1 text-xs">
                    <span className="text-muted-foreground font-medium">
                      Professional Bio
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedDoctor.bio}
                    </p>
                  </div>
                )}

                {/* Uploaded Documents (Resume & Additional Files) */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Submitted Documents
                  </Label>
                  <div className="flex flex-wrap gap-2.5">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-emerald-200 bg-emerald-50/60 text-emerald-700 hover:bg-emerald-100"
                    >
                      <a
                        href={selectedDoctor.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Resume / CV
                        <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </a>
                    </Button>

                    {selectedDoctor.additionalFiles?.map((file, idx) => (
                      <Button
                        key={file.publicId || idx}
                        asChild
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Certificate #{idx + 1}
                          <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Existing Rejection Reason if Rejected */}
                {selectedDoctor.verificationStatus === "REJECTED" &&
                  selectedDoctor.rejectionReason && (
                    <Alert variant="destructive" className="rounded-xl">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle className="text-xs font-bold">
                        Rejection Reason
                      </AlertTitle>
                      <AlertDescription className="text-xs">
                        {selectedDoctor.rejectionReason}
                      </AlertDescription>
                    </Alert>
                  )}

                {/* Rejection Reason Input Box (when Admin clicks Reject) */}
                {selectedDoctor.verificationStatus === "PENDING" &&
                  rejectMode && (
                    <div className="space-y-2 p-4 rounded-xl bg-rose-50/70 border border-rose-200">
                      <Label
                        htmlFor="rejection-reason"
                        className="text-xs font-bold text-rose-800"
                      >
                        Rejection Reason <span className="text-rose-600">*</span>
                      </Label>
                      <Textarea
                        id="rejection-reason"
                        placeholder="Explain why this application is being rejected (will be emailed to the applicant)..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        className="rounded-xl bg-white resize-none"
                      />
                    </div>
                  )}
              </div>

              <DialogFooter className="pt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedDoctor(null)}
                  disabled={actionLoading}
                  className="rounded-xl"
                >
                  Close
                </Button>

                {selectedDoctor.verificationStatus === "PENDING" && (
                  <>
                    {!rejectMode ? (
                      <>
                        <Button
                          type="button"
                          variant="destructive"
                          disabled={
                            actionLoading ||
                            !selectedDoctor.user?.emailVerified
                          }
                          onClick={() => setRejectMode(true)}
                          className="rounded-xl font-bold"
                        >
                          <XCircle className="w-4 h-4 mr-1.5" />
                          Reject
                        </Button>

                        <Button
                          type="button"
                          disabled={
                            actionLoading ||
                            !selectedDoctor.user?.emailVerified
                          }
                          onClick={() => handleReviewDecision("APPROVED")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          {actionLoading
                            ? "Approving..."
                            : "Approve Application"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          disabled={actionLoading}
                          onClick={() => setRejectMode(false)}
                          className="rounded-xl"
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          disabled={actionLoading}
                          onClick={() => handleReviewDecision("REJECTED")}
                          className="rounded-xl font-bold"
                        >
                          {actionLoading
                            ? "Rejecting..."
                            : "Confirm Rejection"}
                        </Button>
                      </>
                    )}
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}