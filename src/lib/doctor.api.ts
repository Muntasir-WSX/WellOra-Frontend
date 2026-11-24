import { apiRequest } from "@/lib/api";
import type { IDoctorSchedule } from "@/lib/schedule.api";

export type DoctorVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface IDoctorScheduleSlot {
  id: string;
  doctorId: string;
  scheduleId?: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  schedule?: {
    id: string;
    startDateTime: string;
    endDateTime: string;
  };
}

export interface IDoctorApplication {
  id: string;
  userId: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  bio?: string | null;
  consultationFee?: number | null;
  contactNumber?: string | null;
  address?: string | null;
  resume: string;
  additionalFiles?: Array<{ url: string; publicId: string }>;
  verificationStatus: DoctorVerificationStatus;
  rejectionReason?: string | null;
  createdAt: string;
  department?: {
    id: string;
    name: string;
    slug?: string;
  };
  user?: {
    id: string;
    emailVerified: boolean;
    status?: string;
  };
}

export interface ITodaysScheduleSlot {
  id: string;
  startDateTime: string;
  endDateTime: string;
  availableSlots: number;
  totalSlots: number;
}

export interface IAvailableTodayDoctor {
  id: string;
  name: string;
  profilePhoto?: string | null;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  bio?: string | null;
  consultationFee?: number | string | null;
  createdAt: string;
  department?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  schedules: ITodaysScheduleSlot[];
}

export interface IAvailableTodayQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  departmentId?: string;
  specialization?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}



export interface IDoctorDetails extends IDoctorApplication {
  doctorSchedules?: IDoctorScheduleSlot[];
}

export interface IDoctorQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  verificationStatus?: DoctorVerificationStatus | "";
  departmentId?: string;
}

export const getAllDoctorsAdminApi = async (params: IDoctorQueryParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.searchTerm?.trim()) {
    searchParams.set("searchTerm", params.searchTerm.trim());
  }
  if (params.verificationStatus) {
    searchParams.set("verificationStatus", params.verificationStatus);
  }
  if (params.departmentId) {
    searchParams.set("departmentId", params.departmentId);
  }

  const queryStr = searchParams.toString();
  const res = await apiRequest<{
    data?: IDoctorApplication[];
    meta?: { page: number; limit: number; total: number; totalPages: number };
  }>(`/doctor/all-doctors${queryStr ? `?${queryStr}` : ""}`, {
    method: "GET",
  });

  return {
    doctors: (Array.isArray(res?.data) ? res.data : []) as IDoctorApplication[],
    meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
};

export const getPublicDoctorsApi = async (params: IDoctorQueryParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.searchTerm?.trim()) {
    searchParams.set("searchTerm", params.searchTerm.trim());
  }
  if (params.departmentId) {
    searchParams.set("departmentId", params.departmentId);
  }

  const queryStr = searchParams.toString();
  const publicEndpoints = [
    `/doctor/public/all-doctors${queryStr ? `?${queryStr}` : ""}`,
    `/doctor${queryStr ? `?${queryStr}` : ""}`,
    `/doctor/public${queryStr ? `?${queryStr}` : ""}`,
    `/doctor/approved${queryStr ? `?${queryStr}` : ""}`,
  ];

  for (const endpoint of publicEndpoints) {
    try {
      const res = await apiRequest<{
        data?: IDoctorApplication[];
        meta?: { page: number; limit: number; total: number; totalPages: number };
      }>(endpoint, {
        method: "GET",
        skipAuth: true,
      });

      if (Array.isArray(res?.data)) {
        const approvedDoctors = res.data.filter(
          (doc) =>
            !doc.verificationStatus || doc.verificationStatus === "APPROVED",
        );

        return {
          doctors: approvedDoctors,
          meta: res?.meta || {
            page: params.page || 1,
            limit: params.limit || 9,
            total: approvedDoctors.length,
            totalPages: 1,
          },
        };
      }
    } catch {
      // Try the next candidate endpoint.
    }
  }

  return {
    doctors: [] as IDoctorApplication[],
    meta: { page: 1, limit: params.limit || 9, total: 0, totalPages: 1 },
  };
};

export const reviewDoctorApplicationApi = async (payload: {
  doctorId: string;
  verificationStatus: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}) => {
  return apiRequest("/doctor/approve-doctor", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getSingleDoctorApi = async (
  doctorId: string,
): Promise<IDoctorDetails> => {
  try {
    const res = await apiRequest<{
      data?: IDoctorDetails | { doctor?: IDoctorDetails };
    }>(`/doctor/${encodeURIComponent(doctorId)}`, {
      method: "GET",
    });
    if (res?.data) {
      const payload = res.data;
      const doctor =
        "doctor" in payload && payload.doctor
          ? payload.doctor
          : (payload as IDoctorDetails);
      if (doctor?.id) return doctor;
    }
  } catch {
    // Fallback to public doctor list
  }

  const fallback = await getPublicDoctorsApi({ limit: 100 });
  const found = fallback.doctors.find((doc) => doc.id === doctorId);
  if (!found) {
    throw new Error("Doctor profile not found");
  }
  return found;
};

export const getDoctorSchedulesApi = async (
  doctorId: string,
): Promise<IDoctorSchedule[]> => {
  const res = await apiRequest<{ data?: IDoctorSchedule[] }>(
    `/schedule/todays-schedule?doctorId=${encodeURIComponent(doctorId)}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
  return Array.isArray(res?.data) ? res.data : [];
};

export const getAvailableDoctorsTodayApi = async (
  params: IAvailableTodayQueryParams = {},
) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.searchTerm) searchParams.set("searchTerm", params.searchTerm);
  if (params.departmentId) {
    searchParams.set("departmentId", params.departmentId);
  }
  if (params.specialization) {
    searchParams.set("specialization", params.specialization);
  }
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const queryStr = searchParams.toString();
  const res = await apiRequest<{
    data?: IAvailableTodayDoctor[];
    meta?: { page: number; limit: number; total: number; totalPages: number };
  }>(`/doctor/public/available-today${queryStr ? `?${queryStr}` : ""}`, {
    method: "GET",
    skipAuth: true,
    cache: "no-store",
  });

  return {
    doctors: (Array.isArray(res?.data)
      ? res.data
      : []) as IAvailableTodayDoctor[],
    meta: res?.meta || { page: 1, limit: 9, total: 0, totalPages: 1 },
  };
};

