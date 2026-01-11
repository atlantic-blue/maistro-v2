import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { createProject } from "@maistro/db";
import {
  created,
  badRequest,
  unauthorized,
  internalError,
  getUserId,
  parseBody,
  validate,
  formatZodErrors,
  createProjectSchema,
} from "@maistro/utils";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const userId = getUserId(event);
    if (!userId) {
      return unauthorized();
    }

    const body = parseBody(event.body);
    if (!body) {
      return badRequest("Request body is required");
    }

    const validation = validate(createProjectSchema, body);
    if (!validation.success) {
      return badRequest("Validation failed", formatZodErrors(validation.errors));
    }

    const project = await createProject(userId, validation.data);

    return created(project);
  } catch (error) {
    console.error("Failed to create project", { error });
    return internalError();
  }
};
