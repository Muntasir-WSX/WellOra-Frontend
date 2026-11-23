import { apiRequest } from "@/lib/api";

export type AppointmentStatusType =
  | "PENDING"
  | "CONFIRMED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED"
  | string;

export type AppointmentType = "ONLINE" | "IN_PERSON";

export interface IAppointmentRecord {
  id: string;
  type: AppointmentType;
  status: AppointmentStatusType;
  serialNumber?: number | null;
  joiningTime?: string | null;
  createdAt: string;
  updatedAt?: string;
  doctor?: {
    id: string;
    name: string;
    specialization: string;
    userId?: string;
  };
  patient?: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string | null;
    userId?: string;
  };
  schedule?: {
    id: string;
    startDateTime: string;
    endDateTime: string;
    meetingLink: string;
    status: string;
  };
  payment?: {
    id: string;
    amount: number | string;
    status: string;
    bkashTrxId?: string | null;
    refundAmount?: number | string | null;
    refundTrxId?: string | null;
    paidAt?: string | null;
  } | null;
}

export interface IAppointmentQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  doctorId?: string;
  patientId?: string;
  doctorEmail?: string;
  patientEmail?: string;
}

export const getMyAppointmentsApi = async (
  params: IAppointmentQueryParams = {},
) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const queryStr = searchParams.toString();
  const res = await apiRequest<{
    data?: IAppointmentRecord[];
    meta?: { page: number; limit: number; total: number; totalPages: number };
  }>(`/appointment/my-appointments${queryStr ? `?${queryStr}` : ""}`, {
    method: "GET",
  });

  return {
    appointments: (Array.isArray(res?.data)
      ? res.data
      : []) as IAppointmentRecord[],
    meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
};

export const getDoctorAppointmentsApi = async (
  params: IAppointmentQueryParams = {},
) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const queryStr = searchParams.toString();
  const res = await apiRequest<{
    data?: IAppointmentRecord[];
    meta?: { page: number; limit: number; total: number; totalPages: number };
  }>(`/appointment/doctor-appointments${queryStr ? `?${queryStr}` : ""}`, {
    method: "GET",
  });

  return {
    appointments: (Array.isArray(res?.data)
      ? res.data
      : []) as IAppointmentRecord[],
    meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
};

export const getAllAppointmentsAdminApi = async (
  params: IAppointmentQueryParams = {},
) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status) searchParams.set("status", params.status);
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  if (params.doctorEmail) searchParams.set("doctorEmail", params.doctorEmail);
  if (params.patientEmail) {
    searchParams.set("patientEmail", params.patientEmail);
  }

  const queryStr = searchParams.toString();
  const res = await apiRequest<{
    data?: IAppointmentRecord[];
    meta?: { page: number; limit: number; total: number; totalPages: number };
  }>(`/appointment/all-appointments${queryStr ? `?${queryStr}` : ""}`, {
    method: "GET",
  });

  return {
    appointments: (Array.isArray(res?.data)
      ? res.data
      : []) as IAppointmentRecord[],
    meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
};

export const getSingleAppointmentApi = async (
  appointmentId: string,
): Promise<IAppointmentRecord> => {
  const res = await apiRequest<{
    success?: boolean;
    message?: string;
    data: IAppointmentRecord;
  }>(`/appointment/${encodeURIComponent(appointmentId)}`, {
    method: "GET",
  });

  if (!res?.data) {
    throw new Error(res?.message || "Appointment details not found");
  }

  return res.data;
};

export const payPendingAppointmentApi = async (appointmentId: string) => {
  return apiRequest<{
    success?: boolean;
    message?: string;
    data?: { paymentUrl?: string };
  }>("/appointment/pay-appointment", {
    method: "POST",
    body: JSON.stringify({ appointmentId }),
  });
};

export const cancelAppointmentApi = async (appointmentId: string) => {
  return apiRequest<{
    success?: boolean;
    message?: string;
    data?: {
      appointment?: IAppointmentRecord;
      payment?: { status?: string; refundAmount?: string | number };
    };
  }>("/appointment/cancel-appointment", {
    method: "POST",
    body: JSON.stringify({ appointmentId }),
  });
};

export const updateAppointmentStatusApi = async (
  appointmentId: string,
  status: "ONGOING" | "COMPLETED",
) => {
  return apiRequest<{
    success?: boolean;
    message?: string;
    data?: IAppointmentRecord;
  }>(`/appointment/update-status/${encodeURIComponent(appointmentId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};