// Load environment variables FIRST before any other code
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env') });

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
  /** Custom LLM base URL (e.g., for z.ai or other OpenAI-compatible endpoints) */
  llmBaseURL?: string;
  /** API key for the LLM provider (if different from BROWSERBASE_API_KEY) */
  llmApiKey?: string;
  /** Browser executable path (Lightpanda or Chrome) */
  browserPath?: string;
}

/**
 * Get LLM configuration from environment variables
 *
 * Supports:
 * - GLM/z.ai: Set GLM_API_KEY and GLM_API_BASE
 * - z.ai legacy: Set ZAI_API_KEY and ZAI_BASE_URL
 * - OpenAI: Set OPENAI_API_KEY (uses default OpenAI endpoint)
 * - Custom: Set LLM_BASE_URL and LLM_API_KEY
 */
export function getLLMConfig(): {
  baseURL?: string;
  apiKey?: string;
  modelName: string;
} {
  // Priority: GLM/z.ai > z.ai legacy > custom LLM > OpenAI default
  const glmApiKey = process.env.GLM_API_KEY;
  const glmBaseUrl = process.env.GLM_API_BASE;
  const glmModel = process.env.LEARNER_MODEL || 'glm-5';

  const zaiApiKey = process.env.ZAI_API_KEY;
  const zaiBaseUrl = process.env.ZAI_BASE_URL || 'https://api.z.ai/v1';

  const customBaseUrl = process.env.LLM_BASE_URL;
  const customApiKey = process.env.LLM_API_KEY;

  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (glmApiKey && glmBaseUrl) {
    // Use openai/ prefix for OpenAI-compatible endpoints
    return {
      baseURL: glmBaseUrl,
      apiKey: glmApiKey,
      modelName: `openai/${glmModel}`,
    };
  }

  if (zaiApiKey) {
    return {
      baseURL: zaiBaseUrl,
      apiKey: zaiApiKey,
      modelName: process.env.ZAI_MODEL || 'gpt-4o',
    };
  }

  if (customBaseUrl && customApiKey) {
    return {
      baseURL: customBaseUrl,
      apiKey: customApiKey,
      modelName: process.env.LLM_MODEL || 'gpt-4o',
    };
  }

  if (openaiApiKey) {
    return {
      modelName: process.env.OPENAI_MODEL || 'gpt-4o',
      apiKey: openaiApiKey,
    };
  }

  // Fallback - will likely fail without API key
  return {
    modelName: 'glm-5',
  };
}

export function getStagehandConfig(): StagehandConfig {
  const useBrowserbase = !!process.env.BROWSERBASE_API_KEY;
  const llmConfig = getLLMConfig();

  // Browser path: prefer BROWSER_PATH, fallback to CHROME_PATH
  const browserPath = process.env.BROWSER_PATH || process.env.CHROME_PATH;

  return {
    env: useBrowserbase ? 'BROWSERBASE' : 'LOCAL',
    model: llmConfig.modelName,
    apiKey: process.env.BROWSERBASE_API_KEY,
    projectId: process.env.BROWSERBASE_PROJECT_ID,
    verbose: (process.env.NODE_ENV === 'development' ? 1 : 0) as 0 | 1 | 2,
    serverCache: true,
    llmBaseURL: llmConfig.baseURL,
    llmApiKey: llmConfig.apiKey,
    browserPath,
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
    model: {
      modelName: config.model,
      apiKey: config.llmApiKey,
      baseURL: config.llmBaseURL,
    },
    // Use Lightpanda or custom browser if specified
    browser: config.browserPath
      ? {
          executablePath: config.browserPath,
        }
      : undefined,
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
