import { apiRequest } from "@/lib/api";

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  email: string;
  newPassword: string;
  otp: string;
}

export const forgotPasswordApi = async (payload: IForgotPasswordPayload) => {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const resetPasswordApi = async (payload: IResetPasswordPayload) => {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
