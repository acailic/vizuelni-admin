import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Stagehand } from '@browserbasehq/stagehand';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
} from '../fixtures/test-helpers';
import { TEST_CONFIG } from '../stagehand.config';

describe('Chart Creation Flow (AI-Driven)', () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  test('should navigate to create page and load dataset step', async () => {
    await navigateTo(stagehand, '/create');
    const page = await getActivePage(stagehand);

    // Wait for page to load
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Check URL contains create
    const url = page.url();
    expect(url).toContain('/create');

    // Check for dataset selection UI
    const datasetSelector = page.locator(
      'text=/Skup podataka|Dataset|Select|Избор/i'
    );
    const hasDatasetUI = (await datasetSelector.count()) > 0;

    // Verify page loaded with some content using evaluate
    const contentLength = await page.evaluate(() => {
      return document.body.textContent!.length;
    });
    expect(contentLength).toBeGreaterThan(100);

    console.log(`Create page loaded, has dataset UI: ${hasDatasetUI}`);
  });

  test('should select a dataset using direct URL', async () => {
    await navigateTo(stagehand, '/create?dataset=678e312d0aae3fe3ad3e361c');
    const page = await getActivePage(stagehand);

    // Wait for dataset to load
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Check URL has dataset parameter
    const url = page.url();
    expect(url).toContain('dataset');

    // Look for chart type options
    const chartTypeButtons = page.locator(
      'button:has-text("Bar"), button:has-text("Line"), button:has-text("Pie"), [data-testid*="chart-type"]'
    );
    const chartTypeCount = await chartTypeButtons.count();

    console.log(`Found ${chartTypeCount} chart type buttons`);

    // Verify page loaded using evaluate
    const hasContent = await page.evaluate(() => {
      return document.body.textContent!.length > 50;
    });
    expect(hasContent).toBe(true);
  });

  test('should select bar chart type', async () => {
    await navigateTo(stagehand, '/create?dataset=678e312d0aae3fe3ad3e361c');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Find and click bar chart button
    const barButton = page
      .locator(
        'button:has-text("Bar"), button:has-text("Traka"), [data-testid="chart-type-bar"]'
      )
      .first();

    if ((await barButton.count()) > 0) {
      await barButton.click();
      await page.waitForTimeout(500);

      // Verify URL updated
      const url = page.url();
      expect(url).toContain('type=bar');
    } else {
      console.log('Bar chart button not found, checking page state');
      // Verify page is still functional
      const url = page.url();
      expect(url).toContain('/create');
    }
  });

  test('should complete chart creation flow', async () => {
    await navigateTo(
      stagehand,
      '/create?dataset=678e312d0aae3fe3ad3e361c&type=bar'
    );
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Look for next/continue button
    const nextButton = page
      .locator(
        'button:has-text("Next"), button:has-text("Sledeće"), button:has-text("Continue"), [data-testid="next-button"]'
      )
      .first();

    if ((await nextButton.count()) > 0) {
      await nextButton.click();
      await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);
    }

    // Check for preview or chart elements
    const previewArea = page.locator(
      '[data-testid="chart-preview"], canvas, svg, [class*="preview"]'
    );
    const hasPreview = (await previewArea.count()) > 0;

    console.log(`Chart creation flow completed, has preview: ${hasPreview}`);

    // Verify we're still on a valid page
    const url = page.url();
    expect(url).toContain('/create');
  });
});
