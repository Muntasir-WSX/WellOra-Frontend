import { apiRequest } from "@/lib/api";

export interface IApplyDoctorPayload {
  name: string;
  email: string;
  password: string;
  doctor: {
    contactNumber?: string;
    address?: string;
    registrationNumber: string;
    experience?: number;
    gender?: "MALE" | "FEMALE" | "OTHER";
    appointmentFee: number;
    qualification: string;
    designation: string;
    currentWorkingPlace?: string;
    about?: string;
    departmentId?: string;
  };
}

export interface IVerifyDoctorEmailPayload {
  email: string;
  otp: string;
}

export const applyDoctorApi = async (payload: IApplyDoctorPayload) => {
  return apiRequest("/auth/register-doctor", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const verifyDoctorEmailApi = async (
  payload: IVerifyDoctorEmailPayload,
) => {
  return apiRequest("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
