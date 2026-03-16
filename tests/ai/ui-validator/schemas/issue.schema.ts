import { z } from 'zod';

export const issueSeveritySchema = z.enum(['critical', 'warning', 'info']);
export const issueCategorySchema = z.enum(['data', 'layout', 'interaction']);
export const issueSourceSchema = z.enum([
  'visual-inspector',
  'behavior-validator',
  'semantic-checker',
]);

export const viewportSchema = z.object({
  name: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const issueSchema = z.object({
  id: z.string().min(1),
  severity: issueSeveritySchema,
  category: issueCategorySchema,
  subcategory: z.string().optional(),
  source: issueSourceSchema,
  task_blocked: z.string().nullable().optional(),
  page: z.string().min(1),
  element: z.string().optional(),
  viewport: viewportSchema.optional(),
  expected: z.string().min(1),
  actual: z.string().min(1),
  screenshot: z.string().nullable().optional(),
  dom_snapshot: z.string().nullable().optional(),
  suggestion: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export type Issue = z.infer<typeof issueSchema>;
export type IssueSeverity = z.infer<typeof issueSeveritySchema>;
export type IssueCategory = z.infer<typeof issueCategorySchema>;
export type IssueSource = z.infer<typeof issueSourceSchema>;
export type ViewportConfig = z.infer<typeof viewportSchema>;
