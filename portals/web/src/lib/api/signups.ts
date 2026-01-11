import type {
  Signup,
  ApiResponse,
  PaginatedResponse,
} from "@maistro/types";
import { apiClient } from "./client";

export async function listSignups(
  projectId: string,
  params?: {
    limit?: number;
    cursor?: string;
  }
): Promise<ApiResponse<PaginatedResponse<Signup>>> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.cursor) searchParams.set("cursor", params.cursor);

  const query = searchParams.toString();
  const endpoint = query
    ? `/projects/${projectId}/signups?${query}`
    : `/projects/${projectId}/signups`;
  return apiClient.get<PaginatedResponse<Signup>>(endpoint);
}

export async function getSignup(
  projectId: string,
  signupId: string
): Promise<ApiResponse<Signup>> {
  return apiClient.get<Signup>(`/projects/${projectId}/signups/${signupId}`);
}

export async function exportSignups(
  projectId: string,
  format: "csv" | "json" = "csv"
): Promise<ApiResponse<{ downloadUrl: string }>> {
  return apiClient.get<{ downloadUrl: string }>(
    `/projects/${projectId}/signups/export?format=${format}`
  );
}
