import { PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type { DailyStats, StatsDynamoDB } from "@maistro/types";
import { now, getDateKey } from "@maistro/utils";
import { db, TABLE_NAME } from "../client";
import { Keys } from "../keys";

function toStats(item: StatsDynamoDB): DailyStats {
  return {
    projectId: item.projectId,
    date: item.date,
    pageViews: item.pageViews,
    uniqueVisitors: item.uniqueVisitors,
    signups: item.signups,
    conversionRate: item.conversionRate,
    avgTimeOnPage: item.avgTimeOnPage,
    bounceRate: item.bounceRate,
    topReferrers: item.topReferrers,
    deviceBreakdown: item.deviceBreakdown,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function getOrCreateDailyStats(
  projectId: string,
  date: string = getDateKey()
): Promise<DailyStats> {
  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": Keys.stats.pk(projectId),
        ":sk": Keys.stats.sk(date),
      },
      Limit: 1,
    })
  );

  if (result.Items?.[0]) {
    return toStats(result.Items[0] as StatsDynamoDB);
  }

  const timestamp = now();
  const item: StatsDynamoDB = {
    PK: Keys.stats.pk(projectId),
    SK: Keys.stats.sk(date),
    projectId,
    date,
    pageViews: 0,
    uniqueVisitors: 0,
    signups: 0,
    conversionRate: 0,
    avgTimeOnPage: 0,
    bounceRate: 0,
    topReferrers: {},
    deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
    createdAt: timestamp,
    updatedAt: timestamp,
    entityType: "STATS",
  };

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
    })
  );

  return toStats(item);
}

export async function incrementPageView(
  projectId: string,
  date: string = getDateKey()
): Promise<void> {
  await getOrCreateDailyStats(projectId, date);

  await db.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: Keys.stats.pk(projectId),
        SK: Keys.stats.sk(date),
      },
      UpdateExpression:
        "SET #pageViews = #pageViews + :inc, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#pageViews": "pageViews",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":inc": 1,
        ":updatedAt": now(),
      },
    })
  );
}

export async function incrementSignup(
  projectId: string,
  date: string = getDateKey()
): Promise<void> {
  await getOrCreateDailyStats(projectId, date);

  await db.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: Keys.stats.pk(projectId),
        SK: Keys.stats.sk(date),
      },
      UpdateExpression:
        "SET #signups = #signups + :inc, #updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#signups": "signups",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":inc": 1,
        ":updatedAt": now(),
      },
    })
  );
}

export async function getDailyStats(
  projectId: string,
  startDate: string,
  endDate: string
): Promise<DailyStats[]> {
  const result = await db.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND SK BETWEEN :start AND :end",
      ExpressionAttributeValues: {
        ":pk": Keys.stats.pk(projectId),
        ":start": Keys.stats.sk(startDate),
        ":end": Keys.stats.sk(endDate),
      },
      ScanIndexForward: true,
    })
  );

  return (result.Items ?? []).map((item) => toStats(item as StatsDynamoDB));
}
