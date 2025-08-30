import { ApiResponse } from "../types/types";


export async function fetchRecipes({
  search = "",
  page = 1,
  limit = 10,
  sort = "newest",
  tag = "",
}: {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  tag?: string;
}): Promise<ApiResponse> {
    
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (sort) params.set("sort", sort);
  if (tag) params.set("tag", tag);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = baseUrl
    ? `${baseUrl}/api/recipes?${params.toString()}`
    : `/api/recipes?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch recipes: ${res.status} ${text}`);
  }

  return res.json();
}
