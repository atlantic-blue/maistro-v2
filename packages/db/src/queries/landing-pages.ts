import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import type {
  LandingPage,
  LandingPageDynamoDB,
  UpdateLandingPageInput,
  LandingPageSection,
  LandingPageTheme,
} from "@maistro/types";
import { now } from "@maistro/utils";
import { db, TABLE_NAME } from "../client";
import { Keys } from "../keys";

function toLandingPage(item: LandingPageDynamoDB): LandingPage {
  return {
    projectId: item.projectId,
    headline: item.headline,
    subheadline: item.subheadline,
    sections: item.sections,
    theme: item.theme,
    ctaText: item.ctaText,
    ...(item.ctaUrl ? { ctaUrl: item.ctaUrl } : {}),
    seoTitle: item.seoTitle,
    seoDescription: item.seoDescription,
    ...(item.ogImage ? { ogImage: item.ogImage } : {}),
    ...(item.customCss ? { customCss: item.customCss } : {}),
    version: item.version,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export interface CreateLandingPageInput {
  projectId: string;
  headline: string;
  subheadline: string;
  sections: LandingPageSection[];
  theme: LandingPageTheme;
  ctaText: string;
  ctaUrl?: string;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
}

export async function createLandingPage(
  input: CreateLandingPageInput
): Promise<LandingPage> {
  const timestamp = now();

  const item: LandingPageDynamoDB = {
    PK: Keys.landingPage.pk(input.projectId),
    SK: Keys.landingPage.sk(),
    projectId: input.projectId,
    headline: input.headline,
    subheadline: input.subheadline,
    sections: input.sections,
    theme: input.theme,
    ctaText: input.ctaText,
    ...(input.ctaUrl ? { ctaUrl: input.ctaUrl } : {}),
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    ...(input.ogImage ? { ogImage: input.ogImage } : {}),
    version: 1,
    createdAt: timestamp,
    updatedAt: timestamp,
    entityType: "LANDING_PAGE",
  };

  await db.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
    })
  );

  return toLandingPage(item);
}

export async function getLandingPage(
  projectId: string
): Promise<LandingPage | null> {
  const result = await db.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: Keys.landingPage.pk(projectId),
        SK: Keys.landingPage.sk(),
      },
    })
  );

  if (!result.Item) return null;
  return toLandingPage(result.Item as LandingPageDynamoDB);
}

export async function updateLandingPage(
  projectId: string,
  input: UpdateLandingPageInput
): Promise<LandingPage | null> {
  const updateExpressions: string[] = [
    "#updatedAt = :updatedAt",
    "#version = #version + :inc",
  ];
  const expressionNames: Record<string, string> = {
    "#updatedAt": "updatedAt",
    "#version": "version",
  };
  const expressionValues: Record<string, unknown> = {
    ":updatedAt": now(),
    ":inc": 1,
  };

  if (input.headline !== undefined) {
    updateExpressions.push("#headline = :headline");
    expressionNames["#headline"] = "headline";
    expressionValues[":headline"] = input.headline;
  }

  if (input.subheadline !== undefined) {
    updateExpressions.push("#subheadline = :subheadline");
    expressionNames["#subheadline"] = "subheadline";
    expressionValues[":subheadline"] = input.subheadline;
  }

  if (input.sections !== undefined) {
    updateExpressions.push("#sections = :sections");
    expressionNames["#sections"] = "sections";
    expressionValues[":sections"] = input.sections;
  }

  if (input.theme !== undefined) {
    updateExpressions.push("#theme = :theme");
    expressionNames["#theme"] = "theme";
    expressionValues[":theme"] = input.theme;
  }

  if (input.ctaText !== undefined) {
    updateExpressions.push("#ctaText = :ctaText");
    expressionNames["#ctaText"] = "ctaText";
    expressionValues[":ctaText"] = input.ctaText;
  }

  if (input.ctaUrl !== undefined) {
    updateExpressions.push("#ctaUrl = :ctaUrl");
    expressionNames["#ctaUrl"] = "ctaUrl";
    expressionValues[":ctaUrl"] = input.ctaUrl;
  }

  if (input.seoTitle !== undefined) {
    updateExpressions.push("#seoTitle = :seoTitle");
    expressionNames["#seoTitle"] = "seoTitle";
    expressionValues[":seoTitle"] = input.seoTitle;
  }

  if (input.seoDescription !== undefined) {
    updateExpressions.push("#seoDescription = :seoDescription");
    expressionNames["#seoDescription"] = "seoDescription";
    expressionValues[":seoDescription"] = input.seoDescription;
  }

  if (input.ogImage !== undefined) {
    updateExpressions.push("#ogImage = :ogImage");
    expressionNames["#ogImage"] = "ogImage";
    expressionValues[":ogImage"] = input.ogImage;
  }

  if (input.customCss !== undefined) {
    updateExpressions.push("#customCss = :customCss");
    expressionNames["#customCss"] = "customCss";
    expressionValues[":customCss"] = input.customCss;
  }

  const result = await db.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: Keys.landingPage.pk(projectId),
        SK: Keys.landingPage.sk(),
      },
      UpdateExpression: `SET ${updateExpressions.join(", ")}`,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: "ALL_NEW",
      ConditionExpression: "attribute_exists(PK)",
    })
  );

  if (!result.Attributes) return null;
  return toLandingPage(result.Attributes as LandingPageDynamoDB);
}
