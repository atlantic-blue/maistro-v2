import type {
  Project,
  ApiResponse,
  CreateProjectInput,
  UpdateProjectInput,
  PaginatedResponse,
} from "@maistro/types";
import { apiClient } from "./client";

export async function createProject(
  input: CreateProjectInput
): Promise<ApiResponse<Project>> {
  return apiClient.post<Project>("/projects", input);
}

export async function getProject(
  projectId: string
): Promise<ApiResponse<Project>> {
  return apiClient.get<Project>(`/projects/${projectId}`);
}

export async function listProjects(
  params?: {
    limit?: number;
    cursor?: string;
    status?: Project["status"];
  }
): Promise<ApiResponse<PaginatedResponse<Project>>> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set("limit", params.limit.toString());
  if (params?.cursor) searchParams.set("cursor", params.cursor);
  if (params?.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  const endpoint = query ? `/projects?${query}` : "/projects";
  return apiClient.get<PaginatedResponse<Project>>(endpoint);
}

export async function updateProject(
  projectId: string,
  input: UpdateProjectInput
): Promise<ApiResponse<Project>> {
  return apiClient.patch<Project>(`/projects/${projectId}`, input);
}

export async function deleteProject(
  projectId: string
): Promise<ApiResponse<void>> {
  return apiClient.delete<void>(`/projects/${projectId}`);
}

export async function publishProject(
  projectId: string
): Promise<ApiResponse<Project>> {
  return apiClient.post<Project>(`/projects/${projectId}/publish`);
}

export async function unpublishProject(
  projectId: string
): Promise<ApiResponse<Project>> {
  return apiClient.post<Project>(`/projects/${projectId}/unpublish`);
}
