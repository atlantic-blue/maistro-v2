import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import type { Event, EventDynamoDB, CreateEventInput } from "@maistro/types";
import { generateId, now } from "@maistro/utils";
import { db, TABLE_NAME } from "../client";
import { Keys } from "../keys";

function toEvent(item: EventDynamoDB): Event {
  return {
    id: item.id,
    projectId: item.projectId,
    type: item.type,
    ...(item.name ? { name: item.name } : {}),
    ...(item.properties ? { properties: item.properties } : {}),
    ...(item.sessionId ? { sessionId: item.sessionId } : {}),
    ...(item.visitorId ? { visitorId: item.visitorId } : {}),
    ...(item.referrer ? { referrer: item.referrer } : {}),
    ...(item.userAgent ? { userAgent: item.userAgent } : {}),
    ...(item.ipAddress ? { ipAddress: item.ipAddress } : {}),
    createdAt: item.createdAt,
  };
}

export async function createEvent(input: CreateEventInput): Promise<Event> {
  const id = generateId();
  const timestamp = now();

  const item: EventDynamoDB = {
    PK: Keys.event.pk(input.projectId),
    SK: Keys.event.sk(timestamp, id),
    id,
    projectId: input.projectId,
    type: input.type,
    ...(input.name ? { name: input.name } : {}),
    ...(input.properties ? { properties: input.properties } : {}),
    ...(input.sessionId ? { sessionId: input.sessionId } : {}),
    ...(input.visitorId ? { visitorId: input.visitorId } : {}),
    ...(input.referrer ? { referrer: input.referrer } : {}),
    ...(input.userAgent ? { userAgent: input.userAgent } : {}),
    ...(input.ipAddress ? { ipAddress: input.ipAddress } : {}),
    createdAt: timestamp,
    entityType: "EVENT",
  };

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );

  return toEvent(item);
}

export async function listEvents(
  projectId: string,
  options: { type?: string; limit?: number; cursor?: string } = {}
): Promise<{ items: Event[]; nextCursor?: string }> {
  const { limit = 50, cursor } = options;

  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": Keys.event.pk(projectId),
        ":skPrefix": Keys.event.skPrefix(),
      },
      Limit: limit,
      ScanIndexForward: false,
      ExclusiveStartKey: cursor
        ? JSON.parse(Buffer.from(cursor, "base64").toString())
        : undefined,
    })
  );

  let items = (result.Items ?? []).map((item) => toEvent(item as EventDynamoDB));

  if (options.type) {
    items = items.filter((event) => event.type === options.type);
  }

  const nextCursor = result.LastEvaluatedKey
    ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString("base64")
    : undefined;

  return { items, ...(nextCursor ? { nextCursor } : {}) };
}

export async function countEvents(
  projectId: string,
  type?: string
): Promise<number> {
  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      FilterExpression: type ? "#type = :type" : undefined,
      ExpressionAttributeNames: type ? { "#type": "type" } : undefined,
      ExpressionAttributeValues: {
        ":pk": Keys.event.pk(projectId),
        ":skPrefix": Keys.event.skPrefix(),
        ...(type && { ":type": type }),
      },
      Select: "COUNT",
    })
  );

  return result.Count ?? 0;
}
