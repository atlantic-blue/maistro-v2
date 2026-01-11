import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { deleteProject } from "@maistro/db";
import {
  noContent,
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

    await deleteProject(userId, projectId);

    return noContent();
  } catch (error) {
    console.error("Failed to delete project", { error });
    return internalError();
  }
};
