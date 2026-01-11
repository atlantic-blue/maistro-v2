import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getProject } from "@maistro/db";
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

    return success(project);
  } catch (error) {
    console.error("Failed to get project", { error });
    return internalError();
  }
};
