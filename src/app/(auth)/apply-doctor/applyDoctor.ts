import { apiRequest } from "@/lib/api";

export interface IApplyDoctorFormValues {
  name: string;
  email: string;
  password?: string;
  contactNumber?: string;
  address?: string;
  licenseNumber: string;
  experienceYears?: number;
  specialization: string;
  consultationFee?: number;
  qualifications: string;
  bio?: string;
}

export interface IVerifyDoctorEmailPayload {
  email: string;
  otp: string;
}

// 1. Doctor Apply API
export const applyDoctorApi = async (
  values: IApplyDoctorFormValues,
  files: { resume?: File | null; additionalFiles?: File[] }
) => {
  if (!files?.resume) {
    throw new Error("Resume file is required");
  }

  const formData = new FormData();

  const dataPayload = {
    user: {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      password: values.password,
    },
    doctor: {
      licenseNumber: values.licenseNumber.trim(),
      specialization: values.specialization.trim(),
      qualifications: values.qualifications.trim(),
      experienceYears: values.experienceYears ? Number(values.experienceYears) : 0,
      consultationFee: values.consultationFee ? Number(values.consultationFee) : 0,
      address: values.address?.trim() || undefined,
      contactNumber: values.contactNumber?.trim() || undefined,
      bio: values.bio?.trim() || undefined,
    },
  };

  formData.append("data", JSON.stringify(dataPayload));
  formData.append("resume", files.resume);

  // Optional additional files
  if (files?.additionalFiles && files.additionalFiles.length > 0) {
    files.additionalFiles.forEach((file) => {
      formData.append("additionalFiles", file);
    });
  }

  return apiRequest("/doctor/apply-as-doctor", {
    method: "POST",
    body: formData,
  });
};

// 2. Email Verification API
export const verifyDoctorEmailApi = async (
  payload: IVerifyDoctorEmailPayload
) => {
  return apiRequest("/doctor/apply-as-doctor/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};