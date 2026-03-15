import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';
import {
  createStagehandInstance,
  getBaseUrl,
  TEST_CONFIG,
  type Locale,
} from '../stagehand.config';

// Re-export for convenience
export { createStagehandInstance };

// Get BASE_URL at runtime to ensure env vars are loaded
export const BASE_URL = getBaseUrl();

export interface TestContext {
  stagehand: Stagehand;
  locale: Locale;
}

/**
 * Create a Stagehand instance with default configuration
 */
export async function createStagehand(): Promise<Stagehand> {
  return createStagehandInstance();
}

/**
 * Navigate to a page with locale
 */
export async function navigateTo(
  stagehand: Stagehand,
  path: string,
  locale: Locale = 'sr-Latn'
): Promise<void> {
  // Get BASE_URL at call time to ensure env vars are loaded
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/${locale}${path}`;
  const page = await getActivePage(stagehand);

  await page.goto(url, { waitUntil: 'domcontentloaded' });
  // Buffer for React hydration
  await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);
}

/**
 * Get the active page from Stagehand context
 */
export async function getActivePage(stagehand: Stagehand) {
  let page = stagehand.context.pages()[0];
  if (!page) {
    page = await stagehand.context.newPage();
  }
  return page;
}

/**
 * Wait for text to appear on page
 */
export async function waitForText(
  stagehand: Stagehand,
  text: string,
  timeout = 10000
): Promise<boolean> {
  try {
    const page = await getActivePage(stagehand);
    await page.waitForSelector(`text=${text}`, { timeout });
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract structured data from the page using AI
 */
export async function extractData<T extends z.ZodType>(
  stagehand: Stagehand,
  instruction: string,
  schema: T
): Promise<z.infer<T>> {
  return stagehand.extract(instruction, schema) as z.infer<T>;
}

/**
 * Perform an AI-driven action
 */
export async function performAction(
  stagehand: Stagehand,
  instruction: string
): Promise<void> {
  await stagehand.act(instruction);
}

/**
 * Check if an element exists on the page
 */
export async function elementExists(
  stagehand: Stagehand,
  selector: string
): Promise<boolean> {
  try {
    const page = await getActivePage(stagehand);
    const element = await page.locator(selector).first();
    return (await element.count()) > 0;
  } catch {
    return false;
  }
}

/**
 * Take a screenshot for debugging
 */
export async function captureDebugScreenshot(
  stagehand: Stagehand,
  name: string
): Promise<void> {
  const page = await getActivePage(stagehand);
  await page.screenshot({
    path: `test-results/ai-tests/debug-${name}-${Date.now()}.png`,
  });
}

/**
 * Clean up Stagehand instance
 */
export async function cleanup(stagehand: Stagehand): Promise<void> {
  await stagehand.close();
}

/**
 * Create a test context with setup and teardown
 */
export function createTestContext(locale: Locale = 'sr-Latn'): {
  setup: () => Promise<TestContext>;
  teardown: (ctx: TestContext) => Promise<void>;
} {
  return {
    setup: async () => {
      const stagehand = await createStagehand();
      return { stagehand, locale };
    },
    teardown: async (ctx: TestContext) => {
      await cleanup(ctx.stagehand);
    },
  };
}
