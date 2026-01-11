import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getProject, listSignups, countSignups } from "@maistro/db";
import {
  success,
  notFound,
  badRequest,
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

    const projectId = event.pathParameters?.id;
    if (!projectId) {
      return badRequest("Project ID is required");
    }

    const project = await getProject(userId, projectId);
    if (!project) {
      return notFound("Project not found");
    }

    const limit = event.queryStringParameters?.limit
      ? parseInt(event.queryStringParameters.limit, 10)
      : 20;
    const cursor = event.queryStringParameters?.cursor;

    const [result, total] = await Promise.all([
      listSignups(projectId, { limit, ...(cursor ? { cursor } : {}) }),
      countSignups(projectId),
    ]);

    return success({
      items: result.items,
      nextCursor: result.nextCursor,
      total,
    });
  } catch (error) {
    console.error("Failed to list signups", { error });
    return internalError();
  }
};
