const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

const apiBaseUrl = (configuredApiUrl || "http://localhost:5000")
  .replace(/\/+$/, "")
  .replace(/\/api\/v1$/, "");

export interface ApiResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}

export async function apiRequest<T = ApiResponse>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}/api/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    credentials: init.credentials || "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : "The request could not be completed.";

    throw new Error(message);
  }

  return data as T;
}
