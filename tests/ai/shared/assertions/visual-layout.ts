/**
 * Visual layout assertions
 */

import { expect } from 'vitest';
import type { Page } from '@playwright/test';

export async function assertVisibleInViewport(
  page: Page,
  selector: string
): Promise<void> {
  const element = page.locator(selector).first();
  await expect(element).toBeVisible();

  const box = await element.boundingBox();
  const viewport = page.viewportSize();

  if (box && viewport) {
    expect(box.x >= 0 && box.y >= 0).toBe(true);
  }
}

export async function assertNoHorizontalScroll(page: Page): Promise<void> {
  const hasScroll = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
    );
  });
  expect(hasScroll, 'Page should not have horizontal scroll').toBe(false);
}

export async function assertResponsiveLayout(
  page: Page,
  width: number,
  height: number
): Promise<{ issues: string[] }> {
  const issues: string[] = [];
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(500);

  const hasScroll = await page.evaluate(() => {
    return (
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
    );
  });
  if (hasScroll) issues.push(`Horizontal scroll at ${width}x${height}`);

  const mainVisible = await page
    .locator('main, [role="main"]')
    .isVisible()
    .catch(() => false);
  if (!mainVisible)
    issues.push(`Main content not visible at ${width}x${height}`);

  expect(issues, `Layout issues at ${width}x${height}`).toHaveLength(0);
  return { issues };
}

export async function assertTouchTargets(
  page: Page,
  selector: string
): Promise<void> {
  const elements = await page.locator(selector).all();

  for (const element of elements) {
    const box = await element.boundingBox().catch(() => null);
    if (box) {
      expect(
        box.width >= 44 && box.height >= 44,
        `Touch target too small: ${box.width}x${box.height}`
      ).toBe(true);
    }
  }
}