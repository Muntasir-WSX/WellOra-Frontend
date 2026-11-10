export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  email: string;
  newPassword: string;
  otp: string;
}

export const forgotPasswordApi = async (payload: IForgotPasswordPayload) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const response = await fetch(`${backendUrl}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send reset OTP. Please try again.");
  }

  return data;
};

export const resetPasswordApi = async (payload: IResetPasswordPayload) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const response = await fetch(`${backendUrl}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reset password. Check your OTP or password requirements.");
  }

  return data;
};