export const ENTITY_TYPES = {
  USER: "USER",
  PROJECT: "PROJECT",
  LANDING_PAGE: "LANDING_PAGE",
  SIGNUP: "SIGNUP",
  EVENT: "EVENT",
  STATS: "STATS",
} as const;

export const PROJECT_STATUSES = {
  DRAFT: "draft",
  GENERATING: "generating",
  READY: "ready",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const USER_PLANS = {
  FREE: "free",
  STARTER: "starter",
  PRO: "pro",
  ENTERPRISE: "enterprise",
} as const;

export const EVENT_TYPES = {
  PAGE_VIEW: "page_view",
  BUTTON_CLICK: "button_click",
  FORM_START: "form_start",
  FORM_SUBMIT: "form_submit",
  SCROLL_DEPTH: "scroll_depth",
  TIME_ON_PAGE: "time_on_page",
  CUSTOM: "custom",
} as const;

export const PLAN_LIMITS = {
  free: {
    projects: 1,
    signupsPerProject: 100,
    customDomain: false,
    analytics: "basic",
    aiRegenerations: 3,
  },
  starter: {
    projects: 5,
    signupsPerProject: 1000,
    customDomain: false,
    analytics: "standard",
    aiRegenerations: 10,
  },
  pro: {
    projects: 20,
    signupsPerProject: 10000,
    customDomain: true,
    analytics: "advanced",
    aiRegenerations: 50,
  },
  enterprise: {
    projects: -1,
    signupsPerProject: -1,
    customDomain: true,
    analytics: "advanced",
    aiRegenerations: -1,
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  PLAN_LIMIT_EXCEEDED: "PLAN_LIMIT_EXCEEDED",
  AI_GENERATION_FAILED: "AI_GENERATION_FAILED",
} as const;
