const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const NEWSLETTER_ENDPOINT = `${API_BASE_URL}/newsletter`;

export interface NewsletterSubscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface NewsletterMeta {
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

// Public: Post Subscription
export async function subscribeNewsletter(
  email: string,
): Promise<NewsletterSubscriber> {
  const res = await fetch(`${NEWSLETTER_ENDPOINT}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to subscribe to newsletter");
  }

  return json.data;
}

// Admin: Get Subscribers List
export async function getNewsletterSubscribers(
  query: {
    page?: number;
    limit?: number;
    searchTerm?: string;
  } = {},
): Promise<{ data: NewsletterSubscriber[]; meta: NewsletterMeta }> {
  const params = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? 15),
  });

  if (query.searchTerm?.trim()) {
    params.append("searchTerm", query.searchTerm.trim());
  }

  const res = await fetch(
    `${NEWSLETTER_ENDPOINT}/subscribers?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders(),
    },
  );

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to load newsletter subscribers");
  }

  return {
    data: json.data || [],
    meta: json.meta || {
      page: query.page ?? 1,
      limit: query.limit ?? 15,
      total: 0,
      totalPages: 1,
    },
  };
}