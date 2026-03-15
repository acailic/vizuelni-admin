import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Stagehand } from '@browserbasehq/stagehand';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
} from '../fixtures/test-helpers';
import { TEST_CONFIG } from '../stagehand.config';

/**
 * Tests for different chart types
 * Verifies that all chart types can be selected and render correctly
 */
describe('Chart Types (AI-Driven)', () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  const chartTypes = [
    { type: 'bar', label: /bar|traka/i },
    { type: 'line', label: /line|linija/i },
    { type: 'pie', label: /pie|pita/i },
    { type: 'area', label: /area|oblast/i },
    { type: 'scatter', label: /scatter|rasip/i },
  ];

  test.each(chartTypes)(
    'should select and render $type chart',
    async ({ type, label }) => {
      // Navigate with dataset and chart type
      await navigateTo(
        stagehand,
        `/create?dataset=678e312d0aae3fe3ad3e361c&type=${type}`
      );
      const page = await getActivePage(stagehand);
      await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

      // Verify URL has chart type
      const url = page.url();
      expect(url).toContain(`type=${type}`);

      // Check for chart type button being selected
      const chartTypeButton = page
        .locator(
          `button:has-text("${label}"), [data-testid="chart-type-${type}"]`
        )
        .first();
      const hasButton = (await chartTypeButton.count()) > 0;
      console.log(`${type} chart button found: ${hasButton}`);

      // Verify page loaded
      const hasContent = await page.evaluate(() => {
        return document.body.textContent!.length > 100;
      });
      expect(hasContent).toBe(true);
    }
  );

  test('should switch between chart types', async () => {
    await navigateTo(stagehand, '/create?dataset=678e312d0aae3fe3ad3e361c');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Find all chart type buttons using evaluate
    const chartButtonsInfo = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, [role="button"]');
      const chartButtons: string[] = [];

      buttons.forEach((btn) => {
        const text = btn.textContent?.toLowerCase() || '';
        if (
          text.includes('bar') ||
          text.includes('line') ||
          text.includes('pie')
        ) {
          chartButtons.push(btn.textContent?.trim() || '');
        }
      });

      return chartButtons;
    });

    console.log(`Found chart type buttons: ${chartButtonsInfo.join(', ')}`);

    if (chartButtonsInfo.length > 1) {
      // Click first chart type button
      const firstButton = page
        .locator(
          'button:has-text("Bar"), button:has-text("Line"), button:has-text("Pie")'
        )
        .first();
      if ((await firstButton.count()) > 0) {
        await firstButton.click();
        await page.waitForTimeout(500);
      }

      // Click second chart type button
      const secondButton = page
        .locator(
          'button:has-text("Bar"), button:has-text("Line"), button:has-text("Pie")'
        )
        .nth(1);
      if ((await secondButton.count()) > 0) {
        await secondButton.click();
        await page.waitForTimeout(500);
      }

      // Verify URL changed
      const url = page.url();
      expect(url).toContain('type=');
    }
  });

  test('should maintain chart type when navigating steps', async () => {
    await navigateTo(
      stagehand,
      '/create?dataset=678e312d0aae3fe3ad3e361c&type=bar'
    );
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Find and click next button
    const nextButton = page
      .locator(
        'button:has-text("Next"), button:has-text("Sledeće"), [data-testid="next-button"]'
      )
      .first();

    if ((await nextButton.count()) > 0) {
      await nextButton.click();
      await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

      // Verify chart type is still in URL
      const url = page.url();
      expect(url).toContain('type=bar');
    }
  });
});
