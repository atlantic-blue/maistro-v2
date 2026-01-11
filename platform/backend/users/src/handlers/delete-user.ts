import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { deleteUser } from "@maistro/db";
import { noContent, unauthorized, internalError, getUserId } from "@maistro/utils";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const userId = getUserId(event);
    if (!userId) {
      return unauthorized();
    }

    await deleteUser(userId);

    return noContent();
  } catch (error) {
    console.error("Failed to delete user", { error });
    return internalError();
  }
};
