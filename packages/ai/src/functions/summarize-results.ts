import type { ProjectAnalytics } from "@maistro/types";
import { getOpenAIClient, MODEL } from "../client";
import {
  RESULTS_SUMMARY_SYSTEM_PROMPT,
  buildResultsSummaryPrompt,
} from "../prompts/results-summary";

export interface ResultsSummary {
  summary: string;
  validationScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  nextSteps: string[];
  marketPotential: "low" | "medium" | "high";
}

export async function summarizeResults(
  projectName: string,
  analytics: ProjectAnalytics
): Promise<ResultsSummary> {
  const client = getOpenAIClient();

  const totalReferrers: Record<string, number> = {};
  for (const day of analytics.dailyStats) {
    for (const [source, count] of Object.entries(day.topReferrers)) {
      totalReferrers[source] = (totalReferrers[source] ?? 0) + count;
    }
  }

  const avgTimeOnPage =
    analytics.dailyStats.reduce((sum, d) => sum + d.avgTimeOnPage, 0) /
    (analytics.dailyStats.length || 1);

  const avgBounceRate =
    analytics.dailyStats.reduce((sum, d) => sum + d.bounceRate, 0) /
    (analytics.dailyStats.length || 1);

  const daysDiff = Math.ceil(
    (new Date(analytics.period.end).getTime() -
      new Date(analytics.period.start).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const prompt = buildResultsSummaryPrompt({
    projectName,
    startDate: analytics.period.start,
    endDate: analytics.period.end,
    days: daysDiff,
    pageViews: analytics.totalPageViews,
    uniqueVisitors: analytics.totalUniqueVisitors,
    signups: analytics.totalSignups,
    conversionRate: analytics.overallConversionRate,
    avgTimeOnPage,
    bounceRate: avgBounceRate,
    topReferrers: totalReferrers,
  });

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: RESULTS_SUMMARY_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.5,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content) as ResultsSummary;
}
