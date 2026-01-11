export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: UserPlan;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserPlan = "free" | "starter" | "pro" | "enterprise";

export interface CreateUserInput {
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface UpdateUserInput {
  name?: string;
  avatarUrl?: string;
  plan?: UserPlan;
  stripeCustomerId?: string;
}

export interface UserDynamoDB {
  PK: `USER#${string}`;
  SK: "PROFILE";
  GSI1PK: `EMAIL#${string}`;
  GSI1SK: "USER";
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  plan: UserPlan;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
  entityType: "USER";
}
