import { ApiResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://new.etrolley.net";
export const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || "elegant2-fashion";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  token?: string;
  lang?: "en" | "ar";
}

/**
 * Universal safe API client
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, token, lang = "en", headers: customHeaders, ...restOptions } = options;

  let cleanEndpoint = endpoint.startsWith("http")
    ? endpoint.replace(/^https?:\/\/[^/]+\/?/, "")
    : endpoint.startsWith("/")
    ? endpoint.slice(1)
    : endpoint;

  let url = typeof window !== "undefined"
    ? `/api/proxy/${cleanEndpoint}`
    : `${BASE_URL}/${cleanEndpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  // Get stored bearer token from localStorage if on client and not provided
  let authToken = token;
  if (!authToken && typeof window !== "undefined") {
    authToken = localStorage.getItem("etrolley_auth_token") || undefined;
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": lang,
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(customHeaders as Record<string, string>),
  };

  if (
    !(restOptions.body instanceof FormData) &&
    !(restOptions.body instanceof URLSearchParams) &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  try {
    const res = await fetch(url, {
      ...restOptions,
      headers,
    });

    if (!res.ok) {
      let errorBody: any = null;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = await res.text();
      }
      throw new ApiError(
        errorBody?.message || `Request failed with status ${res.status}`,
        res.status,
        errorBody
      );
    }

    return (await res.json()) as T;
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error?.message || "Network error occurred", 500);
  }
}

export { BASE_URL };
