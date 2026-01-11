import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  projects: {
    all: ["projects"] as const,
    list: (params?: { status?: string }) => [...queryKeys.projects.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.projects.all, "detail", id] as const,
  },
  landingPages: {
    all: ["landingPages"] as const,
    detail: (projectId: string) => [...queryKeys.landingPages.all, projectId] as const,
  },
  signups: {
    all: ["signups"] as const,
    list: (projectId: string, params?: { cursor?: string }) =>
      [...queryKeys.signups.all, projectId, "list", params] as const,
  },
  analytics: {
    all: ["analytics"] as const,
    project: (projectId: string, params?: { startDate?: string; endDate?: string }) =>
      [...queryKeys.analytics.all, projectId, params] as const,
    overview: () => [...queryKeys.analytics.all, "overview"] as const,
  },
} as const;
