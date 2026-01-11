import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { createUser } from "@maistro/db";

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const { userAttributes } = event.request;

  if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {
    const email = userAttributes.email;
    if (!email) {
      console.warn("No email found in user attributes", { userAttributes });
      return event;
    }

    const name = userAttributes.name ?? email.split("@")[0] ?? "User";

    try {
      await createUser({
        email,
        name,
      });

      console.info("User created in DynamoDB", { email, sub: userAttributes.sub });
    } catch (error) {
      console.error("Failed to create user in DynamoDB", { error, email });
      throw error;
    }
  }

  return event;
};
