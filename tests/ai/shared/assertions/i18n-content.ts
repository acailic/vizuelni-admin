/**
 * i18n content assertions
 */

import { expect } from 'vitest';
import type { Page } from '@playwright/test';

export async function assertTextPresent(
  page: Page,
  texts: string[],
  context?: string
): Promise<void> {
  const bodyText = (await page.textContent('body')) ?? '';
  const found = texts.some((text) => bodyText.includes(text));

  expect(
    found,
    `${context ?? 'Page'} should contain at least one of: ${texts.join(', ')}`
  ).toBe(true);
}

export async function assertHeadingStructure(
  page: Page
): Promise<{ valid: boolean; issues: string[] }> {
  const issues: string[] = [];

  const headings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
      (h) => ({
        tag: h.tagName,
        text: h.textContent?.trim().slice(0, 50) ?? '',
      })
    );
  });

  const h1Count = headings.filter((h) => h.tag === 'H1').length;
  if (h1Count === 0) issues.push('No h1 found');
  else if (h1Count > 1) issues.push(`Multiple h1 elements: ${h1Count}`);

  const levels = headings.map((h) => parseInt(h.tag[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      issues.push(`Heading skip: h${levels[i - 1]} to h${levels[i]}`);
    }
  }

  const valid = issues.length === 0;
  expect(valid, `Heading structure should be valid: ${issues.join('; ')}`).toBe(
    true
  );
  return { valid, issues };
}

export async function assertImageAlts(
  page: Page
): Promise<{ total: number; missing: number }> {
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map((img) => ({
      hasAlt: !!img.alt || img.getAttribute('role') === 'presentation',
    }));
  });

  const missing = images.filter((img) => !img.hasAlt).length;
  expect(missing, 'All images should have alt text').toBe(0);

  return { total: images.length, missing };
}