import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getProjectBySlug, getLandingPage } from "@maistro/db";
import { success, notFound, badRequest, internalError } from "@maistro/utils";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const slug = event.pathParameters?.slug;
    if (!slug) {
      return badRequest("Slug is required");
    }

    const project = await getProjectBySlug(slug);
    if (!project || project.status !== "published") {
      return notFound("Page not found");
    }

    const landingPage = await getLandingPage(project.id);
    if (!landingPage) {
      return notFound("Page not found");
    }

    return success({
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
      },
      landingPage,
    });
  } catch (error) {
    console.error("Failed to get public page", { error });
    return internalError();
  }
};
