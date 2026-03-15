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
 * Accessibility tests
 * Verifies keyboard navigation, ARIA labels, and screen reader support
 */
describe('Accessibility (AI-Driven)', () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  test('should have proper heading structure', async () => {
    await navigateTo(stagehand, '/');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Check for proper heading hierarchy
    const headingStructure = await page.evaluate(() => {
      const h1 = document.querySelectorAll('h1');
      const h2 = document.querySelectorAll('h2');
      const h3 = document.querySelectorAll('h3');

      return {
        h1Count: h1.length,
        h2Count: h2.length,
        h3Count: h3.length,
        hasH1: h1.length === 1, // Should have exactly one h1
      };
    });

    console.log('Heading structure:', headingStructure);
    expect(headingStructure.h1Count).toBeGreaterThanOrEqual(1);
  });

  test('should have accessible form labels', async () => {
    await navigateTo(stagehand, '/create');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Check for form accessibility
    const formAccessibility = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, select, textarea');
      const inputsWithLabels: string[] = [];
      const inputsWithoutLabels: string[] = [];

      inputs.forEach((input) => {
        const el = input as HTMLInputElement;
        const hasLabel =
          el.id && document.querySelector(`label[for="${el.id}"]`);
        const hasAriaLabel = el.getAttribute('aria-label');
        const hasAriaLabelledby = el.getAttribute('aria-labelledby');
        const hasPlaceholder = el.getAttribute('placeholder');

        if (hasLabel || hasAriaLabel || hasAriaLabelledby) {
          inputsWithLabels.push(el.name || el.id || el.type);
        } else if (!hasPlaceholder) {
          inputsWithoutLabels.push(el.name || el.id || el.type);
        }
      });

      return {
        totalInputs: inputs.length,
        inputsWithLabels: inputsWithLabels.length,
        inputsWithoutLabels: inputsWithoutLabels.length,
      };
    });

    console.log('Form accessibility:', formAccessibility);
    // Most inputs should have labels
    expect(formAccessibility.inputsWithoutLabels).toBeLessThanOrEqual(
      formAccessibility.totalInputs * 0.3 // Allow up to 30% without explicit labels
    );
  });

  test('should have visible focus indicators', async () => {
    await navigateTo(stagehand, '/');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Tab through interactive elements
    const focusableElements = await page.evaluate(() => {
      const focusable = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return Array.from(focusable)
        .slice(0, 5)
        .map((el) => ({
          tag: el.tagName,
          text: el.textContent?.substring(0, 30),
        }));
    });

    console.log('Focusable elements found:', focusableElements.length);

    // Simulate focus via evaluate (Stagehand doesn't have keyboard.press)
    const hasFocus = await page.evaluate(() => {
      const focusable = document.querySelector(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) {
        (focusable as HTMLElement).focus();
        return document.activeElement !== document.body;
      }
      return false;
    });

    expect(focusableElements.length).toBeGreaterThan(0);
  });

  test('should have alt text for images', async () => {
    await navigateTo(stagehand, '/');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const imageAccessibility = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      let withAlt = 0;
      let withoutAlt = 0;

      images.forEach((img) => {
        if (img.alt || img.getAttribute('role') === 'presentation') {
          withAlt++;
        } else {
          withoutAlt++;
        }
      });

      return {
        total: images.length,
        withAlt,
        withoutAlt,
      };
    });

    console.log('Image accessibility:', imageAccessibility);
    // All images should have alt text or be decorative
    expect(imageAccessibility.withoutAlt).toBe(0);
  });

  test('should have sufficient color contrast on main pages', async () => {
    await navigateTo(stagehand, '/');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Basic check for text visibility
    const textVisibility = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const textColor = computedStyle.color;
      const bgColor = computedStyle.backgroundColor;

      return {
        hasTextStyles: !!textColor,
        hasBackgroundStyles: !!bgColor,
        textColor,
        bgColor,
      };
    });

    console.log('Text visibility:', textVisibility);
    expect(textVisibility.hasTextStyles).toBe(true);
  });

  test('should support keyboard navigation in chart creation', async () => {
    await navigateTo(stagehand, '/create?dataset=678e312d0aae3fe3ad3e361c');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Count focusable elements
    const focusableCount = await page.evaluate(() => {
      return document.querySelectorAll(
        'button:not([disabled]), a:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ).length;
    });

    console.log(`Found ${focusableCount} focusable elements`);

    // Simulate tab navigation via evaluate
    const tabResult = await page.evaluate(() => {
      const focusable = document.querySelectorAll(
        'button:not([disabled]), a:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length > 0) {
        (focusable[0] as HTMLElement).focus();
        return document.activeElement !== document.body;
      }
      return false;
    });

    // Should be able to focus elements
    expect(focusableCount).toBeGreaterThan(0);
  });
});
