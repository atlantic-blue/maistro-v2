import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getProject, updateProject, getLandingPage } from "@maistro/db";
import {
  success,
  notFound,
  badRequest,
  unauthorized,
  internalError,
  getUserId,
} from "@maistro/utils";

const LANDING_DOMAIN = process.env.LANDING_DOMAIN ?? "maistro.live";

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
      return badRequest("Landing page not found. Generate one first.");
    }

    const updatedProject = await updateProject(userId, projectId, {
      status: "published",
    });

    const url = `https://${project.slug}.${LANDING_DOMAIN}`;

    return success({
      projectId,
      url,
      slug: project.slug,
      publishedAt: updatedProject?.publishedAt ?? new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to publish landing page", { error });
    return internalError();
  }
};
