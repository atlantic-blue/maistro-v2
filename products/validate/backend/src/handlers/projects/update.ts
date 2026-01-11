import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { updateProject } from "@maistro/db";
import type { UpdateProjectInput } from "@maistro/types";
import {
  success,
  notFound,
  badRequest,
  unauthorized,
  internalError,
  getUserId,
  parseBody,
  validate,
  formatZodErrors,
  updateProjectSchema,
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

    const body = parseBody(event.body);
    if (!body) {
      return badRequest("Request body is required");
    }

    const validation = validate(updateProjectSchema, body);
    if (!validation.success) {
      return badRequest("Validation failed", formatZodErrors(validation.errors));
    }

    const project = await updateProject(userId, projectId, validation.data as UpdateProjectInput);
    if (!project) {
      return notFound("Project not found");
    }

    return success(project);
  } catch (error) {
    console.error("Failed to update project", { error });
    return internalError();
  }
};
