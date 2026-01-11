import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateLandingPageInput } from "@maistro/types";
import {
  getLandingPage,
  generateLandingPage,
  updateLandingPage,
  previewLandingPage,
} from "../api/landing-pages";
import { queryKeys } from "./query-client";

export function useLandingPage(projectId: string) {
  return useQuery({
    queryKey: queryKeys.landingPages.detail(projectId),
    queryFn: async () => {
      const response = await getLandingPage(projectId);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: !!projectId,
  });
}

export function useGenerateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, regenerate }: { projectId: string; regenerate?: boolean }) => {
      const response = await generateLandingPage({ projectId, regenerate });
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.landingPages.detail(data.projectId), data);
    },
  });
}

export function useUpdateLandingPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, input }: { projectId: string; input: UpdateLandingPageInput }) => {
      const response = await updateLandingPage(projectId, input);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.landingPages.detail(data.projectId), data);
    },
  });
}

export function usePreviewLandingPage(projectId: string) {
  return useQuery({
    queryKey: [...queryKeys.landingPages.detail(projectId), "preview"],
    queryFn: async () => {
      const response = await previewLandingPage(projectId);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: !!projectId,
  });
}
