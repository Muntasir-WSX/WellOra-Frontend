const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface PaymentItem {
  id: string;
  merchantInvoiceNumber: string;
  appointmentId: string;
  amount: string | number;
  status: PaymentStatus;
  bkashPaymentId?: string | null;
  bkashTrxId?: string | null;
  payerReference?: string | null;
  paidAt?: string | null;
  refundTrxId?: string | null;
  refundAmount?: string | number | null;
  refundReason?: string | null;
  refundedAt?: string | null;
  gatewayResponse?: Record<string, any> | null;
  createdAt: string;
  appointment?: {
    id: string;
    type?: string;
    status?: string;
    serialNumber?: number | null;
    patient?: {
      id: string;
      name: string;
      email: string;
    };
    doctor?: {
      id: string;
      name: string;
      specialization?: string;
    };
    schedule?: {
      startDateTime: string;
      endDateTime: string;
    };
  };
}

export interface PaymentMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetPaymentsQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  patientEmail?: string;
  status?: string;
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

export async function getAllPayments(
  query: GetPaymentsQuery = {},
): Promise<{ data: PaymentItem[]; meta: PaymentMeta }> {
  const params = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? 10),
    sortBy: query.sortBy ?? "createdAt",
    sortOrder: query.sortOrder ?? "desc",
  });

  if (query.patientEmail) {
    params.append("patientEmail", query.patientEmail);
  }
  if (query.status && query.status !== "ALL") {
    params.append("status", query.status);
  }

  const res = await fetch(
    `${API_BASE_URL}/payment/all-payments?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders(),
    },
  );

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to load payments");
  }

  return {
    data: json.data || [],
    meta: json.meta || {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      total: 0,
      totalPages: 1,
    },
  };
}

export async function getMyPayments(
  query: GetPaymentsQuery = {},
): Promise<{ data: PaymentItem[]; meta: PaymentMeta }> {
  const params = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? 10),
    sortBy: query.sortBy ?? "createdAt",
    sortOrder: query.sortOrder ?? "desc",
  });

  const res = await fetch(
    `${API_BASE_URL}/payment/my-payments?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders(),
    },
  );

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to load your payments");
  }

  return {
    data: json.data || [],
    meta: json.meta || {
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      total: 0,
      totalPages: 1,
    },
  };
}

export async function getSinglePayment(paymentId: string): Promise<PaymentItem> {
  const res = await fetch(`${API_BASE_URL}/payment/${paymentId}`, {
    method: "GET",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch payment details");
  }

  return json.data;
}