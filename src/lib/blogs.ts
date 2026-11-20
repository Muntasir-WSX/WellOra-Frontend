const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface BlogAuthor {
  id: string;
  name: string;
  email?: string;
  imageUrl?: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  category: string;
  coverImageUrl?: string | null;
  coverPublicId?: string | null;
  isPublished: boolean;
  authorId: string;
  author?: BlogAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface BlogMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  searchTerm?: string;
}

export interface UpsertBlogPayload {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  isPublished?: boolean;
  coverImage?: File | null;
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

// Public: Get Published Blogs
export async function getPublicBlogs(
  query: BlogQueryParams = {},
): Promise<{ data: BlogPost[]; meta: BlogMeta }> {
  const params = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? 9),
  });

  if (query.category && query.category !== "ALL") {
    params.append("category", query.category);
  }
  if (query.searchTerm?.trim()) {
    params.append("searchTerm", query.searchTerm.trim());
  }

  const res = await fetch(`${API_BASE_URL}/public/blogs?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to load blogs");
  }

  return {
    data: json.data || [],
    meta: json.meta || {
      page: query.page ?? 1,
      limit: query.limit ?? 9,
      total: 0,
      totalPages: 1,
    },
  };
}

// Public: Get Single Blog by Slug
export async function getSingleBlogBySlug(slug: string): Promise<BlogPost> {
  const res = await fetch(
    `${API_BASE_URL}/public/blogs/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Blog post not found");
  }

  return json.data;
}

// Admin: Get All Blogs (Published + Drafts)
export async function getAllBlogsForAdmin(
  query: BlogQueryParams = {},
): Promise<{ data: BlogPost[]; meta: BlogMeta }> {
  const params = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? 10),
  });

  if (query.searchTerm?.trim()) {
    params.append("searchTerm", query.searchTerm.trim());
  }

  const res = await fetch(
    `${API_BASE_URL}/public/blogs/admin/all?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
      headers: getAuthHeaders(),
    },
  );

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to load admin blogs");
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

// Admin: Create Blog (multipart/form-data for coverImage)
export async function createBlog(
  payload: UpsertBlogPayload,
): Promise<BlogPost> {
  const formData = new FormData();
  if (payload.title) formData.append("title", payload.title);
  if (payload.excerpt !== undefined)
    formData.append("excerpt", payload.excerpt);
  if (payload.content) formData.append("content", payload.content);
  if (payload.category) formData.append("category", payload.category);
  if (payload.isPublished !== undefined) {
    formData.append("isPublished", String(payload.isPublished));
  }
  if (payload.coverImage) {
    formData.append("coverImage", payload.coverImage);
  }

  const res = await fetch(`${API_BASE_URL}/public/blogs`, {
    method: "POST",
    credentials: "include",
    headers: getAuthHeaders(true),
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to create blog");
  }

  return json.data;
}

// Admin: Update Blog
export async function updateBlog(
  id: string,
  payload: UpsertBlogPayload,
): Promise<BlogPost> {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.excerpt !== undefined)
    formData.append("excerpt", payload.excerpt);
  if (payload.content !== undefined)
    formData.append("content", payload.content);
  if (payload.category !== undefined)
    formData.append("category", payload.category);
  if (payload.isPublished !== undefined) {
    formData.append("isPublished", String(payload.isPublished));
  }
  if (payload.coverImage) {
    formData.append("coverImage", payload.coverImage);
  }

  const res = await fetch(`${API_BASE_URL}/public/blogs/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: getAuthHeaders(true),
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to update blog");
  }

  return json.data;
}

// Admin: Delete Blog
export async function deleteBlog(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/public/blogs/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: getAuthHeaders(),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to delete blog");
  }
}
