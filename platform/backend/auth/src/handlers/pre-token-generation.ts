import type { PreTokenGenerationTriggerHandler } from "aws-lambda";
import { getUserByEmail } from "@maistro/db";

export const handler: PreTokenGenerationTriggerHandler = async (event) => {
  const email = event.request.userAttributes.email;

  if (email) {
    try {
      const user = await getUserByEmail(email);

      if (user) {
        event.response.claimsOverrideDetails = {
          claimsToAddOrOverride: {
            userId: user.id,
            plan: user.plan,
          },
        };
      }
    } catch (error) {
      console.error("Failed to get user for token generation", { error, email });
    }
  }

  return event;
};
