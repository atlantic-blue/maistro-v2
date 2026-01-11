import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getProject, listEvents } from "@maistro/db";
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
      : 50;
    const cursor = event.queryStringParameters?.cursor;
    const type = event.queryStringParameters?.type;

    const result = await listEvents(projectId, {
      limit,
      ...(cursor ? { cursor } : {}),
      ...(type ? { type } : {}),
    });

    return success(result);
  } catch (error) {
    console.error("Failed to list events", { error });
    return internalError();
  }
};
