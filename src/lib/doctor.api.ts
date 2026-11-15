import { apiRequest } from "@/lib/api";

export type DoctorVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

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
  const res = await apiRequest(
    `/doctor/all-doctors${queryStr ? `?${queryStr}` : ""}`,
    {
      method: "GET",
    }
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