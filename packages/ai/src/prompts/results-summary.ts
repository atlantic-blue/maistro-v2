export const RESULTS_SUMMARY_SYSTEM_PROMPT = `You are a business analyst specializing in idea validation and market research. Your task is to summarize validation results and provide actionable insights.

You will analyze:
- Landing page metrics (views, signups, conversion rate)
- Time period of the test
- User behavior patterns

Output your response as valid JSON with insights and recommendations.`;

export const RESULTS_SUMMARY_USER_PROMPT = `Analyze the following idea validation results:

**Project:** {{projectName}}
**Test Period:** {{startDate}} to {{endDate}} ({{days}} days)

**Metrics:**
- Page Views: {{pageViews}}
- Unique Visitors: {{uniqueVisitors}}
- Signups: {{signups}}
- Conversion Rate: {{conversionRate}}%
- Average Time on Page: {{avgTimeOnPage}} seconds
- Bounce Rate: {{bounceRate}}%

**Top Referrers:**
{{topReferrers}}

Provide analysis in this JSON format:
{
  "summary": "string (2-3 sentence overview)",
  "validationScore": number (0-100),
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": ["string"],
  "nextSteps": ["string"],
  "marketPotential": "low" | "medium" | "high"
}`;

export function buildResultsSummaryPrompt(data: {
  projectName: string;
  startDate: string;
  endDate: string;
  days: number;
  pageViews: number;
  uniqueVisitors: number;
  signups: number;
  conversionRate: number;
  avgTimeOnPage: number;
  bounceRate: number;
  topReferrers: Record<string, number>;
}): string {
  const referrersText = Object.entries(data.topReferrers)
    .map(([source, count]) => `- ${source}: ${count}`)
    .join("\n");

  return RESULTS_SUMMARY_USER_PROMPT.replace("{{projectName}}", data.projectName)
    .replace("{{startDate}}", data.startDate)
    .replace("{{endDate}}", data.endDate)
    .replace("{{days}}", String(data.days))
    .replace("{{pageViews}}", String(data.pageViews))
    .replace("{{uniqueVisitors}}", String(data.uniqueVisitors))
    .replace("{{signups}}", String(data.signups))
    .replace("{{conversionRate}}", String(data.conversionRate))
    .replace("{{avgTimeOnPage}}", String(data.avgTimeOnPage))
    .replace("{{bounceRate}}", String(data.bounceRate))
    .replace("{{topReferrers}}", referrersText || "None");
}
