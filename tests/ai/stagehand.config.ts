import { Stagehand, V3 } from '@browserbasehq/stagehand';
import { z } from 'zod';

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

export const LOCALES = ['sr-Latn', 'sr-Cyrl', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export interface StagehandConfig {
  env: 'LOCAL' | 'BROWSERBASE';
  model: string;
  apiKey?: string;
  projectId?: string;
  verbose: 0 | 1 | 2;
  serverCache: boolean;
}

export function getStagehandConfig(): StagehandConfig {
  const useBrowserbase = !!process.env.BROWSERBASE_API_KEY;

  return {
    env: useBrowserbase ? 'BROWSERBASE' : 'LOCAL',
    model: 'openai/gpt-4o',
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,
    verbose: (process.env.NODE_ENV === 'development' ? 1 : 0) as 0 | 1 | 2,
    serverCache: true,
  };
}

/**
 * Create a Stagehand instance with project defaults
 */
export async function createStagehandInstance(): Promise<Stagehand> {
  const config = getStagehandConfig();

  const stagehand = new V3({
    env: config.env,
    apiKey: config.apiKey,
    projectId: config.projectId,
    verbose: config.verbose,
    serverCache: config.serverCache,
    model: config.model,
  });

  await stagehand.init();
  return stagehand;
}

/**
 * Test configuration constants
 */
export const TEST_CONFIG = {
  // Default timeouts for AI operations
  actionTimeout: 30000,
  navigationTimeout: 30000,
  extractionTimeout: 60000,

  // Wait times for page interactions
  pageLoadBuffer: 1000,
  animationBuffer: 500,
} as const;

/**
 * Common extraction schemas
 */
export const schemas = {
  chartInfo: z.object({
    title: z.string(),
    hasData: z.boolean(),
    chartType: z.string().optional(),
  }),

  pageState: z.object({
    isLoading: z.boolean(),
    hasError: z.boolean(),
    currentStep: z.string().optional(),
  }),

  browseResults: z.object({
    totalResults: z.number(),
    visibleResults: z.number(),
    hasPagination: z.boolean(),
  }),
} as const;
