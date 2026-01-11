import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { Signup, SignupDynamoDB, CreateSignupInput } from "@maistro/types";
import { generateId, now } from "@maistro/utils";
import { db, TABLE_NAME } from "../client";
import { Keys } from "../keys";

function toSignup(item: SignupDynamoDB): Signup {
  return {
    id: item.id,
    projectId: item.projectId,
    email: item.email,
    ...(item.name ? { name: item.name } : {}),
    ...(item.source ? { source: item.source } : {}),
    ...(item.referrer ? { referrer: item.referrer } : {}),
    ...(item.userAgent ? { userAgent: item.userAgent } : {}),
    ...(item.ipAddress ? { ipAddress: item.ipAddress } : {}),
    ...(item.metadata ? { metadata: item.metadata } : {}),
    createdAt: item.createdAt,
  };
}

export async function createSignup(input: CreateSignupInput): Promise<Signup> {
  const id = generateId();
  const timestamp = now();

  const item: SignupDynamoDB = {
    PK: Keys.signup.pk(input.projectId),
    SK: Keys.signup.sk(timestamp, id),
    id,
    projectId: input.projectId,
    email: input.email,
    ...(input.name ? { name: input.name } : {}),
    ...(input.source ? { source: input.source } : {}),
    ...(input.referrer ? { referrer: input.referrer } : {}),
    ...(input.userAgent ? { userAgent: input.userAgent } : {}),
    ...(input.ipAddress ? { ipAddress: input.ipAddress } : {}),
    ...(input.metadata ? { metadata: input.metadata } : {}),
    createdAt: timestamp,
    entityType: "SIGNUP",
  };

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );

  return toSignup(item);
}

export async function listSignups(
  projectId: string,
  options: { limit?: number; cursor?: string } = {}
): Promise<{ items: Signup[]; nextCursor?: string; total?: number }> {
  const { limit = 20, cursor } = options;

  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": Keys.signup.pk(projectId),
        ":skPrefix": Keys.signup.skPrefix(),
      },
      Limit: limit,
      ScanIndexForward: false,
      ExclusiveStartKey: cursor
        ? JSON.parse(Buffer.from(cursor, "base64").toString())
        : undefined,
    })
  );

  const items = (result.Items ?? []).map((item) => toSignup(item as SignupDynamoDB));
  const nextCursor = result.LastEvaluatedKey
    ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString("base64")
    : undefined;

  return { items, ...(nextCursor ? { nextCursor } : {}) };
}

export async function countSignups(projectId: string): Promise<number> {
  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": Keys.signup.pk(projectId),
        ":skPrefix": Keys.signup.skPrefix(),
      },
      Select: "COUNT",
    })
  );

  return result.Count ?? 0;
}
