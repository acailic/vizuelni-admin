import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';
import {
  createStagehandInstance,
  getBaseUrl,
  TEST_CONFIG,
  LOCALES,
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

export interface ResolvedLocalizedRoute {
  locale: Locale;
  path: string;
  localizedPath: string;
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
  const route = resolveLocalizedRoute(path, locale);
  const url = `${baseUrl}${route.localizedPath}`;
  const page = await getActivePage(stagehand);

  // Use networkidle for better Lightpanda compatibility
  // Fall back to just waiting if it times out
  try {
    await page.goto(url, { waitUntil: 'load', timeoutMs: 30000 });
  } catch {
    // If goto times out, just wait a bit and continue
    console.log(`Navigation timeout, continuing anyway: ${url}`);
  }

  // Buffer for React hydration
  await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);
}

export function resolveLocalizedRoute(
  path: string,
  fallbackLocale: Locale = 'sr-Latn'
): ResolvedLocalizedRoute {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const parts = normalizedPath.split('/').filter(Boolean);
  const localeCandidate = parts[0];

  if (localeCandidate && LOCALES.includes(localeCandidate as Locale)) {
    const resolvedPath = `/${parts.slice(1).join('/')}` || '/';
    return {
      locale: localeCandidate as Locale,
      path: resolvedPath === '//' ? '/' : resolvedPath,
      localizedPath: normalizedPath === '' ? '/' : normalizedPath,
    };
  }

  return {
    locale: fallbackLocale,
    path: normalizedPath,
    localizedPath:
      normalizedPath === '/'
        ? `/${fallbackLocale}`
        : `/${fallbackLocale}${normalizedPath}`,
  };
}

/**
 * Get the active page from Stagehand context
 */
export async function getActivePage(stagehand: Stagehand): Promise<any> {
  let page = stagehand.context.pages()[0];
  if (!page) {
    page = await stagehand.context.newPage();
  }
  return page;
}

export async function createDomSummary(page: any): Promise<string> {
  const summary = await page.evaluate(() => {
    const bodyText = (document.body.innerText || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1200);
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
      .map((heading) => heading.textContent?.trim())
      .filter(Boolean)
      .slice(0, 12);
    const buttons = Array.from(document.querySelectorAll('button'))
      .map(
        (button) =>
          button.textContent?.trim() || button.getAttribute('aria-label')
      )
      .filter(Boolean)
      .slice(0, 12);
    const links = Array.from(document.querySelectorAll('a[href]'))
      .map(
        (link) => link.textContent?.trim() || link.getAttribute('aria-label')
      )
      .filter(Boolean)
      .slice(0, 12);
    const forms = document.querySelectorAll('form').length;
    const inputs = document.querySelectorAll('input, select, textarea').length;
    const landmarks = Array.from(
      document.querySelectorAll('main, nav, header, footer, aside, section')
    )
      .map((element) => element.tagName.toLowerCase())
      .slice(0, 20);

    return {
      bodyText,
      headings,
      buttons,
      links,
      forms,
      inputs,
      landmarks,
    };
  });

  return [
    `Headings: ${summary.headings.join(' | ') || 'none'}`,
    `Buttons: ${summary.buttons.join(' | ') || 'none'}`,
    `Links: ${summary.links.join(' | ') || 'none'}`,
    `Forms: ${summary.forms}, Inputs: ${summary.inputs}`,
    `Landmarks: ${summary.landmarks.join(', ') || 'none'}`,
    `Visible text excerpt: ${summary.bodyText || 'none'}`,
  ].join('\n');
}

// Add animationBuffer to TEST_CONFIG if not present
declare module '../stagehand.config' {
  interface TEST_CONFIG {
    animationBuffer?: number;
  }
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
