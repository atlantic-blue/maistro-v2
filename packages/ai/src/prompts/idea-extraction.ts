export const IDEA_EXTRACTION_SYSTEM_PROMPT = `You are a business analyst expert. Your task is to extract and structure business idea information from user input.

You will analyze the provided text and identify:
- The core business idea/product
- The target audience
- The problem being solved
- The proposed solution

Output your response as valid JSON matching the specified schema.`;

export const IDEA_EXTRACTION_USER_PROMPT = `Extract structured business idea information from the following text:

"{{input}}"

Respond with JSON in this exact format:
{
  "name": "string (short product/business name, max 50 chars)",
  "description": "string (1-2 sentence description, max 200 chars)",
  "targetAudience": "string (who is this for, max 100 chars)",
  "problem": "string (what problem does it solve, max 200 chars)",
  "solution": "string (how does it solve the problem, max 200 chars)",
  "confidence": number (0-1, how confident are you in this extraction)
}`;

export function buildIdeaExtractionPrompt(input: string): string {
  return IDEA_EXTRACTION_USER_PROMPT.replace("{{input}}", input);
}
