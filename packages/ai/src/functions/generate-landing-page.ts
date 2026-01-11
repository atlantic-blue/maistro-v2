import type { LandingPageSection, LandingPageTheme, Project } from "@maistro/types";
import { getOpenAIClient, MODEL } from "../client";
import {
  LANDING_PAGE_SYSTEM_PROMPT,
  buildLandingPagePrompt,
} from "../prompts/landing-page";

export interface GeneratedLandingPage {
  headline: string;
  subheadline: string;
  sections: LandingPageSection[];
  ctaText: string;
  seoTitle: string;
  seoDescription: string;
}

const DEFAULT_THEME: LandingPageTheme = {
  primaryColor: "#2563eb",
  secondaryColor: "#1e40af",
  backgroundColor: "#ffffff",
  textColor: "#1f2937",
  fontFamily: "Inter, system-ui, sans-serif",
};

export async function generateLandingPage(
  project: Project
): Promise<GeneratedLandingPage & { theme: LandingPageTheme }> {
  const client = getOpenAIClient();

  const prompt = buildLandingPagePrompt({
    name: project.name,
    description: project.description,
    targetAudience: project.targetAudience,
    problem: project.problem,
    solution: project.solution,
  });

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: LANDING_PAGE_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(content) as GeneratedLandingPage;

  return {
    ...parsed,
    theme: DEFAULT_THEME,
  };
}
