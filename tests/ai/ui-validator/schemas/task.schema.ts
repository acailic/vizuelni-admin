import { z } from 'zod';

export const taskStepActionSchema = z.enum([
  'navigate',
  'click',
  'input',
  'select',
  'wait',
]);

export const taskStepSchema = z.object({
  action: taskStepActionSchema,
  target: z.string().min(1),
  expected_result: z.string().min(1),
});

export const discoveredTaskSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  page: z.string().min(1),
  steps: z.array(taskStepSchema).default([]),
  criticalElements: z.array(z.string().min(1)).default([]),
  discoveredAt: z.string().datetime().optional(),
  confidence: z.number().min(0).max(1).default(0.5),
});

export const taskCacheSchema = z.object({
  generatedAt: z.string().datetime(),
  tasks: z.array(discoveredTaskSchema),
});

export type TaskStep = z.infer<typeof taskStepSchema>;
export type DiscoveredTask = z.infer<typeof discoveredTaskSchema>;
export type TaskCache = z.infer<typeof taskCacheSchema>;
