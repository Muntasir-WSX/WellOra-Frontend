import { apiRequest } from "@/lib/api";

export type ScheduleStatusType = "DRAFT" | "PUBLISHED" | string;

export interface IScheduleAppointment {
  id: string;
  status: string;
  patient?: {
    id: string;
    name: string;
    email?: string;
    contactNumber?: string | null;
  };
}

export interface IDoctorSchedule {
  id: string;
  doctorId: string;
  startDateTime: string;
  endDateTime: string;
  meetingLink: string;
  totalSlots: number;
  availableSlots: number;
  status: ScheduleStatusType;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
  appointments?: IScheduleAppointment[];
}

export interface IScheduleQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ICreateScheduleInput {
  startDateTime: string;
  endDateTime: string;
  meetingLink: string;
}

export interface IUpdateScheduleInput {
  startDateTime?: string;
  endDateTime?: string;
  meetingLink?: string;
}

export const getMySchedulesApi = async (params: IScheduleQueryParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const queryStr = searchParams.toString();
  const res = await apiRequest<{
    data?: IDoctorSchedule[];
    meta?: { page: number; limit: number; total: number; totalPages: number };
  }>(`/schedule/my-schedules${queryStr ? `?${queryStr}` : ""}`, {
    method: "GET",
  });

  return {
    schedules: (Array.isArray(res?.data) ? res.data : []) as IDoctorSchedule[],
    meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
};

export const createScheduleApi = async (payload: ICreateScheduleInput) => {
  return apiRequest<{
    success?: boolean;
    message?: string;
    data: IDoctorSchedule;
  }>("/schedule/create-schedule", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateScheduleApi = async (
  scheduleId: string,
  payload: IUpdateScheduleInput,
) => {
  return apiRequest<{
    success?: boolean;
    message?: string;
    data: IDoctorSchedule;
  }>(`/schedule/update-schedule/${encodeURIComponent(scheduleId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const publishScheduleApi = async (scheduleId: string) => {
  return apiRequest<{
    success?: boolean;
    message?: string;
    data: IDoctorSchedule;
  }>(`/schedule/publish-schedule/${encodeURIComponent(scheduleId)}`, {
    method: "PATCH",
  });
};

export const deleteScheduleApi = async (scheduleId: string) => {
  return apiRequest<{
    success?: boolean;
    message?: string;
    data: IDoctorSchedule;
  }>(`/schedule/${encodeURIComponent(scheduleId)}`, {
    method: "DELETE",
  });
};