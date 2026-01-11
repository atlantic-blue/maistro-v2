import { useQuery } from "@tanstack/react-query";
import { getProjectAnalytics, getDailyStats, getOverviewStats, type AnalyticsParams } from "../api/analytics";
import { queryKeys } from "./query-client";

export function useProjectAnalytics(projectId: string, params?: AnalyticsParams) {
  return useQuery({
    queryKey: queryKeys.analytics.project(projectId, params),
    queryFn: async () => {
      const response = await getProjectAnalytics(projectId, params);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: !!projectId,
  });
}

export function useDailyStats(projectId: string, date: string) {
  return useQuery({
    queryKey: [...queryKeys.analytics.project(projectId), "daily", date],
    queryFn: async () => {
      const response = await getDailyStats(projectId, date);
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    enabled: !!projectId && !!date,
  });
}

export function useOverviewStats() {
  return useQuery({
    queryKey: queryKeys.analytics.overview(),
    queryFn: async () => {
      const response = await getOverviewStats();
      if (!response.success) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
  });
}
