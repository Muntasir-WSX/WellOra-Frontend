"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Award,
  Banknote,
  Building2,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  Globe,
  Loader2,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  getDoctorAnalyticsApi,
  type IDoctorAnalytics,
} from "@/lib/analytics.api";
import { getSingleDoctorApi, type IDoctorDetails } from "@/lib/doctor.api";
import { getMyProfile, type UserProfileResponse } from "@/lib/user.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AUTO_REFRESH_SECONDS = 30;

export default function DoctorDashboardPage() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<IDoctorDetails | null>(
    null,
  );
  const [analytics, setAnalytics] = useState<IDoctorAnalytics | null>(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_REFRESH_SECONDS);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadDashboardData = useCallback(async (silent = false) => {
    if (silent) {
      setIsRefreshing(true);
    } else {
      setInitialLoading(true);
    }

    try {
      const [profileRes, analyticsRes] = await Promise.all([
        getMyProfile(),
        getDoctorAnalyticsApi(),
      ]);

      setProfile(profileRes);
      setAnalytics(analyticsRes);
      setLastUpdated(new Date());
      setSecondsLeft(AUTO_REFRESH_SECONDS);

      if (profileRes?.doctor?.id) {
        const fullDoc = await getSingleDoctorApi(profileRes.doctor.id).catch(
          () => null,
        );
        if (fullDoc) setDoctorDetails(fullDoc);
      }
    } catch (error: unknown) {
      if (!silent) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load doctor dashboard",
        );
      }
    } finally {
      setInitialLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadDashboardData(false);
  }, [loadDashboardData]);

  // Auto-loader countdown & silent background refresh every 30s
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          loadDashboardData(true);
          return AUTO_REFRESH_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, loadDashboardData]);

  if (initialLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium">
          Loading your clinical analytics & schedule overview...
        </p>
      </div>
    );
  }

  const doctorName =
    doctorDetails?.name || profile?.doctor?.name || profile?.name || "Doctor";
  const doctorPhoto =
    doctorDetails?.profilePhoto ||
    profile?.doctor?.profilePhoto ||
    profile?.imageUrl ||
    "";
  const specialistTitle =
    doctorDetails?.specialization ||
    profile?.doctor?.department?.name ||
    "Medical Specialist";
  const departmentName =
    doctorDetails?.department?.name || profile?.doctor?.department?.name;
  const qualifications =
    doctorDetails?.qualifications || profile?.doctor?.qualifications;

  const stats = analytics || {
    totalSchedules: 0,
    publishedSchedules: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    ongoingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalDoctorEarnings: 0,
    totalDoctorRefunded: 0,
  };

  const completionRate =
    stats.totalAppointments > 0
      ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100)
      : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. DOCTOR HERO BANNER (Image + Name + Specialist + Auto-Loader Controls) */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 text-white shadow-xl sm:p-8"
      >
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          {/* Left: Doctor Photo + Name + Specialist Info */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 shrink-0 border-4 border-emerald-500/40 shadow-lg sm:h-24 sm:w-24">
              <AvatarImage
                src={doctorPhoto}
                alt={doctorName}
                className="object-cover"
              />
              <AvatarFallback className="bg-emerald-600 text-2xl font-bold text-white">
                {doctorName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-emerald-400/30 bg-emerald-500/20 text-emerald-300">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Verified Specialist
                </Badge>
                {departmentName && (
                  <Badge
                    variant="secondary"
                    className="bg-white/10 text-slate-100"
                  >
                    <Building2 className="mr-1 h-3 w-3 text-emerald-400" />
                    {departmentName}
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Welcome back, {doctorName}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
                  <Stethoscope className="h-4 w-4" />
                  {specialistTitle} Specialist
                </span>
                {qualifications && (
                  <>
                    <span className="text-slate-500">•</span>
                    <span className="inline-flex items-center gap-1 text-slate-300">
                      <Award className="h-3.5 w-3.5 text-emerald-400" />
                      {qualifications}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Auto-Refresh Loader Status & Actions */}
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                {autoRefreshEnabled && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    autoRefreshEnabled ? "bg-emerald-400" : "bg-slate-400"
                  }`}
                />
              </span>

              <span className="text-slate-200">
                {isRefreshing
                  ? "Syncing live data..."
                  : autoRefreshEnabled
                    ? `Auto-refresh in ${secondsLeft}s`
                    : "Auto-refresh paused"}
              </span>

              <button
                type="button"
                onClick={() => setAutoRefreshEnabled((prev) => !prev)}
                className="ml-1 rounded-md bg-white/10 px-2 py-0.5 font-semibold text-emerald-300 transition hover:bg-white/20"
              >
                {autoRefreshEnabled ? "Pause" : "Resume"}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={isRefreshing}
                onClick={() => loadDashboardData(true)}
                className="gap-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh Now
              </Button>

              <Button
                asChild
                size="sm"
                className="gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
              >
                <Link href="/">
                  Back to Website
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 2. FINANCIAL & SCHEDULE HIGHLIGHTS */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Net Earnings */}
        <Card className="rounded-2xl border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card to-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Doctor Earnings
            </CardTitle>
            <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-600">
              <Banknote className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-600">
              ৳{stats.totalDoctorEarnings.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              After deducting refunded consultations
            </p>
          </CardContent>
        </Card>

        {/* Refunded Amount */}
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
              ৳{stats.totalDoctorRefunded.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Canceled 1h+ prior or doctor-canceled
            </p>
          </CardContent>
        </Card>

        {/* Total Schedules */}
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Schedules
            </CardTitle>
            <div className="rounded-xl bg-sky-500/10 p-2 text-sky-600">
              <CalendarDays className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {stats.totalSchedules}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Created 20-minute consultation windows
            </p>
          </CardContent>
        </Card>

        {/* Published Schedules */}
        <Card className="rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published Schedules
            </CardTitle>
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-600">
              <Globe className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-foreground">
              {stats.publishedSchedules}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Live and open for patient booking
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 3. APPOINTMENT STATUS BREAKDOWN */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Appointment Analytics
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-time overview of patient consultations across every status.
            </p>
          </div>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Last synced: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Total Appointments */}
          <Card className="rounded-2xl shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Bookings
              </CardTitle>
              <CalendarCheck2 className="h-4 w-4 text-slate-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold">
                {stats.totalAppointments}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                All-time appointments
              </p>
            </CardContent>
          </Card>

          {/* Upcoming (Confirmed) */}
          <Card className="rounded-2xl border-sky-500/20 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                Upcoming
              </CardTitle>
              <CalendarClock className="h-4 w-4 text-sky-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-sky-600">
                {stats.upcomingAppointments}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Confirmed sessions
              </p>
            </CardContent>
          </Card>

          {/* Ongoing */}
          <Card className="rounded-2xl border-amber-500/20 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                Ongoing
              </CardTitle>
              <Activity className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-amber-600">
                {stats.ongoingAppointments}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Active right now
              </p>
            </CardContent>
          </Card>

          {/* Completed */}
          <Card className="rounded-2xl border-emerald-500/20 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Completed
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-emerald-600">
                {stats.completedAppointments}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {completionRate}% completion rate
              </p>
            </CardContent>
          </Card>

          {/* Cancelled */}
          <Card className="rounded-2xl border-rose-500/20 shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Cancelled
              </CardTitle>
              <XCircle className="h-4 w-4 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold text-rose-600">
                {stats.cancelledAppointments}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Cancelled sessions
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 4. QUICK WORKSPACE ACTIONS */}
      <Card className="rounded-3xl border-slate-200/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Quick Clinical Actions</CardTitle>
          <CardDescription>
            Manage your schedules, conduct consultations, or update your
            specialist profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
          >
            <Link href="/doctor/schedules">
              <Clock className="mr-2 h-4 w-4" />
              Manage Schedules
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/doctor/appointments">
              <CalendarCheck2 className="mr-2 h-4 w-4" />
              View Appointments
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/dashboard/profile">Update Profile</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}