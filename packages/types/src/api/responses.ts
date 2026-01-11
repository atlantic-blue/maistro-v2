import type {
  User,
  Project,
  LandingPage,
  Signup,
  Event,
  ProjectAnalytics,
} from "../entities";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  total?: number;
}

export type UserResponse = ApiResponse<User>;

export type ProjectResponse = ApiResponse<Project>;

export type ProjectListResponse = ApiResponse<PaginatedResponse<Project>>;

export type LandingPageResponse = ApiResponse<LandingPage>;

export type SignupResponse = ApiResponse<Signup>;

export type SignupListResponse = ApiResponse<PaginatedResponse<Signup>>;

export type EventResponse = ApiResponse<Event>;

export type EventListResponse = ApiResponse<PaginatedResponse<Event>>;

export type AnalyticsResponse = ApiResponse<ProjectAnalytics>;

export interface PublishResponse {
  projectId: string;
  url: string;
  publishedAt: string;
}

export interface GenerateLandingPageResponse {
  projectId: string;
  landingPage: LandingPage;
  generatedAt: string;
}
