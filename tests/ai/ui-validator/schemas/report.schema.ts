import { z } from 'zod';
import { issueSchema, viewportSchema } from './issue.schema';

export const taskSummarySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(['passing', 'blocked', 'warning']),
  issues_count: z.number().int().nonnegative(),
});

export const validationReportSchema = z.object({
  timestamp: z.string().datetime(),
  duration_ms: z.number().nonnegative(),
  config: z.object({
    model: z.string().min(1),
    pages_scanned: z.number().int().nonnegative(),
    viewports: z.array(viewportSchema),
  }),
  summary: z.object({
    total_checks: z.number().int().nonnegative(),
    passed: z.number().int().nonnegative(),
    critical: z.number().int().nonnegative(),
    warning: z.number().int().nonnegative(),
    info: z.number().int().nonnegative(),
  }),
  tasks: z.object({
    discovered: z.number().int().nonnegative(),
    blocked_by_critical: z.number().int().nonnegative(),
    details: z.array(taskSummarySchema),
  }),
  issues: z.array(issueSchema),
});

export type TaskSummary = z.infer<typeof taskSummarySchema>;
export type ValidationReport = z.infer<typeof validationReportSchema>;
