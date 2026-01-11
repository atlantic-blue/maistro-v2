import type { ApiResponse, ApiError } from "@maistro/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { body, headers: customHeaders, ...restOptions } = options;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders as Record<string, string>,
    };

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    const config: RequestInit = {
      ...restOptions,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          code: data.code || "UNKNOWN_ERROR",
          message: data.message || "An unknown error occurred",
          details: data.details,
        };
        return { success: false, error };
      }

      return { success: true, data: data.data ?? data };
    } catch (error) {
      const apiError: ApiError = {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "Network error occurred",
      };
      return { success: false, error: apiError };
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  async patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
