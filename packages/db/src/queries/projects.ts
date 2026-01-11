import {
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import type {
  Project,
  ProjectDynamoDB,
  CreateProjectInput,
  UpdateProjectInput,
} from "@maistro/types";
import { generateId, now, createUniqueSlug } from "@maistro/utils";
import { db, TABLE_NAME } from "../client";
import { Keys, GSI_NAMES } from "../keys";

function toProject(item: ProjectDynamoDB): Project {
  return {
    id: item.id,
    userId: item.userId,
    name: item.name,
    slug: item.slug,
    description: item.description,
    targetAudience: item.targetAudience,
    problem: item.problem,
    solution: item.solution,
    status: item.status,
    ...(item.publishedAt ? { publishedAt: item.publishedAt } : {}),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function createProject(
  userId: string,
  input: CreateProjectInput
): Promise<Project> {
  const id = generateId();
  const slug = createUniqueSlug(input.name);
  const timestamp = now();

  const item: ProjectDynamoDB = {
    PK: Keys.project.pk(userId),
    SK: Keys.project.sk(id),
    GSI1PK: Keys.project.gsi1pk(slug),
    GSI1SK: Keys.project.gsi1sk(),
    id,
    userId,
    name: input.name,
    slug,
    description: input.description,
    targetAudience: input.targetAudience,
    problem: input.problem,
    solution: input.solution,
    status: "draft",
    createdAt: timestamp,
    updatedAt: timestamp,
    entityType: "PROJECT",
  };

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
    })
  );

  return toProject(item);
}

export async function getProject(
  userId: string,
  projectId: string
): Promise<Project | null> {
  const result = await db.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: Keys.project.pk(userId),
        SK: Keys.project.sk(projectId),
      },
    })
  );

  if (!result.Item) return null;
  return toProject(result.Item as ProjectDynamoDB);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: GSI_NAMES.GSI1,
      KeyConditionExpression: "GSI1PK = :pk AND GSI1SK = :sk",
      ExpressionAttributeValues: {
        ":pk": Keys.project.gsi1pk(slug),
        ":sk": Keys.project.gsi1sk(),
      },
      Limit: 1,
    })
  );

  if (!result.Items?.[0]) return null;
  return toProject(result.Items[0] as ProjectDynamoDB);
}

export async function listProjects(
  userId: string,
  options: { limit?: number; cursor?: string } = {}
): Promise<{ items: Project[]; nextCursor?: string }> {
  const { limit = 20, cursor } = options;

  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": Keys.project.pk(userId),
        ":skPrefix": "PROJECT#",
      },
      Limit: limit,
      ScanIndexForward: false,
      ExclusiveStartKey: cursor ? JSON.parse(Buffer.from(cursor, "base64").toString()) : undefined,
    })
  );

  const items = (result.Items ?? []).map((item) => toProject(item as ProjectDynamoDB));
  const nextCursor = result.LastEvaluatedKey
    ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString("base64")
    : undefined;

  return { items, ...(nextCursor ? { nextCursor } : {}) };
}

export async function updateProject(
  userId: string,
  projectId: string,
  input: UpdateProjectInput
): Promise<Project | null> {
  const updateExpressions: string[] = ["#updatedAt = :updatedAt"];
  const expressionNames: Record<string, string> = { "#updatedAt": "updatedAt" };
  const expressionValues: Record<string, unknown> = { ":updatedAt": now() };

  if (input.name !== undefined) {
    updateExpressions.push("#name = :name");
    expressionNames["#name"] = "name";
    expressionValues[":name"] = input.name;
  }

  if (input.description !== undefined) {
    updateExpressions.push("#description = :description");
    expressionNames["#description"] = "description";
    expressionValues[":description"] = input.description;
  }

  if (input.targetAudience !== undefined) {
    updateExpressions.push("#targetAudience = :targetAudience");
    expressionNames["#targetAudience"] = "targetAudience";
    expressionValues[":targetAudience"] = input.targetAudience;
  }

  if (input.problem !== undefined) {
    updateExpressions.push("#problem = :problem");
    expressionNames["#problem"] = "problem";
    expressionValues[":problem"] = input.problem;
  }

  if (input.solution !== undefined) {
    updateExpressions.push("#solution = :solution");
    expressionNames["#solution"] = "solution";
    expressionValues[":solution"] = input.solution;
  }

  if (input.status !== undefined) {
    updateExpressions.push("#status = :status");
    expressionNames["#status"] = "status";
    expressionValues[":status"] = input.status;

    if (input.status === "published") {
      updateExpressions.push("#publishedAt = :publishedAt");
      expressionNames["#publishedAt"] = "publishedAt";
      expressionValues[":publishedAt"] = now();
    }
  }

  const result = await db.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: Keys.project.pk(userId),
        SK: Keys.project.sk(projectId),
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: "ALL_NEW",
      ConditionExpression: "attribute_exists(PK)",
    })
  );

  if (!result.Attributes) return null;
  return toProject(result.Attributes as ProjectDynamoDB);
}

export async function deleteProject(
  userId: string,
  projectId: string
): Promise<void> {
  await db.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: Keys.project.pk(userId),
        SK: Keys.project.sk(projectId),
      },
    })
  );
}
