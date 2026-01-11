export type EventType =
  | "page_view"
  | "button_click"
  | "form_start"
  | "form_submit"
  | "scroll_depth"
  | "time_on_page"
  | "custom";

export interface Event {
  id: string;
  projectId: string;
  type: EventType;
  name?: string;
  properties?: Record<string, unknown>;
  sessionId?: string;
  visitorId?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface CreateEventInput {
  projectId: string;
  type: EventType;
  name?: string;
  properties?: Record<string, unknown>;
  sessionId?: string;
  visitorId?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface EventDynamoDB {
  PK: `PROJECT#${string}`;
  SK: `EVENT#${string}#${string}`;
  id: string;
  projectId: string;
  type: EventType;
  name?: string;
  properties?: Record<string, unknown>;
  sessionId?: string;
  visitorId?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  entityType: "EVENT";
}
