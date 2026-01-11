import type { PreSignUpTriggerHandler } from "aws-lambda";

export const handler: PreSignUpTriggerHandler = async (event) => {
  const { userAttributes } = event.request;

  if (!userAttributes.email) {
    throw new Error("Email is required for signup");
  }

  const emailDomain = userAttributes.email.split("@")[1];
  if (!emailDomain) {
    throw new Error("Invalid email format");
  }

  const blockedDomains = (process.env.BLOCKED_EMAIL_DOMAINS ?? "").split(",").filter(Boolean);
  if (blockedDomains.includes(emailDomain.toLowerCase())) {
    throw new Error("Email domain not allowed");
  }

  event.response.autoConfirmUser = false;
  event.response.autoVerifyEmail = false;

  return event;
};
