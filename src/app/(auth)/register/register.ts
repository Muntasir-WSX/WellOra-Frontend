import { apiRequest } from "@/lib/api";

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  patient?: {
    contactNumber?: string;
    address?: string;
    gender?: "MALE" | "FEMALE" | "OTHER";
    dateOfBirth?: string;
    bloodGroup?:
      | "A_POSITIVE"
      | "A_NEGATIVE"
      | "B_POSITIVE"
      | "B_NEGATIVE"
      | "AB_POSITIVE"
      | "AB_NEGATIVE"
      | "O_POSITIVE"
      | "O_NEGATIVE";
  };
}

export interface IVerifyEmailPayload {
  email: string;
  otp: string;
}

export const registerPatientApi = async (payload: IRegisterPayload) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const verifyPatientEmailApi = async (payload: IVerifyEmailPayload) => {
  return apiRequest("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
