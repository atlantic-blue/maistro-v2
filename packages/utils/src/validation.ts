import { z } from "zod";

export const emailSchema = z.string().email("Invalid email address");

export const slugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters")
  .max(50, "Slug must be at most 50 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description is too long"),
  targetAudience: z.string().min(5, "Target audience is required").max(200, "Target audience is too long"),
  problem: z.string().min(10, "Problem must be at least 10 characters").max(500, "Problem is too long"),
  solution: z.string().min(10, "Solution must be at least 10 characters").max(500, "Solution is too long"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().min(10).max(500).optional(),
  targetAudience: z.string().min(5).max(200).optional(),
  problem: z.string().min(10).max(500).optional(),
  solution: z.string().min(10).max(500).optional(),
  status: z.enum(["draft", "generating", "ready", "published", "archived"]).optional(),
});

export const captureSignupSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  email: emailSchema,
  name: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
  referrer: z.string().url().optional().or(z.literal("")),
  metadata: z.record(z.unknown()).optional(),
});

export const trackEventSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  type: z.enum([
    "page_view",
    "button_click",
    "form_start",
    "form_submit",
    "scroll_depth",
    "time_on_page",
    "custom",
  ]),
  name: z.string().max(100).optional(),
  properties: z.record(z.unknown()).optional(),
  sessionId: z.string().optional(),
  visitorId: z.string().optional(),
});

export const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  cursor: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type CaptureSignupInput = z.infer<typeof captureSignupSchema>;
export type TrackEventInput = z.infer<typeof trackEventSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;

export function validate<T>(
  schema: z.Schema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    errors[path] = issue.message;
  }
  return errors;
}
