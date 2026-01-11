import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getProject, getDailyStats, countSignups, countEvents } from "@maistro/db";
import type { ProjectAnalytics } from "@maistro/types";
import {
  success,
  notFound,
  badRequest,
  unauthorized,
  internalError,
  getUserId,
  daysAgo,
  getDateKey,
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

    const project = await getProject(userId, projectId);
    if (!project) {
      return notFound("Project not found");
    }

    const startDate =
      event.queryStringParameters?.startDate ?? getDateKey(daysAgo(30));
    const endDate = event.queryStringParameters?.endDate ?? getDateKey();

    const [dailyStats, totalSignups, totalPageViews] = await Promise.all([
      getDailyStats(projectId, startDate, endDate),
      countSignups(projectId),
      countEvents(projectId, "page_view"),
    ]);

    const totalUniqueVisitors = dailyStats.reduce(
      (sum, d) => sum + d.uniqueVisitors,
      0
    );

    const conversionRate =
      totalUniqueVisitors > 0
        ? (totalSignups / totalUniqueVisitors) * 100
        : 0;

    const analytics: ProjectAnalytics = {
      projectId,
      totalPageViews,
      totalUniqueVisitors,
      totalSignups,
      overallConversionRate: Math.round(conversionRate * 100) / 100,
      dailyStats,
      period: {
        start: startDate,
        end: endDate,
      },
    };

    return success(analytics);
  } catch (error) {
    console.error("Failed to get analytics", { error });
    return internalError();
  }
};
