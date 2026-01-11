import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { z } from "zod";
import { updateUser } from "@maistro/db";
import type { UpdateUserInput } from "@maistro/types";
import {
  success,
  notFound,
  unauthorized,
  badRequest,
  internalError,
  getUserId,
  parseBody,
  validate,
  formatZodErrors,
} from "@maistro/utils";

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

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

    const validation = validate(updateUserSchema, body);
    if (!validation.success) {
      return badRequest("Validation failed", formatZodErrors(validation.errors));
    }

    const user = await updateUser(userId, validation.data as UpdateUserInput);
    if (!user) {
      return notFound("User not found");
    }

    return success(user);
  } catch (error) {
    console.error("Failed to update user", { error });
    return internalError();
  }
};
