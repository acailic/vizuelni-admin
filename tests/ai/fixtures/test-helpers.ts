import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';
import {
  createStagehandInstance,
  BASE_URL,
  TEST_CONFIG,
  type Locale,
} from '../stagehand.config';

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
  const url = `${BASE_URL}/${locale}${path}`;
  const page = stagehand.context.pages()[0];
  await page.goto(url);
  // Wait for page to be interactive
  await page.waitForLoadState('domcontentloaded');
  // Buffer for React hydration
  await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);
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
    const page = stagehand.context.pages()[0];
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
    const page = stagehand.context.pages()[0];
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
  const page = stagehand.context.pages()[0];
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
