import type { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getProject, updateProject } from "@maistro/db";
import { success, error, badRequest, notFound, forbidden, internalError, getUserId } from "@maistro/utils";
import { unpublishLandingPage } from "../../services";

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    const userId = getUserId(event);
    const projectId = event.pathParameters?.projectId;

    if (!userId) {
      return forbidden("Authentication required") as APIGatewayProxyResult;
    }

    if (!projectId) {
      return badRequest("Project ID is required") as APIGatewayProxyResult;
    }

    // Get the project
    const project = await getProject(userId, projectId);
    if (!project) {
      return notFound("Project not found") as APIGatewayProxyResult;
    }

    // Check if project is published
    if (project.status !== "published") {
      return error(400, "NOT_PUBLISHED", "Project is not published") as APIGatewayProxyResult;
    }

    // Unpublish the landing page
    await unpublishLandingPage(project);

    // Update project status
    const updatedProject = await updateProject(userId, projectId, {
      status: "ready",
    });

    return success({
      project: updatedProject,
    }) as APIGatewayProxyResult;
  } catch (err) {
    console.error("Error unpublishing project:", err);
    return internalError("Failed to unpublish project") as APIGatewayProxyResult;
  }
};
