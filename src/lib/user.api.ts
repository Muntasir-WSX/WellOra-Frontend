import { apiRequest } from "@/lib/api";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export const BLOOD_GROUPS: { value: BloodGroup; label: string }[] = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
];

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";
  imageUrl?: string | null;
  doctor?: {
    id: string;
    name: string;
    contactNumber?: string | null;
    address?: string | null;
    gender?: Gender | null;
    qualifications?: string | null;
    experienceYears?: number | null;
    consultationFee?: number | null;
    bio?: string | null;
    profilePhoto?: string | null;
    department?: {
      id: string;
      name: string;
    } | null;
  } | null;
  patient?: {
    id: string;
    name: string;
    contactNumber?: string | null;
    address?: string | null;
    gender?: Gender | null;
    bloodGroup?: BloodGroup | null;
    dateOfBirth?: string | null;
    profilePhoto?: string | null;
  } | null;
}

export interface UpdateMyProfilePayload {
  name?: string;
  contactNumber?: string;
  address?: string;
  gender?: Gender;
  dateOfBirth?: string;
  bloodGroup?: BloodGroup;
  qualifications?: string;
  experienceYears?: number;
  consultationFee?: number;
  bio?: string;
}

export async function getMyProfile(): Promise<UserProfileResponse> {
  const json = await apiRequest<{
    success?: boolean;
    message?: string;
    data: UserProfileResponse;
  }>("/user/my-profile", {
    method: "GET",
  });

  if (!json?.data) {
    throw new Error(json?.message || "Failed to fetch profile");
  }

  return json.data;
}

export async function updateMyProfile(
  payload: UpdateMyProfilePayload,
): Promise<UserProfileResponse> {
  const json = await apiRequest<{
    success?: boolean;
    message?: string;
    data: UserProfileResponse;
  }>("/user/update-my-profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!json?.data) {
    throw new Error(json?.message || "Failed to update profile");
  }

  return json.data;
}

export async function uploadMyProfileImage(
  file: File,
): Promise<UserProfileResponse> {
  const formData = new FormData();
  formData.append("profileImage", file);

  const json = await apiRequest<{
    success?: boolean;
    message?: string;
    data: UserProfileResponse;
  }>("/user/profile-image", {
    method: "PATCH",
    body: formData,
  });

  if (!json?.data) {
    throw new Error(json?.message || "Image upload failed");
  }

  return json.data;
}