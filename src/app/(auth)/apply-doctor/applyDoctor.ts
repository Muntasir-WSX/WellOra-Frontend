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
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const response = await fetch(`${backendUrl}/auth/register-doctor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Doctor application failed. Please check your data.");
  }

  return data;
};

export const verifyDoctorEmailApi = async (payload: IVerifyDoctorEmailPayload) => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const response = await fetch(`${backendUrl}/auth/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "OTP verification failed.");
  }

  return data;
};