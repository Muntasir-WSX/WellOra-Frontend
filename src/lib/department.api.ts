import { apiRequest } from "@/lib/api";

export interface IDepartment {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  _count?: {
    doctors: number;
  };
}

export interface IDepartmentPayload {
  name: string;
  description?: string;
  imageUrl?: string;
}

export const getDepartmentsApi = async (): Promise<IDepartment[]> => {
  const res = await apiRequest<{ success?: boolean; data?: IDepartment[] }>(
    "/department",
    {
    method: "GET",
    },
  );
  return Array.isArray(res?.data) ? res.data : [];
};

export const createDepartmentApi = async (payload: IDepartmentPayload) => {
  const cleanPayload: IDepartmentPayload = {
    name: payload.name.trim(),
    ...(payload.description?.trim() && {
      description: payload.description.trim(),
    }),
    ...(payload.imageUrl?.trim() && { imageUrl: payload.imageUrl.trim() }),
  };

  return apiRequest("/department", {
    method: "POST",
    body: JSON.stringify(cleanPayload),
  });
};

export const updateDepartmentApi = async (
  departmentId: string,
  payload: Partial<IDepartmentPayload>
) => {
  const cleanPayload: Partial<IDepartmentPayload> = {};
  if (payload.name !== undefined) cleanPayload.name = payload.name.trim();
  if (payload.description !== undefined && payload.description.trim()) {
    cleanPayload.description = payload.description.trim();
  }
  if (payload.imageUrl !== undefined && payload.imageUrl.trim()) {
    cleanPayload.imageUrl = payload.imageUrl.trim();
  }

  return apiRequest(`/department/${departmentId}`, {
    method: "PATCH",
    body: JSON.stringify(cleanPayload),
  });
};

export const deleteDepartmentApi = async (departmentId: string) => {
  return apiRequest(`/department/${departmentId}`, {
    method: "DELETE",
  });
};