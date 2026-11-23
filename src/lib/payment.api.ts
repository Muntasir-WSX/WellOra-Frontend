import { apiRequest } from "@/lib/api";

export type PaymentStatusType = "PAID" | "UNPAID" | "REFUNDED" | "FAILED" | string;

export interface IPaymentRecord {
  id: string;
  appointmentId: string;
  amount: number | string;
  transactionId?: string | null;
  status: PaymentStatusType;
  paymentGatewayData?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt?: string;
  appointment?: {
    id: string;
    status: string;
    doctor?: {
      id: string;
      name: string;
      specialization: string;
    };
    patient?: {
      id: string;
      name: string;
      email: string;
      userId: string;
    };
    schedule?: {
      id: string;
      startDateTime: string;
      endDateTime: string;
    };
  };
}

export interface IPaymentQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  patientEmail?: string;
}

export const getMyPaymentsApi = async (params: IPaymentQueryParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const queryStr = searchParams.toString();
  const res = await apiRequest<{
    data?: IPaymentRecord[];
    meta?: { page: number; limit: number; total: number; totalPages: number };
  }>(`/payment/my-payments${queryStr ? `?${queryStr}` : ""}`, {
    method: "GET",
  });

  return {
    payments: (Array.isArray(res?.data) ? res.data : []) as IPaymentRecord[],
    meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
};

export const getDoctorPaymentsApi = async (params: IPaymentQueryParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

  const queryStr = searchParams.toString();
  const res = await apiRequest<{
    data?: IPaymentRecord[];
    meta?: { page: number; limit: number; total: number; totalPages: number };
  }>(`/payment/doctor-payments${queryStr ? `?${queryStr}` : ""}`, {
    method: "GET",
  });

  return {
    payments: (Array.isArray(res?.data) ? res.data : []) as IPaymentRecord[],
    meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
};

export const getAllPaymentsAdminApi = async (
  params: IPaymentQueryParams = {},
) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);
  if (params.status) searchParams.set("status", params.status);
  if (params.patientEmail) {
    searchParams.set("patientEmail", params.patientEmail);
  }

  const queryStr = searchParams.toString();
  const res = await apiRequest<{
    data?: IPaymentRecord[];
    meta?: { page: number; limit: number; total: number; totalPages: number };
  }>(`/payment/all-payments${queryStr ? `?${queryStr}` : ""}`, {
    method: "GET",
  });

  return {
    payments: (Array.isArray(res?.data) ? res.data : []) as IPaymentRecord[],
    meta: res?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
  };
};

export const getSinglePaymentApi = async (
  paymentId: string,
): Promise<IPaymentRecord> => {
  const res = await apiRequest<{
    success?: boolean;
    message?: string;
    data: IPaymentRecord;
  }>(`/payment/${encodeURIComponent(paymentId)}`, {
    method: "GET",
  });

  if (!res?.data) {
    throw new Error(res?.message || "Payment details not found");
  }

  return res.data;
};