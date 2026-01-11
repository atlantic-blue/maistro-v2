import type {
  ProjectAnalytics,
  DailyStats,
  ApiResponse,
} from "@maistro/types";
import { apiClient } from "./client";

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  period?: "day" | "week" | "month";
}

export async function getProjectAnalytics(
  projectId: string,
  params?: AnalyticsParams
): Promise<ApiResponse<ProjectAnalytics>> {
  const searchParams = new URLSearchParams();
  if (params?.startDate) searchParams.set("startDate", params.startDate);
  if (params?.endDate) searchParams.set("endDate", params.endDate);
  if (params?.period) searchParams.set("period", params.period);

  const query = searchParams.toString();
  const endpoint = query
    ? `/projects/${projectId}/analytics?${query}`
    : `/projects/${projectId}/analytics`;
  return apiClient.get<ProjectAnalytics>(endpoint);
}

export async function getDailyStats(
  projectId: string,
  date: string
): Promise<ApiResponse<DailyStats>> {
  return apiClient.get<DailyStats>(
    `/projects/${projectId}/analytics/daily/${date}`
  );
}

export async function getOverviewStats(): Promise<
  ApiResponse<{
    totalProjects: number;
    totalSignups: number;
    totalPageViews: number;
    averageConversionRate: number;
  }>
> {
  return apiClient.get<{
    totalProjects: number;
    totalSignups: number;
    totalPageViews: number;
    averageConversionRate: number;
  }>("/analytics/overview");
}
