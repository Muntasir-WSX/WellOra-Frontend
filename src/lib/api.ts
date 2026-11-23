const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

const normalizedUrl = rawBaseUrl.replace(/\/+$/, "");
const BASE_URL = normalizedUrl.endsWith("/api/v1")
  ? normalizedUrl
  : `${normalizedUrl}/api/v1`;

export interface ApiRequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { skipAuth = false, headers: customHeaders, ...fetchOptions } = options;
  const isFormData = fetchOptions.body instanceof FormData;

  const token =
    !skipAuth && typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || localStorage.getItem("token")
      : null;

  const headers: Record<string, string> = {
    ...(customHeaders as Record<string, string>),
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    credentials: skipAuth ? "omit" : "include",
    headers,
  });

  const responseText = await res.text();
  const data = responseText ? JSON.parse(responseText) : null;

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
}