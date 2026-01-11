export interface Signup {
  id: string;
  projectId: string;
  email: string;
  name?: string;
  source?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CreateSignupInput {
  projectId: string;
  email: string;
  name?: string;
  source?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

export interface SignupDynamoDB {
  PK: `PROJECT#${string}`;
  SK: `SIGNUP#${string}#${string}`;
  id: string;
  projectId: string;
  email: string;
  name?: string;
  source?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  entityType: "SIGNUP";
}

export interface SignupListResponse {
  items: Signup[];
  nextCursor?: string;
  total: number;
}
