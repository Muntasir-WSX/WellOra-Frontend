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
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const response = await fetch(`${backendUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed. Please check your inputs.");
  }

  return data;
};

export const verifyPatientEmailApi = async (payload: IVerifyEmailPayload) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const response = await fetch(`${backendUrl}/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include", // AccessToken & RefreshToken কুকি সেভ করার জন্য
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "OTP verification failed.");
  }

  return data;
};