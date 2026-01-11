import type {
  CreateProjectInput,
  UpdateProjectInput,
  CreateSignupInput,
  CreateEventInput,
  UpdateLandingPageInput,
} from "../entities";

export interface CreateProjectRequest extends CreateProjectInput {}

export interface UpdateProjectRequest extends UpdateProjectInput {}

export interface GenerateLandingPageRequest {
  projectId: string;
  regenerate?: boolean;
}

export interface PublishProjectRequest {
  projectId: string;
  customDomain?: string;
}

export interface CaptureSignupRequest extends CreateSignupInput {}

export interface TrackEventRequest extends CreateEventInput {}

export interface UpdateLandingPageRequest extends UpdateLandingPageInput {}

export interface GetAnalyticsRequest {
  projectId: string;
  startDate?: string;
  endDate?: string;
  granularity?: "day" | "week" | "month";
}

export interface ListProjectsRequest {
  limit?: number;
  cursor?: string;
  status?: string;
}

export interface ListSignupsRequest {
  projectId: string;
  limit?: number;
  cursor?: string;
}

export interface ListEventsRequest {
  projectId: string;
  type?: string;
  limit?: number;
  cursor?: string;
}
