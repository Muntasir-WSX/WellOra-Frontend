"use client";

import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  FileClock,
  Filter,
  Layers,
  Loader2,
  Search,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
import { apiRequest } from "@/lib/api";

interface DoctorInfo {
  id: string;
  name: string;
  email: string;
  specialization?: string;
  profilePhoto?: string | null;
}

interface PatientInfo {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
}

interface AppointmentItem {
  id: string;
  status?: string;
  serialNumber?: number;
  patient?: PatientInfo;
}

interface ScheduleItem {
  id: string;
  doctorId: string;
  startDateTime: string;
  endDateTime: string;
  meetingLink?: string | null;
  totalSlots: number;
  availableSlots: number;
  status: "DRAFT" | "PUBLISHED";
  isDeleted: boolean;
  createdAt: string;
  doctor?: DoctorInfo;
  appointments?: AppointmentItem[];
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Details Modal State
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(
    null,
  );
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        sortBy: "startDateTime",
        sortOrder: "desc",
      });

      if (debouncedSearch.trim()) {
        params.append("searchTerm", debouncedSearch.trim());
      }
      if (statusFilter !== "ALL") {
        params.append("status", statusFilter);
      }

      const json = await apiRequest<{
        data?: ScheduleItem[];
        meta?: Meta;
      }>(`/schedule/all-schedules?${params.toString()}`);

      setSchedules(json.data || []);
      if (json.meta) setMeta(json.meta);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not fetch schedules",
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleViewDetails = async (schedule: ScheduleItem) => {
    setSelectedSchedule(schedule);
    setDetailsOpen(true);
    setDetailsLoading(true);

    try {
      const json = await apiRequest<{ data?: ScheduleItem }>(
        `/schedule/${schedule.id}`,
      );
      if (json.data) {
        setSelectedSchedule(json.data);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not load schedule details",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCopyLink = (id: string, link?: string | null) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    toast.success("Meeting link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Summary metrics from current dataset
  const publishedCount = schedules.filter(
    (s) => s.status === "PUBLISHED" && !s.isDeleted,
  ).length;
  const draftCount = schedules.filter(
    (s) => s.status === "DRAFT" && !s.isDeleted,
  ).length;
  const totalBookedSlots = schedules.reduce(
    (acc, s) => acc + Math.max(0, s.totalSlots - s.availableSlots),
    0,
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Doctor Schedules
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor consultation time slots, publishing status, and booked
            patient capacity across all doctors.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSchedules}
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

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Schedules
            </CardTitle>
            <Layers className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta.total}</div>
            <p className="text-xs text-muted-foreground">
              All recorded consultation sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published (Current Page)
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCount}</div>
            <p className="text-xs text-muted-foreground">
              Live & open for patient booking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts (Current Page)
            </CardTitle>
            <FileClock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting doctor publication
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Booked Slots (Current Page)
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookedSlots}</div>
            <p className="text-xs text-muted-foreground">
              Confirmed patient time slots
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Table Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Schedule Directory</CardTitle>
              <CardDescription>
                Search by doctor name, email, or medical specialization.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctor or specialty..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Tabs
                value={statusFilter}
                onValueChange={(val) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
              >
                <TabsList>
                  <TabsTrigger value="ALL">All</TabsTrigger>
                  <TabsTrigger value="PUBLISHED">Published</TabsTrigger>
                  <TabsTrigger value="DRAFT">Draft</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Slot Capacity</TableHead>
                  <TableHead>Meeting Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-40 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading schedules...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : schedules.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-40 text-center text-muted-foreground"
                    >
                      No schedules found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  schedules.map((schedule) => {
                    const booked = Math.max(
                      0,
                      schedule.totalSlots - schedule.availableSlots,
                    );
                    const occupancyPercent =
                      schedule.totalSlots > 0
                        ? Math.round((booked / schedule.totalSlots) * 100)
                        : 0;

                    return (
                      <TableRow
                        key={schedule.id}
                        className={schedule.isDeleted ? "opacity-60" : ""}
                      >
                        {/* Doctor */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={schedule.doctor?.profilePhoto || ""}
                                alt={schedule.doctor?.name || "Doctor"}
                              />
                              <AvatarFallback>
                                {schedule.doctor?.name
                                  ?.slice(0, 2)
                                  .toUpperCase() || "DR"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {schedule.doctor?.name || "Unknown Doctor"}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {schedule.doctor?.specialization ||
                                  schedule.doctor?.email ||
                                  schedule.doctorId}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Date & Time */}
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm font-medium">
                              <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              {format(
                                new Date(schedule.startDateTime),
                                "dd MMM yyyy",
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              {format(
                                new Date(schedule.startDateTime),
                                "hh:mm a",
                              )}{" "}
                              –{" "}
                              {format(
                                new Date(schedule.endDateTime),
                                "hh:mm a",
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Slot Capacity */}
                        <TableCell>
                          <div className="w-36 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium">
                                {booked}/{schedule.totalSlots} booked
                              </span>
                              <span className="text-muted-foreground">
                                {schedule.availableSlots} left
                              </span>
                            </div>
                            <Progress
                              value={occupancyPercent}
                              className="h-1.5"
                            />
                          </div>
                        </TableCell>

                        {/* Meeting Link */}
                        <TableCell>
                          {schedule.meetingLink ? (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs text-primary"
                                asChild
                              >
                                <a
                                  href={schedule.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Video className="mr-1.5 h-3.5 w-3.5" />
                                  Join Link
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  handleCopyLink(
                                    schedule.id,
                                    schedule.meetingLink,
                                  )
                                }
                              >
                                {copiedId === schedule.id ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Not provided
                            </span>
                          )}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {schedule.status === "PUBLISHED" ? (
                              <Badge className="bg-emerald-600/15 text-emerald-700 hover:bg-emerald-600/20 dark:text-emerald-400">
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="secondary">Draft</Badge>
                            )}
                            {schedule.isDeleted && (
                              <Badge variant="destructive">Deleted</Badge>
                            )}
                          </div>
                        </TableCell>

                        {/* Action */}
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(schedule)}
                          >
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
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

      {/* Schedule Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Session Details</DialogTitle>
            <DialogDescription>
              Full session timeline, meeting access, and booked patient list.
            </DialogDescription>
          </DialogHeader>

          {selectedSchedule && (
            <div className="space-y-5">
              {/* Doctor & Status Summary */}
              <div className="flex flex-col justify-between gap-3 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {selectedSchedule.doctor?.name || "Doctor"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedSchedule.doctor?.specialization ||
                        selectedSchedule.doctor?.email}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    selectedSchedule.status === "PUBLISHED"
                      ? "default"
                      : "secondary"
                  }
                >
                  {selectedSchedule.status}
                </Badge>
              </div>

              {/* Time & Slots Grid */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Session Date</p>
                  <p className="mt-1 text-sm font-medium">
                    {format(
                      new Date(selectedSchedule.startDateTime),
                      "EEEE, dd MMM yyyy",
                    )}
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Time Window</p>
                  <p className="mt-1 text-sm font-medium">
                    {format(
                      new Date(selectedSchedule.startDateTime),
                      "hh:mm a",
                    )}{" "}
                    –{" "}
                    {format(new Date(selectedSchedule.endDateTime), "hh:mm a")}
                  </p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-xs text-muted-foreground">Slot Summary</p>
                  <p className="mt-1 text-sm font-medium">
                    {selectedSchedule.totalSlots -
                      selectedSchedule.availableSlots}{" "}
                    Booked / {selectedSchedule.totalSlots} Total (20m/slot)
                  </p>
                </div>
              </div>

              {/* Meeting URL */}
              {selectedSchedule.meetingLink && (
                <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <div className="flex items-center gap-2 truncate">
                    <Video className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate text-muted-foreground">
                      {selectedSchedule.meetingLink}
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCopyLink(
                          selectedSchedule.id,
                          selectedSchedule.meetingLink,
                        )
                      }
                    >
                      Copy
                    </Button>
                    <Button size="sm" asChild>
                      <a
                        href={selectedSchedule.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              {/* Booked Patients List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">
                    Booked Appointments (
                    {selectedSchedule.appointments?.length || 0})
                  </h4>
                  {detailsLoading && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>

                {!selectedSchedule.appointments ||
                selectedSchedule.appointments.length === 0 ? (
                  <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                    No patients have booked this schedule yet.
                  </div>
                ) : (
                  <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                    {selectedSchedule.appointments.map((apt, index) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between rounded-md border p-2.5 text-sm"
                      >
                        <div>
                          <p className="font-medium">
                            #{apt.serialNumber ?? index + 1}{" "}
                            {apt.patient?.name || "Patient"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {apt.patient?.email}{" "}
                            {apt.patient?.contactNumber
                              ? `• ${apt.patient.contactNumber}`
                              : ""}
                          </p>
                        </div>
                        {apt.status && (
                          <Badge variant="outline">{apt.status}</Badge>
                        )}
                      </div>
                    ))}
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
