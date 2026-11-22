import { apiRequest } from "@/lib/api";

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
  }>(
    `/doctor/all-doctors${queryStr ? `?${queryStr}` : ""}`,
    {
      method: "GET",
    },
  );

  return {
    doctors: (Array.isArray(res?.data) ? res.data : []) as IDoctorApplication[],
    meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
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
    // Try the doctor list when the dedicated route is unavailable.
  }

  const fallback = await getAllDoctorsAdminApi({ limit: 100 });
  const found = fallback.doctors.find((doc) => doc.id === doctorId);
  if (!found) {
    throw new Error("Doctor profile not found");
  }
  return found;
};

export const getDoctorSchedulesApi = async (
  doctorId: string,
): Promise<IDoctorScheduleSlot[]> => {
  try {
    const res = await apiRequest<{ data?: IDoctorScheduleSlot[] }>(
      `/doctor-schedule?doctorId=${encodeURIComponent(doctorId)}`,
      {
        method: "GET",
      },
    );
    if (Array.isArray(res?.data)) return res.data;
  } catch {
    // Try the alternate schedule route.
    const altRes = await apiRequest<{ data?: IDoctorScheduleSlot[] }>(
      `/schedule?doctorId=${encodeURIComponent(doctorId)}`,
      {
        method: "GET",
      },
    ).catch(() => null);
    if (Array.isArray(altRes?.data)) return altRes.data;
  }

  return [];
};

export const bookAppointmentApi = async (payload: {
  doctorId: string;
  scheduleId: string;
}) => {
  return apiRequest<{
    data?: {
      paymentUrl?: string;
      GatewayPageURL?: string;
    };
    paymentUrl?: string;
  }>("/appointment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};