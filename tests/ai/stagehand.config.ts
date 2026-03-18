// Load environment variables FIRST before any other code
import { config } from 'dotenv';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env');
config({ path: envPath });

import { Stagehand, V3 } from '@browserbasehq/stagehand';
import { AISdkClient as BaseAISdkClient } from '@browserbasehq/stagehand';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import type { LanguageModelV1 } from '@ai-sdk/provider';

/**
 * Custom AISdkClient that enforces JSON output for GLM models
 * GLM models need explicit instructions to return valid JSON without markdown
 */
class GLMAISdkClient extends BaseAISdkClient {
  private jsonInstruction = `\n\nCRITICAL INSTRUCTION: You MUST respond with ONLY valid JSON. No markdown. No code blocks. No \`\`\`json. Just the raw JSON object that matches the requested schema exactly. This is mandatory.`;

  constructor(options: { model: LanguageModelV1; logger?: unknown }) {
    super(options);
  }

  async createChatCompletion(
    options: Parameters<BaseAISdkClient['createChatCompletion']>[0]
  ) {
    const opts = options as any;

    // Add JSON instruction for structured output requests
    if (opts.options?.response_model || opts.response_model) {
      const messages = opts.options?.messages || opts.messages;
      if (messages && messages.length > 0) {
        // Find the last user message and append JSON instruction
        for (let i = messages.length - 1; i >= 0; i--) {
          const msg = messages[i];
          if (msg.role === 'user') {
            if (typeof msg.content === 'string') {
              msg.content += this.jsonInstruction;
            } else if (Array.isArray(msg.content)) {
              // Handle multimodal content
              const textPart = msg.content.find((p: any) => p.type === 'text');
              if (textPart) {
                textPart.text += this.jsonInstruction;
              }
            }
            break;
          }
        }
      }
    }

    try {
      return await super.createChatCompletion(options);
    } catch (error: any) {
      // If JSON parsing failed, try to extract JSON from the response
      if (
        error?.message?.includes('could not parse') ||
        error?.message?.includes('did not match schema')
      ) {
        const text = error.text || error.cause?.text;
        if (text) {
          // Try to extract JSON from markdown code blocks
          const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
          if (jsonMatch) {
            const extractedJson = jsonMatch[1].trim();
            console.log(
              '[GLM] Extracted JSON from markdown:',
              extractedJson.substring(0, 100)
            );
            // Re-throw with better error info
          }
        }
      }
      throw error;
    }
  }
}

export function getBaseUrl(): string {
  const url = process.env.BASE_URL || 'http://localhost:3000';
  // Remove trailing slash if present
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

// For backwards compatibility - call function to get current value
export const BASE_URL = getBaseUrl();

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
  /** CDP WebSocket URL for connecting to existing browser (e.g., Lightpanda) */
  cdpUrl?: string;
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
    // GLM/z.ai uses OpenAI-compatible API
    // Use openai/ prefix with custom baseURL for Stagehand compatibility
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

  // CDP URL for Lightpanda or other CDP-compatible browsers
  // Set LIGHTPANDA_CDP_URL or CDP_URL to use an existing browser
  const cdpUrl = process.env.LIGHTPANDA_CDP_URL || process.env.CDP_URL;

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
    cdpUrl,
  };
}

/**
 * Create a Stagehand instance with project defaults
 *
 * Supports:
 * - LOCAL mode with Chrome/Chromium (BROWSER_PATH env var)
 * - LOCAL mode with Lightpanda CDP (CDP_URL env var - pass via localBrowserLaunchOptions.cdpUrl)
 * - BROWSERBASE mode (BROWSERBASE_API_KEY env var)
 * - GLM/z.ai LLM with OpenAI compatibility mode
 */
export async function createStagehandInstance(): Promise<Stagehand> {
  const config = getStagehandConfig();
  const llmConfig = getLLMConfig();

  // Build V3 options
  const v3Options: ConstructorParameters<typeof V3>[0] = {
    env: config.env,
    apiKey: config.apiKey,
    projectId: config.projectId,
    verbose: config.verbose,
    serverCache: config.serverCache,
    // Increase timeout for better compatibility
    domSettleTimeout: 60000,
  };

  // Configure LLM client for GLM/z.ai
  const glmApiKey = process.env.GLM_API_KEY;
  const glmBaseUrl = process.env.GLM_API_BASE;
  const glmModel = process.env.LEARNER_MODEL || 'glm-5';

  if (glmApiKey && glmBaseUrl) {
    // Create OpenAI provider with custom baseURL
    // Use .chat() to force /chat/completions endpoint instead of /responses
    // (z.ai doesn't support the OpenAI Responses API)
    const openai = createOpenAI({
      baseURL: glmBaseUrl,
      apiKey: glmApiKey,
      compatibility: 'strict',
    });

    // Create a chat model (forces /chat/completions endpoint)
    const chatModel = openai.chat(glmModel);

    // Wrap in GLMAISdkClient for Stagehand compatibility with JSON enforcement
    const llmClient = new GLMAISdkClient({
      model: chatModel,
      logger: undefined, // Stagehand will handle logging
    });

    v3Options.llmClient = llmClient;
    v3Options.model = `openai/${glmModel}`; // Model name for display purposes

    // Add system prompt to enforce JSON output for GLM models
    // GLM needs explicit instructions to return valid JSON without markdown
    v3Options.systemPrompt = `You are a web automation assistant. When asked to extract data, you MUST respond with ONLY valid JSON. Do not use markdown code blocks. Do not include any text before or after the JSON. The response must be a raw JSON object that matches the requested schema exactly.`;
  } else {
    // Use default model configuration
    v3Options.model = {
      modelName: config.model,
      apiKey: config.llmApiKey,
      baseURL: config.llmBaseURL,
    };
  }

  // Configure local browser options
  if (config.env === 'LOCAL') {
    // Priority: CDP URL > executable path
    if (config.cdpUrl) {
      // Connect to existing browser via CDP (e.g., Lightpanda)
      v3Options.localBrowserLaunchOptions = {
        cdpUrl: config.cdpUrl,
      };
    } else if (config.browserPath) {
      // Launch browser with specified path
      v3Options.localBrowserLaunchOptions = {
        executablePath: config.browserPath,
        headless: true,
      };
    }
  }

  const stagehand = new V3(v3Options);
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
