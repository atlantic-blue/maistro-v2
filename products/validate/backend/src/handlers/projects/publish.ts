import type { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { getProject, updateProject, getLandingPage } from "@maistro/db";
import { success, error, badRequest, notFound, forbidden, internalError, getUserId } from "@maistro/utils";
import { publishLandingPage } from "../../services";

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

    // Check if project is in a publishable state
    if (project.status === "published") {
      return error(400, "ALREADY_PUBLISHED", "Project is already published") as APIGatewayProxyResult;
    }

    // Get the landing page
    const landingPage = await getLandingPage(projectId);
    if (!landingPage) {
      return badRequest("Project must have a landing page before publishing") as APIGatewayProxyResult;
    }

    // Publish the landing page
    const { url, publishedAt } = await publishLandingPage(project, landingPage);

    // Update project status
    const updatedProject = await updateProject(userId, projectId, {
      status: "published",
      publishedAt,
    });

    return success({
      project: updatedProject,
      url,
      publishedAt,
    }) as APIGatewayProxyResult;
  } catch (err) {
    console.error("Error publishing project:", err);
    return internalError("Failed to publish project") as APIGatewayProxyResult;
  }
};
