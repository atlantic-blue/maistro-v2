import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getProjectBySlug, createEvent, incrementPageView } from "@maistro/db";
import {
  created,
  notFound,
  badRequest,
  internalError,
  parseBody,
  validate,
  formatZodErrors,
  trackEventSchema,
  getDateKey,
} from "@maistro/utils";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const body = parseBody(event.body);
    if (!body) {
      return badRequest("Request body is required");
    }

    const validation = validate(trackEventSchema, body);
    if (!validation.success) {
      return badRequest("Validation failed", formatZodErrors(validation.errors));
    }

    const { projectId, ...eventData } = validation.data;

    const project = await getProjectBySlug(projectId);
    if (!project || project.status !== "published") {
      return notFound("Project not found");
    }

    const referrer = event.headers?.referer ?? event.headers?.Referer;
    const userAgent = event.headers?.["user-agent"];
    const ipAddress =
      event.requestContext?.http?.sourceIp ??
      event.headers?.["x-forwarded-for"]?.split(",")[0];

    const trackedEvent = await createEvent({
      projectId: project.id,
      type: eventData.type,
      ...(eventData.name ? { name: eventData.name } : {}),
      ...(eventData.properties ? { properties: eventData.properties } : {}),
      ...(eventData.sessionId ? { sessionId: eventData.sessionId } : {}),
      ...(eventData.visitorId ? { visitorId: eventData.visitorId } : {}),
      ...(referrer ? { referrer } : {}),
      ...(userAgent ? { userAgent } : {}),
      ipAddress,
    });

    if (eventData.type === "page_view") {
      await incrementPageView(project.id, getDateKey());
    }

    return created({
      id: trackedEvent.id,
      type: trackedEvent.type,
      createdAt: trackedEvent.createdAt,
    });
  } catch (error) {
    console.error("Failed to track event", { error });
    return internalError();
  }
};
