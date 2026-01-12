export type ProjectStatus = "draft" | "generating" | "ready" | "published" | "archived";

export interface Project {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description: string;
  targetAudience: string;
  problem: string;
  solution: string;
  status: ProjectStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  targetAudience: string;
  problem: string;
  solution: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  targetAudience?: string;
  problem?: string;
  solution?: string;
  status?: ProjectStatus;
  publishedAt?: string;
}

export interface ProjectDynamoDB {
  PK: `USER#${string}`;
  SK: `PROJECT#${string}`;
  GSI1PK: `SLUG#${string}`;
  GSI1SK: "PROJECT";
  id: string;
  userId: string;
  name: string;
  slug: string;
  description: string;
  targetAudience: string;
  problem: string;
  solution: string;
  status: ProjectStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  entityType: "PROJECT";
}
