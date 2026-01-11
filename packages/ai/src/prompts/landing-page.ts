export const LANDING_PAGE_SYSTEM_PROMPT = `You are an expert copywriter and landing page designer. Your task is to create compelling, conversion-focused landing page content based on the business idea provided.

You will generate content that:
- Captures attention with a clear, benefit-driven headline
- Addresses the target audience's pain points
- Presents the solution clearly
- Includes social proof elements
- Has a strong call-to-action

Output your response as valid JSON matching the specified schema.`;

export const LANDING_PAGE_USER_PROMPT = `Create landing page content for the following business idea:

**Name:** {{name}}
**Description:** {{description}}
**Target Audience:** {{targetAudience}}
**Problem:** {{problem}}
**Solution:** {{solution}}

Generate the landing page content with:
1. A compelling headline (max 10 words)
2. A subheadline that expands on the value proposition (max 25 words)
3. 3-4 key features/benefits
4. FAQ section with 3 questions
5. A call-to-action button text

Respond with JSON in this exact format:
{
  "headline": "string",
  "subheadline": "string",
  "sections": [
    {
      "type": "features",
      "content": {
        "items": [
          { "title": "string", "description": "string", "icon": "string" }
        ]
      }
    },
    {
      "type": "benefits",
      "content": {
        "items": [
          { "title": "string", "description": "string" }
        ]
      }
    },
    {
      "type": "faq",
      "content": {
        "items": [
          { "question": "string", "answer": "string" }
        ]
      }
    }
  ],
  "ctaText": "string",
  "seoTitle": "string (max 60 chars)",
  "seoDescription": "string (max 160 chars)"
}`;

export function buildLandingPagePrompt(data: {
  name: string;
  description: string;
  targetAudience: string;
  problem: string;
  solution: string;
}): string {
  return LANDING_PAGE_USER_PROMPT.replace("{{name}}", data.name)
    .replace("{{description}}", data.description)
    .replace("{{targetAudience}}", data.targetAudience)
    .replace("{{problem}}", data.problem)
    .replace("{{solution}}", data.solution);
}
