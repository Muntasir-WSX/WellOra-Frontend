"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  HeartPulse,
  Loader2,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  getPatientAnalyticsApi,
  type IPatientAnalytics,
} from "@/lib/analytics.api";
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

export default function PatientDashboardPage() {
  const [analytics, setAnalytics] = useState<IPatientAnalytics | null>(null);
  const [patientName, setPatientName] = useState<string>("Patient");
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [stats, profile] = await Promise.all([
        getPatientAnalyticsApi(),
        getMyProfile().catch(() => null),
      ]);

      setAnalytics(stats);
      if (profile?.name) {
        setPatientName(profile.name);
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load patient analytics",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const netSpent = analytics
    ? Math.max(0, analytics.totalAmountSpent - analytics.totalRefunded)
    : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO WELCOME BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-2.5">
            <Badge className="gap-1.5 border-emerald-400/30 bg-emerald-500/20 text-emerald-300">
              <HeartPulse className="h-3.5 w-3.5" />
              WellOra Patient Health Hub
            </Badge>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Welcome back, {patientName}
            </h1>
            <p className="max-w-2xl text-sm text-slate-300">
              Monitor your upcoming consultations, track completed visits, and
              manage your bKash payments and refunds in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={fetchDashboardData}
              disabled={loading}
              className="gap-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>

            <Button
              asChild
              size="sm"
              className="gap-1.5 rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-500"
            >
              <Link href="/available-today">
                <Sparkles className="h-4 w-4" />
                Book Today&apos;s Slot
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. ANALYTICS METRICS GRID */}
      {loading ? (
        <div className="flex h-64 items-center justify-center gap-2 rounded-3xl border border-dashed text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Loading your consultation & billing analytics...</span>
        </div>
      ) : (
        <>
          {/* Top Row: Appointments Breakdown */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-2xl border-slate-200/80 shadow-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Appointments
                  </CardTitle>
                  <div className="rounded-xl bg-slate-500/10 p-2 text-slate-700 dark:text-slate-300">
                    <CalendarCheck2 className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-foreground">
                    {analytics?.totalAppointments ?? 0}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    All-time consultation bookings
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <Card className="rounded-2xl border-sky-500/20 bg-gradient-to-br from-sky-500/10 via-card to-card shadow-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Upcoming Confirmed
                  </CardTitle>
                  <div className="rounded-xl bg-sky-500/15 p-2 text-sky-600">
                    <CalendarClock className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-sky-600">
                    {analytics?.upcomingAppointments ?? 0}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ready for online or chamber visit
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="rounded-2xl border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card to-card shadow-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completed Visits
                  </CardTitle>
                  <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-emerald-600">
                    {analytics?.completedAppointments ?? 0}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Successfully finished consultations
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <Card className="rounded-2xl border-slate-200/80 shadow-xs">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Cancelled Bookings
                  </CardTitle>
                  <div className="rounded-xl bg-rose-500/10 p-2 text-rose-600">
                    <XCircle className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-foreground">
                    {analytics?.cancelledAppointments ?? 0}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Cancelled before consultation
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bottom Row: Financial Summary Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Card className="rounded-2xl border-emerald-500/20 shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Amount Spent
                </CardTitle>
                <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-600">
                  <Banknote className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-emerald-600">
                  ৳{(analytics?.totalAmountSpent ?? 0).toLocaleString()}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Total paid consultation fees via bKash
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-amber-500/20 shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Refunded
                </CardTitle>
                <div className="rounded-xl bg-amber-500/15 p-2 text-amber-600">
                  <RotateCcw className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-amber-600">
                  ৳{(analytics?.totalRefunded ?? 0).toLocaleString()}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Returned automatically on early cancellations
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/80 shadow-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Net Healthcare Spend
                </CardTitle>
                <div className="rounded-xl bg-sky-500/10 p-2 text-sky-600">
                  <CreditCard className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-extrabold text-foreground">
                  ৳{netSpent.toLocaleString()}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Active paid fees after refunds
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* 3. QUICK NAVIGATION CARDS */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card className="rounded-3xl border-slate-200/80 shadow-xs transition-all hover:border-emerald-500/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Stethoscope className="h-5 w-5 text-emerald-600" />
              Find a Doctor
            </CardTitle>
            <CardDescription>
              Explore verified specialists and check today&apos;s live
              consultation slots.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full justify-between rounded-xl">
              <Link href="/doctors">
                Browse Directory
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/80 shadow-xs transition-all hover:border-emerald-500/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarCheck2 className="h-5 w-5 text-sky-600" />
              My Appointments
            </CardTitle>
            <CardDescription>
              Check your serial number, joining time, meeting link, or pay
              pending bookings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full justify-between rounded-xl">
              <Link href="/dashboard/my-appointments">
                View Appointments
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/80 shadow-xs transition-all hover:border-emerald-500/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5 text-amber-600" />
              Payment & Receipts
            </CardTitle>
            <CardDescription>
              View transaction IDs, payment status, and official consultation
              receipts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full justify-between rounded-xl">
              <Link href="/dashboard/payments">
                View Payments
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}