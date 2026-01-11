import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import type { User, UserDynamoDB, CreateUserInput, UpdateUserInput } from "@maistro/types";
import { generateId, now } from "@maistro/utils";
import { db, TABLE_NAME } from "../client";
import { Keys, GSI_NAMES } from "../keys";

function toUser(item: UserDynamoDB): User {
  return {
    id: item.id,
    email: item.email,
    name: item.name,
    ...(item.avatarUrl ? { avatarUrl: item.avatarUrl } : {}),
    plan: item.plan,
    ...(item.stripeCustomerId ? { stripeCustomerId: item.stripeCustomerId } : {}),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function createUser(input: CreateUserInput): Promise<User> {
  const id = generateId();
  const timestamp = now();

  const item: UserDynamoDB = {
    PK: Keys.user.pk(id),
    SK: Keys.user.sk(),
    GSI1PK: Keys.user.gsi1pk(input.email),
    GSI1SK: Keys.user.gsi1sk(),
    id,
    email: input.email,
    name: input.name,
    ...(input.avatarUrl ? { avatarUrl: input.avatarUrl } : {}),
    plan: "free",
    createdAt: timestamp,
    updatedAt: timestamp,
    entityType: "USER",
  };

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
      ConditionExpression: "attribute_not_exists(PK)",
    })
  );

  return toUser(item);
}

export async function getUserById(userId: string): Promise<User | null> {
  const result = await db.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: Keys.user.pk(userId),
        SK: Keys.user.sk(),
      },
    })
  );

  if (!result.Item) return null;
  return toUser(result.Item as UserDynamoDB);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: GSI_NAMES.GSI1,
      KeyConditionExpression: "GSI1PK = :pk AND GSI1SK = :sk",
      ExpressionAttributeValues: {
        ":pk": Keys.user.gsi1pk(email),
        ":sk": Keys.user.gsi1sk(),
      },
      Limit: 1,
    })
  );

  if (!result.Items?.[0]) return null;
  return toUser(result.Items[0] as UserDynamoDB);
}

export async function updateUser(
  userId: string,
  input: UpdateUserInput
): Promise<User | null> {
  const updateExpressions: string[] = ["#updatedAt = :updatedAt"];
  const expressionNames: Record<string, string> = { "#updatedAt": "updatedAt" };
  const expressionValues: Record<string, unknown> = { ":updatedAt": now() };

  if (input.name !== undefined) {
    updateExpressions.push("#name = :name");
    expressionNames["#name"] = "name";
    expressionValues[":name"] = input.name;
  }

  if (input.avatarUrl !== undefined) {
    updateExpressions.push("#avatarUrl = :avatarUrl");
    expressionNames["#avatarUrl"] = "avatarUrl";
    expressionValues[":avatarUrl"] = input.avatarUrl;
  }

  if (input.plan !== undefined) {
    updateExpressions.push("#plan = :plan");
    expressionNames["#plan"] = "plan";
    expressionValues[":plan"] = input.plan;
  }

  if (input.stripeCustomerId !== undefined) {
    updateExpressions.push("#stripeCustomerId = :stripeCustomerId");
    expressionNames["#stripeCustomerId"] = "stripeCustomerId";
    expressionValues[":stripeCustomerId"] = input.stripeCustomerId;
  }

  const result = await db.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: Keys.user.pk(userId),
        SK: Keys.user.sk(),
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: "ALL_NEW",
      ConditionExpression: "attribute_exists(PK)",
    })
  );

  if (!result.Attributes) return null;
  return toUser(result.Attributes as UserDynamoDB);
}

export async function deleteUser(userId: string): Promise<void> {
  await db.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: Keys.user.pk(userId),
        SK: Keys.user.sk(),
      },
    })
  );
}
