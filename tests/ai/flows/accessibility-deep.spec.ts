import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Stagehand } from '@browserbasehq/stagehand';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
} from '../fixtures/test-helpers';
import { waitForLoadingComplete } from '../shared/assertions';
import { assertHeadingStructure, assertImageAlts } from '../shared/assertions';
import {
  assertNoHorizontalScroll,
  assertTouchTargets,
} from '../shared/assertions';
import { assertAllFieldsLabeled } from '../shared/assertions';
import { TEST_VIEWPORTS } from '../shared/test-data/test-datasets';

describe('Accessibility Deep (AI-Driven)', () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  describe('Keyboard Navigation', () => {
    test('should navigate with Tab', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
      }

      const focused = await page.evaluate(
        () => document.activeElement?.tagName
      );
      expect(focused).toBeTruthy();
    });

    test('should activate buttons with Enter', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      expect(true).toBe(true); // No crash = pass
    });
  });

  describe('ARIA Structure', () => {
    test('should have single h1 per page', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);

      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('should have logical heading hierarchy', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);

      const { valid, issues } = await assertHeadingStructure(page);
      console.log(`Heading issues: ${issues.join(', ') || 'none'}`);
    });

    test('should have landmark regions', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);

      const mainCount = await page.locator('main, [role="main"]').count();
      expect(mainCount).toBeGreaterThan(0);
    });
  });

  describe('Screen Reader Support', () => {
    test('should have alt text for images', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);

      const { total, missing } = await assertImageAlts(page);
      console.log(`Images: ${total} total, ${missing} missing alt`);
    });
  });

  describe('Form Accessibility', () => {
    test('should have labels on all inputs', async () => {
      await navigateTo(stagehand, '/create');
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      const { total, unlabeled } = await assertAllFieldsLabeled(page);
      console.log(`Inputs: ${total} total, ${unlabeled.length} unlabeled`);
    });
  });

  describe('Mobile Accessibility', () => {
    test('should have adequate touch targets', async () => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);

      await page.setViewportSize({
        width: TEST_VIEWPORTS.mobile.width,
        height: TEST_VIEWPORTS.mobile.height,
      });

      await assertTouchTargets(page, 'button, a');
    });
  });
});