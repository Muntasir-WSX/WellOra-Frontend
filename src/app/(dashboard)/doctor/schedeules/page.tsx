"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { differenceInMinutes, format } from "date-fns";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Globe,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Send,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import {
  createScheduleApi,
  deleteScheduleApi,
  getMySchedulesApi,
  publishScheduleApi,
  updateScheduleApi,
  type IDoctorSchedule,
} from "@/lib/schedule.api";
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
import { Label } from "@/components/ui/label";

const MINUTES_PER_SLOT = 20;
const MIN_DURATION_MINUTES = 3 * 60; // 3 hours
const MAX_DURATION_MINUTES = 8 * 60; // 8 hours

function toLocalDateInput(isoString: string) {
  return format(new Date(isoString), "yyyy-MM-dd");
}

function toLocalTimeInput(isoString: string) {
  return format(new Date(isoString), "HH:mm");
}

function buildIsoFromDateAndTime(dateStr: string, timeStr: string) {
  return new Date(`${dateStr}T${timeStr}:00`).toISOString();
}

export default function DoctorSchedulesPage() {
  const [schedules, setSchedules] = useState<IDoctorSchedule[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  // Create / Edit Dialog State
  const [formOpen, setFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] =
    useState<IDoctorSchedule | null>(null);
  const [dateValue, setDateValue] = useState("");
  const [startTimeValue, setStartTimeValue] = useState("10:00");
  const [endTimeValue, setEndTimeValue] = useState("14:00");
  const [meetingLinkValue, setMeetingLinkValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Action Loading States (Publish / Delete)
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [deletingSchedule, setDeletingSchedule] =
    useState<IDoctorSchedule | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getMySchedulesApi({
        page,
        limit: 9,
        status: statusFilter || undefined,
        sortBy: "startDateTime",
        sortOrder: "desc",
      });
      setSchedules(res.schedules);
      setMeta(res.meta);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load schedules",
      );
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Live slot & duration preview inside the Create/Edit modal
  const durationPreview = useMemo(() => {
    if (!dateValue || !startTimeValue || !endTimeValue) {
      return { valid: false, message: "Select date, start time, and end time" };
    }

    const start = new Date(`${dateValue}T${startTimeValue}:00`);
    const end = new Date(`${dateValue}T${endTimeValue}:00`);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return { valid: false, message: "Invalid date or time format" };
    }

    const mins = differenceInMinutes(end, start);
    if (mins <= 0) {
      return {
        valid: false,
        message: "End time must be after start time on the same day",
      };
    }

    if (mins < MIN_DURATION_MINUTES || mins > MAX_DURATION_MINUTES) {
      return {
        valid: false,
        message: `Duration is ${(mins / 60).toFixed(1)}h — must be between 3 and 8 hours`,
      };
    }

    const slots = Math.floor(mins / MINUTES_PER_SLOT);
    return {
      valid: true,
      durationHours: (mins / 60).toFixed(1),
      totalSlots: slots,
      message: `${(mins / 60).toFixed(1)} hours • ${slots} consultation slots (20 min each)`,
    };
  }, [dateValue, startTimeValue, endTimeValue]);

  const openCreateModal = () => {
    setEditingSchedule(null);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDateValue(format(tomorrow, "yyyy-MM-dd"));
    setStartTimeValue("10:00");
    setEndTimeValue("14:00");
    setMeetingLinkValue("");
    setFormOpen(true);
  };

  const openEditModal = (schedule: IDoctorSchedule) => {
    setEditingSchedule(schedule);
    setDateValue(toLocalDateInput(schedule.startDateTime));
    setStartTimeValue(toLocalTimeInput(schedule.startDateTime));
    setEndTimeValue(toLocalTimeInput(schedule.endDateTime));
    setMeetingLinkValue(schedule.meetingLink || "");
    setFormOpen(true);
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!durationPreview.valid) {
      toast.error(durationPreview.message);
      return;
    }

    if (!meetingLinkValue.trim()) {
      toast.error("Please provide a valid consultation meeting link.");
      return;
    }

    const startDateTime = buildIsoFromDateAndTime(dateValue, startTimeValue);
    const endDateTime = buildIsoFromDateAndTime(dateValue, endTimeValue);

    setSubmitting(true);
    try {
      if (editingSchedule) {
        await updateScheduleApi(editingSchedule.id, {
          startDateTime,
          endDateTime,
          meetingLink: meetingLinkValue.trim(),
        });
        toast.success("Schedule updated successfully!");
      } else {
        await createScheduleApi({
          startDateTime,
          endDateTime,
          meetingLink: meetingLinkValue.trim(),
        });
        toast.success("Schedule created successfully!");
      }

      setFormOpen(false);
      setEditingSchedule(null);
      fetchSchedules();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save schedule",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublishSchedule = async (scheduleId: string) => {
    setPublishingId(scheduleId);
    try {
      await publishScheduleApi(scheduleId);
      toast.success("Schedule published! Patients can now book slots.");
      fetchSchedules();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to publish schedule",
      );
    } finally {
      setPublishingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingSchedule) return;
    setDeleting(true);
    try {
      await deleteScheduleApi(deletingSchedule.id);
      toast.success("Schedule deleted successfully.");
      setDeletingSchedule(null);
      fetchSchedules();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete schedule",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER & CREATE BUTTON */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/80 bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:p-8">
        <div className="space-y-1.5">
          <Badge
            variant="secondary"
            className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          >
            <CalendarDays className="h-3.5 w-3.5 text-emerald-600" />
            20-Minute Consultation Windows
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            My Clinical Schedules
          </h1>
          <p className="text-sm text-muted-foreground">
            Create daily consultation windows (3–8 hours), add video meeting
            links, and publish slots for patients.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fetchSchedules}
            disabled={loading}
            className="gap-1.5 rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            type="button"
            onClick={openCreateModal}
            className="gap-2 rounded-xl bg-emerald-600 font-semibold text-white shadow-sm hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            Create Schedule
          </Button>
        </div>
      </div>

      {/* 2. STATUS FILTER TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "All Schedules", value: "" },
            { label: "Published", value: "PUBLISHED" },
            { label: "Draft / Unpublished", value: "DRAFT" },
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

        <span className="text-xs font-medium text-muted-foreground">
          Showing {schedules.length} of {meta.total} schedules
        </span>
      </div>

      {/* 3. SCHEDULES GRID */}
      {loading ? (
        <div className="flex h-64 items-center justify-center gap-2 rounded-3xl border border-dashed text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Loading your schedules...</span>
        </div>
      ) : schedules.length === 0 ? (
        <div className="flex h-72 flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center">
          <Calendar className="h-11 w-11 text-muted-foreground/40" />
          <h3 className="mt-3 text-base font-bold">No schedules found</h3>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {statusFilter
              ? `You don't have any ${statusFilter.toLowerCase()} schedules right now.`
              : "Create your first 3 to 8-hour consultation schedule so patients can book appointments."}
          </p>
          <Button
            type="button"
            onClick={openCreateModal}
            className="mt-5 gap-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
          >
            <Plus className="h-4 w-4" />
            Create First Schedule
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {schedules.map((schedule, idx) => {
            const isPublished = schedule.status === "PUBLISHED";
            const bookedCount = schedule.totalSlots - schedule.availableSlots;
            const isLocked = isPublished && bookedCount > 0;

            return (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (idx % 6) * 0.04 }}
              >
                <Card className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border-slate-200/80 shadow-xs transition-all hover:border-emerald-500/40 hover:shadow-md">
                  <div>
                    <CardHeader className="border-b bg-slate-50/70 pb-4 dark:bg-slate-900/40">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant="secondary"
                          className={
                            isPublished
                              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                              : "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400"
                          }
                        >
                          {isPublished ? (
                            <Globe className="mr-1 h-3 w-3" />
                          ) : (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {schedule.status}
                        </Badge>

                        <span className="text-xs font-medium text-muted-foreground">
                          {bookedCount}/{schedule.totalSlots} Booked
                        </span>
                      </div>

                      <CardTitle className="mt-2.5 text-lg font-extrabold">
                        {format(
                          new Date(schedule.startDateTime),
                          "EEEE, dd MMM yyyy",
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1.5 font-medium text-foreground">
                        <Clock className="h-3.5 w-3.5 text-emerald-600" />
                        {format(
                          new Date(schedule.startDateTime),
                          "hh:mm a",
                        )} –{" "}
                        {format(new Date(schedule.endDateTime), "hh:mm a")}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4">
                      {/* Slot Metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border bg-slate-50/70 p-3 dark:bg-slate-900/40">
                          <p className="text-[11px] text-muted-foreground">
                            Available Slots
                          </p>
                          <p className="mt-0.5 text-lg font-extrabold text-emerald-600">
                            {schedule.availableSlots}
                          </p>
                        </div>

                        <div className="rounded-xl border bg-slate-50/70 p-3 dark:bg-slate-900/40">
                          <p className="text-[11px] text-muted-foreground">
                            Booked Patients
                          </p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-lg font-extrabold text-foreground">
                            <Users className="h-4 w-4 text-sky-600" />
                            {bookedCount}
                          </p>
                        </div>
                      </div>

                      {/* Meeting Link */}
                      <div className="flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs">
                        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                          <Video className="h-4 w-4 shrink-0 text-emerald-600" />
                          <span className="truncate">
                            {schedule.meetingLink}
                          </span>
                        </div>
                        <a
                          href={schedule.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-emerald-600 hover:underline"
                          aria-label="Open meeting link"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>

                      {isLocked && (
                        <p className="flex items-center gap-1.5 text-[11px] text-amber-600">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          Locked from editing/deletion because patients have
                          booked slots.
                        </p>
                      )}
                    </CardContent>
                  </div>

                  <CardFooter className="flex flex-wrap items-center gap-2 border-t pt-4">
                    {!isPublished && (
                      <Button
                        type="button"
                        size="sm"
                        disabled={publishingId === schedule.id}
                        onClick={() => handlePublishSchedule(schedule.id)}
                        className="flex-1 gap-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
                      >
                        {publishingId === schedule.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Send className="h-3.5 w-3.5" />
                        )}
                        Publish
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isLocked}
                      onClick={() => openEditModal(schedule)}
                      className="flex-1 gap-1.5 rounded-xl"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isLocked}
                      onClick={() => setDeletingSchedule(schedule)}
                      className="rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30"
                      aria-label="Delete schedule"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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

      {/* 5. CREATE / EDIT SCHEDULE DIALOG */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? "Update Schedule" : "Create New Schedule"}
            </DialogTitle>
            <DialogDescription>
              Each schedule must be on a single calendar day and span between 3
              and 8 hours (divided into 20-minute consultation slots).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveSchedule} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Consultation Date</Label>
              <Input
                id="schedule-date"
                type="date"
                required
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  required
                  value={startTimeValue}
                  onChange={(e) => setStartTimeValue(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  required
                  value={endTimeValue}
                  onChange={(e) => setEndTimeValue(e.target.value)}
                />
              </div>
            </div>

            {/* Live Duration & Slot Calculation Feedback */}
            <div
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium ${
                durationPreview.valid
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
              }`}
            >
              {durationPreview.valid ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              )}
              <span>{durationPreview.message}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meeting-link">
                Video Consultation Meeting Link
              </Label>
              <Input
                id="meeting-link"
                type="url"
                required
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={meetingLinkValue}
                onChange={(e) => setMeetingLinkValue(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !durationPreview.valid}
                className="gap-2 bg-emerald-600 text-white hover:bg-emerald-500"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingSchedule ? "Save Changes" : "Create Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 6. DELETE CONFIRMATION DIALOG */}
      <Dialog
        open={Boolean(deletingSchedule)}
        onOpenChange={(open) => {
          if (!open) setDeletingSchedule(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Schedule?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the schedule for{" "}
              <strong className="text-foreground">
                {deletingSchedule
                  ? format(
                      new Date(deletingSchedule.startDateTime),
                      "dd MMM yyyy (hh:mm a)",
                    )
                  : ""}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingSchedule(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="gap-2"
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}