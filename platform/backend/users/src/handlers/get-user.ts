import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getUserById } from "@maistro/db";
import { success, notFound, unauthorized, internalError, getUserId } from "@maistro/utils";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const userId = getUserId(event);
    if (!userId) {
      return unauthorized();
    }

    const user = await getUserById(userId);
    if (!user) {
      return notFound("User not found");
    }

    return success(user);
  } catch (error) {
    console.error("Failed to get user", { error });
    return internalError();
  }
};
