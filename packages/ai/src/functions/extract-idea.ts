import type { CreateProjectInput } from "@maistro/types";
import { getOpenAIClient, FAST_MODEL } from "../client";
import {
  IDEA_EXTRACTION_SYSTEM_PROMPT,
  buildIdeaExtractionPrompt,
} from "../prompts/idea-extraction";

export interface ExtractedIdea extends CreateProjectInput {
  confidence: number;
}

export async function extractIdea(input: string): Promise<ExtractedIdea> {
  const client = getOpenAIClient();

  const prompt = buildIdeaExtractionPrompt(input);

  const response = await client.chat.completions.create({
    model: FAST_MODEL,
    messages: [
      { role: "system", content: IDEA_EXTRACTION_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content) as ExtractedIdea;
}
