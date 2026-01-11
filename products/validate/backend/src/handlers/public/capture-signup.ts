import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getProjectBySlug, createSignup, incrementSignup } from "@maistro/db";
import {
  created,
  notFound,
  badRequest,
  internalError,
  parseBody,
  validate,
  formatZodErrors,
  captureSignupSchema,
  getDateKey,
} from "@maistro/utils";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const body = parseBody(event.body);
    if (!body) {
      return badRequest("Request body is required");
    }

    const validation = validate(captureSignupSchema, body);
    if (!validation.success) {
      return badRequest("Validation failed", formatZodErrors(validation.errors));
    }

    const { projectId, ...signupData } = validation.data;

    const project = await getProjectBySlug(projectId);
    if (!project || project.status !== "published") {
      return notFound("Project not found");
    }

    const referrer = event.headers?.referer ?? event.headers?.Referer;
    const userAgent = event.headers?.["user-agent"];
    const ipAddress =
      event.requestContext?.http?.sourceIp ??
      event.headers?.["x-forwarded-for"]?.split(",")[0];

    const signup = await createSignup({
      projectId: project.id,
      email: signupData.email,
      ...(signupData.name ? { name: signupData.name } : {}),
      ...(signupData.source ? { source: signupData.source } : {}),
      ...(referrer || signupData.referrer ? { referrer: (referrer ?? signupData.referrer) as string } : {}),
      ...(userAgent ? { userAgent } : {}),
      ipAddress,
      ...(signupData.metadata ? { metadata: signupData.metadata } : {}),
    });

    await incrementSignup(project.id, getDateKey());

    return created({
      id: signup.id,
      email: signup.email,
      createdAt: signup.createdAt,
    });
  } catch (error) {
    console.error("Failed to capture signup", { error });
    return internalError();
  }
};
