import type {
  LandingPage,
  ApiResponse,
  UpdateLandingPageInput,
} from "@maistro/types";
import { apiClient } from "./client";

export interface GenerateLandingPageInput {
  projectId: string;
  regenerate?: boolean;
}

export async function getLandingPage(
  projectId: string
): Promise<ApiResponse<LandingPage>> {
  return apiClient.get<LandingPage>(`/projects/${projectId}/landing-page`);
}

export async function generateLandingPage(
  input: GenerateLandingPageInput
): Promise<ApiResponse<LandingPage>> {
  return apiClient.post<LandingPage>(
    `/projects/${input.projectId}/landing-page/generate`,
    { regenerate: input.regenerate }
  );
}

export async function updateLandingPage(
  projectId: string,
  input: UpdateLandingPageInput
): Promise<ApiResponse<LandingPage>> {
  return apiClient.patch<LandingPage>(
    `/projects/${projectId}/landing-page`,
    input
  );
}

export async function previewLandingPage(
  projectId: string
): Promise<ApiResponse<{ html: string; previewUrl: string }>> {
  return apiClient.get<{ html: string; previewUrl: string }>(
    `/projects/${projectId}/landing-page/preview`
  );
}
