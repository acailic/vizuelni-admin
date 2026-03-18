/**
 * Common assertion helpers for AI-driven tests
 */

import { expect } from 'vitest';
import type { Page } from '@playwright/test';

/**
 * Wait for loading state to complete by checking for loading indicators
 */
export async function waitForLoadingComplete(page: Page): Promise<void> {
  try {
    // Wait for any loading indicators to disappear
    await page.waitForFunction(() => {
      return !document.querySelector(
        '[class*="loading"], [class*="skeleton"], .spinner, .loading-spinner'
      );
    }, { timeout: 15000 });
  } catch {
    // If loading indicators don't disappear, just continue
    console.log('Loading indicators still present or not found, continuing...');
  }

  // Additional wait for stability
  await page.waitForTimeout(500);
}

/**
 * Assert no horizontal scroll exists on the page
 */
export async function assertNoHorizontalScroll(page: Page): Promise<void> {
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });

  if (hasHorizontalScroll) {
    console.warn('Page has horizontal scroll - this may indicate layout issues');
  }

  expect(hasHorizontalScroll).toBe(false);
}

/**
 * Assert responsive layout for a given viewport
 */
export async function assertResponsiveLayout(
  page: Page,
  width: number,
  height: number
): Promise<{ issues: string[] }> {
  const issues: string[] = [];

  // Set viewport size
  await page.setViewportSize({ width, height });

  // Wait a bit for layout adjustments
  await page.waitForTimeout(500);

  // Check for horizontal scroll
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });

  if (hasHorizontalScroll) {
    issues.push('Horizontal scroll present');
  }

  // Check for visible content
  const hasContent = await page.evaluate(() => {
    return document.body.textContent!.length > 50;
  });

  if (!hasContent) {
    issues.push('No visible content');
  }

  // Check for critical elements being visible
  const criticalSelectors = ['h1', 'main', '[data-testid]', '.content'];
  for (const selector of criticalSelectors) {
    const elementCount = await page.locator(selector).count();
    if (elementCount === 0) {
      issues.push(`No critical elements found: ${selector}`);
    }
  }

  // Log debug info
  console.log(`Responsive layout check (${width}x${height}):`, {
    horizontalScroll: hasHorizontalScroll,
    contentLength: await page.evaluate(() => document.body.textContent!.length),
    criticalElements: criticalSelectors.map(s => ({
      selector: s,
      count: page.locator(s).count()
    }))
  });

  return { issues };
}

/**
 * Assert that an element is disabled
 */
export async function assertElementDisabled(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  const isDisabled = await element.isDisabled();
  expect(isDisabled).toBe(true);
}