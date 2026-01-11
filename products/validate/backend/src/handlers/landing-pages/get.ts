import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getProject, getLandingPage } from "@maistro/db";
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

    const landingPage = await getLandingPage(projectId);
    if (!landingPage) {
      return notFound("Landing page not found. Generate one first.");
    }

    return success(landingPage);
  } catch (error) {
    console.error("Failed to get landing page", { error });
    return internalError();
  }
};
