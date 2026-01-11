import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { listProjects } from "@maistro/db";
import {
  success,
  unauthorized,
  internalError,
  getUserId,
} from "@maistro/utils";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const userId = getUserId(event);
    if (!userId) {
      return unauthorized();
    }

    const limit = event.queryStringParameters?.limit
      ? parseInt(event.queryStringParameters.limit, 10)
      : 20;
    const cursor = event.queryStringParameters?.cursor;

    const result = await listProjects(userId, { limit, ...(cursor ? { cursor } : {}) });

    return success(result);
  } catch (error) {
    console.error("Failed to list projects", { error });
    return internalError();
  }
};
