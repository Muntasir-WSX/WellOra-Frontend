const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";
  status?: "ACTIVE" | "BLOCKED" | "BANNED" | "INACTIVE";
  isBanned?: boolean;
  imageUrl?: string | null;
  createdAt: string;
  doctor?: {
    id: string;
    designation?: string | null;
    department?: { name: string } | null;
  } | null;
  patient?: {
    id: string;
    contactNumber?: string | null;
  } | null;
}

export interface UserMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const getAuthHeaders = (): HeadersInit => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || localStorage.getItem("token")
      : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function getAllUsersForAdmin(query: {
  page?: number;
  limit?: number;
  role?: string;
  searchTerm?: string;
} = {}): Promise<{ data: AdminUserItem[]; meta: UserMeta }> {
  const params = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? 12),
  });

  if (query.role && query.role !== "ALL") {
    params.append("role", query.role);
  }
  if (query.searchTerm?.trim()) {
    params.append("searchTerm", query.searchTerm.trim());
  }

  const res = await fetch(`${API_BASE_URL}/user?${params.toString()}`, {
    method: "GET",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to load users");
  }

  return {
    data: json.data || [],
    meta: json.meta || {
      page: query.page ?? 1,
      limit: query.limit ?? 12,
      total: 0,
      totalPages: 1,
    },
  };
}

export async function toggleUserBan(
  id: string,
  currentlyBanned: boolean,
): Promise<AdminUserItem> {
  const res = await fetch(`${API_BASE_URL}/user/${id}/ban`, {
    method: "PATCH",
    credentials: "include",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      isBanned: !currentlyBanned,
      status: !currentlyBanned ? "BLOCKED" : "ACTIVE",
    }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update user status");
  }

  return json.data;
}

export async function deleteUserByAdmin(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/user/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to delete user");
  }
}