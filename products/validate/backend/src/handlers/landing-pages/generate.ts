import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getProject, updateProject, createLandingPage } from "@maistro/db";
import { generateLandingPage } from "@maistro/ai";
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

    await updateProject(userId, projectId, { status: "generating" });

    try {
      const generated = await generateLandingPage(project);

      const landingPage = await createLandingPage({
        projectId,
        headline: generated.headline,
        subheadline: generated.subheadline,
        sections: generated.sections,
        theme: generated.theme,
        ctaText: generated.ctaText,
        seoTitle: generated.seoTitle,
        seoDescription: generated.seoDescription,
      });

      await updateProject(userId, projectId, { status: "ready" });

      return success({
        projectId,
        landingPage,
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      await updateProject(userId, projectId, { status: "draft" });
      throw error;
    }
  } catch (error) {
    console.error("Failed to generate landing page", { error });
    return internalError();
  }
};
