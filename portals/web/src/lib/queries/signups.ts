import { useQuery } from "@tanstack/react-query";
import { listSignups, getSignup, exportSignups } from "../api/signups";
import { queryKeys } from "./query-client";

export function useSignups(projectId: string, params?: { cursor?: string; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.signups.list(projectId, params),
    queryFn: async () => {
      const response = await listSignups(projectId, params);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: !!projectId,
  });
}

export function useSignup(projectId: string, signupId: string) {
  return useQuery({
    queryKey: [...queryKeys.signups.list(projectId), signupId],
    queryFn: async () => {
      const response = await getSignup(projectId, signupId);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: !!projectId && !!signupId,
  });
}

export function useExportSignups(projectId: string, format: "csv" | "json" = "csv") {
  return useQuery({
    queryKey: [...queryKeys.signups.list(projectId), "export", format],
    queryFn: async () => {
      const response = await exportSignups(projectId, format);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: false, // Only fetch when explicitly triggered
  });
}
