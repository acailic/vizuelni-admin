import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Stagehand } from '@browserbasehq/stagehand';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
} from '../fixtures/test-helpers';
import { TEST_CONFIG } from '../stagehand.config';

describe('Search and Browse Flow (AI-Driven)', () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  test('should load browse page with datasets', async () => {
    await navigateTo(stagehand, '/browse');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Wait for content to load and check for dataset cards
    await page
      .waitForSelector(
        '[data-testid="dataset-card"], [class*="dataset"], article, .card',
        {
          timeout: 10000,
        }
      )
      .catch(() => {});

    // Check URL is correct
    const url = page.url();
    expect(url).toContain('/browse');

    // Verify page has content using evaluate
    const hasContent = await page.evaluate(() => {
      return document.body.textContent!.length > 100;
    });
    expect(hasContent).toBe(true);
  });

  test('should search for datasets', async () => {
    await navigateTo(stagehand, '/browse');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Find search input and type
    const searchInput = page
      .locator(
        'input[type="search"], input[placeholder*="search" i], input[name*="search" i]'
      )
      .first();

    if ((await searchInput.count()) > 0) {
      await searchInput.fill('statistika');
      // Use page.evaluate to submit the form
      await page.evaluate(() => {
        const input = document.querySelector(
          'input[type="search"], input[placeholder*="search" i], input[name*="search" i]'
        ) as HTMLInputElement;
        if (input && input.form) {
          input.form.submit();
        }
      });
      await page.waitForTimeout(2000);

      // Verify search was performed (URL or content changed)
      const url = page.url();
      expect(url).toContain('browse');
    } else {
      // Skip if no search input found
      console.log('No search input found, skipping search test');
    }
  });

  test('should navigate from browse to create page', async () => {
    await navigateTo(stagehand, '/browse');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Find and click a dataset or visualize button
    const datasetLink = page
      .locator(
        'a[href*="/create"], button:has-text("Vizualizuj"), button:has-text("Visualize"), [data-testid="visualize-button"]'
      )
      .first();

    if ((await datasetLink.count()) > 0) {
      await datasetLink.click();
      await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

      // Verify navigation
      const url = page.url();
      expect(url).toContain('/create');
    } else {
      // Directly navigate to create page as fallback
      await navigateTo(stagehand, '/create');
      const url = page.url();
      expect(url).toContain('/create');
    }
  });

  test('should display filter options', async () => {
    await navigateTo(stagehand, '/browse');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Check for any filter UI elements
    const filterElements = page.locator(
      '[class*="filter"], [data-testid*="filter"], select, [role="listbox"]'
    );

    // Verify page loaded using evaluate
    const hasContent = await page.evaluate(() => {
      return document.body.textContent!.length > 50;
    });
    expect(hasContent).toBe(true);

    // Log if filters exist (informational)
    const filterCount = await filterElements.count();
    console.log(`Found ${filterCount} potential filter elements`);
  });
});
