"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Building2,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

import { getAdminAnalyticsApi, IAdminAnalytics } from "@/lib/analytics.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminOverviewPage() {
  const [analytics, setAnalytics] = useState<IAdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState("2026");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAdminAnalyticsApi();
      setAnalytics(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load admin analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const formatBDT = (amount: number = 0) =>
    `৳ ${amount.toLocaleString("en-BD")}`;

  // ১. Donut Chart-এর জন্য ৪টি রিয়েল ক্যাটাগরি (Completed, Confirmed/Active, Cancelled, Pending Apps)
  const completedAppts = analytics?.totalCompletedAppointments || 0;
  const cancelledAppts = analytics?.totalCancelledAppointments || 0;
  const activeAppts = Math.max(
    0,
    (analytics?.totalAppointments || 0) - (completedAppts + cancelledAppts)
  );
  const pendingApps = analytics?.totalPendingDoctorApplications || 0;

  const donutTotal =
    completedAppts + activeAppts + cancelledAppts + pendingApps;

  const radius = 56;
  const circumference = 2 * Math.PI * radius;

  const seg1Len = donutTotal > 0 ? (completedAppts / donutTotal) * circumference : 0;
  const seg2Len = donutTotal > 0 ? (activeAppts / donutTotal) * circumference : 0;
  const seg3Len = donutTotal > 0 ? (pendingApps / donutTotal) * circumference : 0;
  const seg4Len = donutTotal > 0 ? (cancelledAppts / donutTotal) * circumference : 0;

  // ২. ১২ মাসের Stacked Vertical Bar Chart ডেটা (ডেমো পিকচারের Jan-Dec ৩টি স্ট্যাকড কালারের মতো)
  // পরবর্তীতে ব্যাকএন্ডে monthly analytics endpoint হলে এই অ্যারেটি সরাসরি API থেকে আসবে
  const baseCompleted = Math.max(completedAppts, 8);
  const baseActive = Math.max(activeAppts, 6);
  const basePending = Math.max(pendingApps, 4);

  const monthlyActivity = [
    { month: "Jan", completed: Math.round(baseCompleted * 0.4), active: Math.round(baseActive * 0.3), pending: Math.round(basePending * 0.5) },
    { month: "Feb", completed: Math.round(baseCompleted * 0.9), active: Math.round(baseActive * 1.1), pending: Math.round(basePending * 0.8) },
    { month: "Mar", completed: Math.round(baseCompleted * 0.7), active: Math.round(baseActive * 0.8), pending: Math.round(basePending * 0.7) },
    { month: "Apr", completed: Math.round(baseCompleted * 0.45), active: Math.round(baseActive * 0.4), pending: Math.round(basePending * 0.4) },
    { month: "May", completed: Math.round(baseCompleted * 0.95), active: Math.round(baseActive * 1.2), pending: Math.round(basePending * 0.9) },
    { month: "Jun", completed: Math.round(baseCompleted * 0.5), active: Math.round(baseActive * 0.35), pending: Math.round(basePending * 0.5) },
    { month: "Jul", completed: Math.round(baseCompleted * 1.1), active: Math.round(baseActive * 1.3), pending: Math.round(basePending * 1.0) },
    { month: "Aug", completed: Math.round(baseCompleted * 0.85), active: Math.round(baseActive * 1.1), pending: Math.round(basePending * 0.85) },
    { month: "Sep", completed: Math.round(baseCompleted * 0.45), active: Math.round(baseActive * 0.3), pending: Math.round(basePending * 0.35) },
    { month: "Oct", completed: Math.round(baseCompleted * 0.95), active: Math.round(baseActive * 1.15), pending: Math.round(basePending * 0.9) },
    { month: "Nov", completed: Math.round(baseCompleted * 0.6), active: Math.round(baseActive * 0.5), pending: Math.round(basePending * 0.6) },
    { month: "Dec", completed: Math.round(baseCompleted * 0.85), active: Math.round(baseActive * 1.05), pending: Math.round(basePending * 0.8) },
  ];

  const maxStackTotal = Math.max(
    ...monthlyActivity.map((m) => m.completed + m.active + m.pending),
    10
  );
  const yAxisMax = Math.ceil(maxStackTotal / 20) * 20;
  const yTicks = [yAxisMax, Math.round(yAxisMax * 0.75), Math.round(yAxisMax * 0.5), Math.round(yAxisMax * 0.25), 0];

  // স্ট্যাট পার্সেন্টেজ ক্যালকুলেশন
  const approvalRate =
    analytics && analytics.totalDoctors > 0
      ? ((analytics.totalApprovedDoctors / analytics.totalDoctors) * 100).toFixed(1)
      : "0.0";

  const completionRate =
    analytics && analytics.totalAppointments > 0
      ? ((analytics.totalCompletedAppointments / analytics.totalAppointments) * 100).toFixed(1)
      : "0.0";

  const refundImpactRate =
    analytics && analytics.totalRevenue + analytics.totalRefunded > 0
      ? (
          (analytics.totalRefunded /
            (analytics.totalRevenue + analytics.totalRefunded)) *
          100
        ).toFixed(1)
      : "0.0";

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Row 1: Hero Welcome Banner + Action Spotlight Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 relative overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white shadow-lg rounded-2xl">
          <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
          <div className="absolute right-8 bottom-3 opacity-15 pointer-events-none hidden sm:block">
            <Stethoscope className="w-36 h-36 text-emerald-300" />
          </div>

          <CardHeader className="relative z-10 pb-3">
            <div className="mb-1.5">
              <Badge className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-400/30 gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                WellOra Admin
              </Badge>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back 👋 <br />
              <span className="text-emerald-400">WellOra Control Center</span>
            </CardTitle>
            <CardDescription className="text-slate-300 max-w-md text-xs sm:text-sm leading-relaxed pt-1">
              Monitor live hospital operations, verify BMDC doctor applications, and manage medical specialties from one place.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 pt-2 flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl"
            >
              <Link href="/admin/departments">
                <Building2 className="w-4 h-4 mr-2" />
                Go now
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={fetchAnalytics}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 text-white border-white/15 hover:text-white rounded-xl"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 relative overflow-hidden border-0 bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white shadow-lg rounded-2xl flex flex-col justify-between">
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />

          <CardHeader className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
              DOCTOR ONBOARDING
            </span>
            <CardTitle className="text-lg sm:text-xl font-extrabold text-white pt-1 leading-snug">
              {loading
                ? "Syncing queue..."
                : `${analytics?.totalPendingDoctorApplications ?? 0} Pending Applications...`}
            </CardTitle>
            <CardDescription className="text-slate-300 text-xs leading-relaxed pt-1">
              {analytics?.totalApprovedDoctors ?? 0} approved and{" "}
              {analytics?.totalRejectedDoctors ?? 0} rejected applications recorded.
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 pt-0">
            <Button
              asChild
              variant="link"
              className="px-0 text-emerald-400 hover:text-emerald-300 font-bold text-xs"
            >
              <Link href="/admin/doctor-applications">
                Review Doctor Queue
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Row 2: 3 Key Metric Cards with Trend Stats + Mini Spark Bars (ডেমো পিকচারের মাঝের ৩ কার্ড) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="rounded-2xl">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Total Doctors */}
              <Card className="rounded-2xl shadow-xs border-slate-200/80">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-600">
                      Total registered doctors
                    </p>
                    <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                      {analytics.totalDoctors.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <span className="inline-flex items-center gap-1 text-emerald-600">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{approvalRate}%
                      </span>
                      <span className="text-muted-foreground font-normal">
                        approved rate
                      </span>
                    </div>
                  </div>

                  {/* Green Mini Spark-Bars */}
                  <div className="flex items-end gap-1.5 h-12">
                    <span className="w-1.5 h-3 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-4 rounded-full bg-emerald-400" />
                    <span className="w-1.5 h-11 rounded-full bg-emerald-600" />
                    <span className="w-1.5 h-6 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-8 rounded-full bg-emerald-500" />
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Total Patients */}
              <Card className="rounded-2xl shadow-xs border-slate-200/80">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-600">
                      Total active patients
                    </p>
                    <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                      {analytics.totalPatients.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <span className="inline-flex items-center gap-1 text-cyan-600">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{completionRate}%
                      </span>
                      <span className="text-muted-foreground font-normal">
                        completion ratio
                      </span>
                    </div>
                  </div>

                  {/* Cyan Mini Spark-Bars */}
                  <div className="flex items-end gap-1.5 h-12">
                    <span className="w-1.5 h-4 rounded-full bg-cyan-500" />
                    <span className="w-1.5 h-9 rounded-full bg-cyan-500" />
                    <span className="w-1.5 h-6 rounded-full bg-cyan-400" />
                    <span className="w-1.5 h-5 rounded-full bg-cyan-500" />
                    <span className="w-1.5 h-10 rounded-full bg-cyan-600" />
                    <span className="w-1.5 h-7 rounded-full bg-cyan-500" />
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Net Revenue */}
              <Card className="rounded-2xl shadow-xs border-slate-200/80">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-600">
                      Net platform revenue
                    </p>
                    <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                      {formatBDT(analytics.totalRevenue)}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <span className="inline-flex items-center gap-1 text-rose-500">
                        <TrendingDown className="w-3.5 h-3.5" />
                        -{refundImpactRate}%
                      </span>
                      <span className="text-muted-foreground font-normal">
                        refunded ({formatBDT(analytics.totalRefunded)})
                      </span>
                    </div>
                  </div>

                  {/* Coral/Orange Mini Spark-Bars */}
                  <div className="flex items-end gap-1.5 h-12">
                    <span className="w-1.5 h-5 rounded-full bg-orange-400" />
                    <span className="w-1.5 h-8 rounded-full bg-orange-500" />
                    <span className="w-1.5 h-4 rounded-full bg-orange-300" />
                    <span className="w-1.5 h-7 rounded-full bg-orange-500" />
                    <span className="w-1.5 h-11 rounded-full bg-orange-500" />
                    <span className="w-1.5 h-6 rounded-full bg-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Row 3: Left Donut Chart + Right 12-Month Stacked Bar Chart (হুবহু ডেমো পিকচারের নিচের অংশ) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: 4-Segment Donut Chart */}
              <Card className="lg:col-span-5 rounded-2xl shadow-xs border-slate-200/80 flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold text-slate-900">
                    Platform activity breakdown
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Appointments & pending doctor applications
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                  <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 144 144">
                      {/* Base Track */}
                      <circle
                        cx="72"
                        cy="72"
                        r={radius}
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth="16"
                      />
                      {donutTotal > 0 && (
                        <>
                          {/* 1. Completed Appointments (Mint Green) */}
                          <circle
                            cx="72"
                            cy="72"
                            r={radius}
                            fill="transparent"
                            stroke="#4ade80"
                            strokeWidth="16"
                            strokeDasharray={`${seg1Len} ${circumference}`}
                            strokeDashoffset={0}
                          />
                          {/* 2. Active / Confirmed Appointments (Emerald Teal) */}
                          <circle
                            cx="72"
                            cy="72"
                            r={radius}
                            fill="transparent"
                            stroke="#059669"
                            strokeWidth="16"
                            strokeDasharray={`${seg2Len} ${circumference}`}
                            strokeDashoffset={-seg1Len}
                          />
                          {/* 3. Pending Doctor Apps (Dark Pine) */}
                          <circle
                            cx="72"
                            cy="72"
                            r={radius}
                            fill="transparent"
                            stroke="#064e3b"
                            strokeWidth="16"
                            strokeDasharray={`${seg3Len} ${circumference}`}
                            strokeDashoffset={-(seg1Len + seg2Len)}
                          />
                          {/* 4. Cancelled Appointments (Soft Mint/Rose) */}
                          <circle
                            cx="72"
                            cy="72"
                            r={radius}
                            fill="transparent"
                            stroke="#bbf7d0"
                            strokeWidth="16"
                            strokeDasharray={`${seg4Len} ${circumference}`}
                            strokeDashoffset={-(seg1Len + seg2Len + seg3Len)}
                          />
                        </>
                      )}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        Total
                      </span>
                      <span className="text-2xl font-extrabold text-slate-900">
                        {donutTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* 4-Item Legend (ডেমো পিকচারের নিচের ৪টি ডট লেজেন্ডের মতো) */}
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3 border-t text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#bbf7d0]" />
                      <span>Cancelled ({cancelledAppts})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80]" />
                      <span>Completed ({completedAppts})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
                      <span>Active ({activeAppts})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#064e3b]" />
                      <span>Pending ({pendingApps})</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right 7 Cols: Stacked Vertical Bar Chart (ডেমো পিকচারের Area Installed চার্টের মতো) */}
              <Card className="lg:col-span-7 rounded-2xl shadow-xs border-slate-200/80 flex flex-col justify-between">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Consultations & Onboarding Overview
                    </CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      (+{completionRate}%) completion rate across platform
                    </CardDescription>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedYear((prev) => (prev === "2026" ? "2025" : "2026"))
                    }
                    className="h-8 rounded-lg text-xs font-bold gap-1.5"
                  >
                    <span>{selectedYear}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Top 3 Category Stats (ডেমো পিকচারের Asia / Europe / Americas স্ট্যাটসের মতো) */}
                  <div className="flex flex-wrap items-center gap-6 sm:gap-10">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                        <span>Completed</span>
                      </div>
                      <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                        {analytics.totalCompletedAppointments}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span>Approved Doctors</span>
                      </div>
                      <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                        {analytics.totalApprovedDoctors}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                        <span>Total Bookings</span>
                      </div>
                      <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                        {analytics.totalAppointments}
                      </p>
                    </div>
                  </div>

                  {/* Stacked Vertical Bar Chart (Jan - Dec) */}
                  <div className="pt-2">
                    <div className="flex gap-3 h-48">
                      {/* Y-Axis Labels */}
                      <div className="flex flex-col justify-between text-[11px] font-medium text-muted-foreground pb-6 text-right w-7 shrink-0">
                        {yTicks.map((tick) => (
                          <span key={tick}>{tick}</span>
                        ))}
                      </div>

                      {/* Bars + Horizontal Dashed Gridlines */}
                      <div className="relative flex-1 flex flex-col justify-between">
                        {/* Gridlines */}
                        <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none">
                          {yTicks.map((tick) => (
                            <div
                              key={tick}
                              className="w-full border-b border-dashed border-slate-200/80"
                            />
                          ))}
                        </div>

                        {/* 12 Monthly Stacked Columns */}
                        <div className="relative z-10 flex-1 grid grid-cols-12 gap-1.5 sm:gap-2.5 items-end pb-6 px-1">
                          {monthlyActivity.map((item) => {
                            const hCompleted = (item.completed / yAxisMax) * 100;
                            const hActive = (item.active / yAxisMax) * 100;
                            const hPending = (item.pending / yAxisMax) * 100;

                            return (
                              <div
                                key={item.month}
                                className="h-full flex flex-col justify-end items-center group"
                                title={`${item.month}: ${item.completed} Completed, ${item.active} Active, ${item.pending} Pending`}
                              >
                                <div className="w-2.5 sm:w-3.5 flex flex-col justify-end rounded-t-md overflow-hidden transition-all group-hover:opacity-85 h-full">
                                  {/* Top Stack: Cyan */}
                                  <div
                                    style={{ height: `${hPending}%` }}
                                    className="w-full bg-cyan-400 transition-all duration-500"
                                  />
                                  {/* Middle Stack: Amber */}
                                  <div
                                    style={{ height: `${hActive}%` }}
                                    className="w-full bg-amber-400 transition-all duration-500"
                                  />
                                  {/* Bottom Stack: Emerald */}
                                  <div
                                    style={{ height: `${hCompleted}%` }}
                                    className="w-full bg-emerald-700 transition-all duration-500"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* X-Axis Month Labels */}
                        <div className="grid grid-cols-12 gap-1.5 sm:gap-2.5 text-center px-1">
                          {monthlyActivity.map((item) => (
                            <span
                              key={item.month}
                              className="text-[11px] font-medium text-muted-foreground"
                            >
                              {item.month}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )
      )}
    </div>
  );
}