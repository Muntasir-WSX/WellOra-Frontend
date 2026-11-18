const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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

const getAuthHeaders = (isFormData = false): HeadersInit => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || localStorage.getItem("token")
      : null;

  return {
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function getMyProfile(): Promise<UserProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/user/my-profile`, {
    method: "GET",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch profile");
  }

  return json.data;
}

export async function updateMyProfile(
  payload: UpdateMyProfilePayload,
): Promise<UserProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/user/update-my-profile`, {
    method: "PATCH",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update profile");
  }

  return json.data;
}

export async function uploadMyProfileImage(
  file: File,
): Promise<UserProfileResponse> {
  const formData = new FormData();
  formData.append("profileImage", file);

  const res = await fetch(`${API_BASE_URL}/user/profile-image`, {
    method: "PATCH",
    credentials: "include",
    headers: getAuthHeaders(true),
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Image upload failed");
  }

  return json.data;
}