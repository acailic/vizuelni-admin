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
 * Responsive design tests
 * Verifies the application works on different screen sizes
 */
describe('Responsive Design (AI-Driven)', () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'wide', width: 1920, height: 1080 },
  ];

  test.each(viewports)(
    'should render homepage on $name ($widthx$height)',
    async ({ width, height, name }) => {
      await navigateTo(stagehand, '/');
      const page = await getActivePage(stagehand);

      // Resize viewport
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

      // Check for horizontal overflow
      const hasOverflow = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth
        );
      });

      // Get visible content
      const contentMetrics = await page.evaluate(() => {
        const body = document.body;
        const visibleText = body.textContent!.length;
        const hasContent = visibleText > 100;

        return {
          hasContent,
          textLength: visibleText,
          hasOverflow:
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
        };
      });

      console.log(`${name} (${width}x${height}):`, contentMetrics);

      // Page should have content
      expect(contentMetrics.hasContent).toBe(true);
    }
  );

  test('should have working mobile navigation', async () => {
    await navigateTo(stagehand, '/');
    const page = await getActivePage(stagehand);

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Check for mobile menu toggle using evaluate
    const mobileMenuInfo = await page.evaluate(() => {
      const menuToggles = document.querySelectorAll(
        '[data-testid="mobile-menu"], button[aria-label*="menu"], button[aria-label*="meni"], .mobile-menu-toggle, [class*="hamburger"]'
      );

      const navLinks = document.querySelectorAll(
        'nav a, [role="navigation"] a'
      );

      return {
        hasMobileMenuToggle: menuToggles.length > 0,
        navLinkCount: navLinks.length,
      };
    });

    console.log(
      `Mobile menu toggle found: ${mobileMenuInfo.hasMobileMenuToggle}`
    );
    console.log(`Nav links found: ${mobileMenuInfo.navLinkCount}`);

    // Page should still be functional
    const url = page.url();
    expect(url).toBeTruthy();
    expect(
      mobileMenuInfo.navLinkCount + (mobileMenuInfo.hasMobileMenuToggle ? 1 : 0)
    ).toBeGreaterThan(0);
  });

  test('should adapt chart creation UI for tablet', async () => {
    await navigateTo(
      stagehand,
      '/create?dataset=678e312d0aae3fe3ad3e361c&type=bar'
    );
    const page = await getActivePage(stagehand);

    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Check that chart creation elements are visible
    const uiElements = await page.evaluate(() => {
      const configurator = document.querySelector(
        '[class*="configurator"], [data-testid="configurator"], aside, nav'
      );
      const preview = document.querySelector(
        '[class*="preview"], [class*="chart"], canvas, svg'
      );

      return {
        hasConfigurator: !!configurator,
        hasPreview: !!preview,
        configuratorVisible: configurator
          ? window.getComputedStyle(configurator).display !== 'none'
          : false,
      };
    });

    console.log('Tablet UI elements:', uiElements);
    expect(uiElements.hasConfigurator || uiElements.hasPreview).toBe(true);
  });

  test('should maintain functionality on small screens', async () => {
    await navigateTo(stagehand, '/browse');
    const page = await getActivePage(stagehand);

    // Set small mobile viewport
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Check for usable UI elements
    const usability = await page.evaluate(() => {
      // Check for overlapping elements
      const buttons = document.querySelectorAll('button');
      let visibleButtons = 0;

      buttons.forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          visibleButtons++;
        }
      });

      return {
        totalButtons: buttons.length,
        visibleButtons,
        pageHeight: document.documentElement.scrollHeight,
      };
    });

    console.log('Small screen usability:', usability);
    expect(usability.visibleButtons).toBeGreaterThan(0);
  });

  test('should handle orientation change', async () => {
    await navigateTo(stagehand, '/create?dataset=678e312d0aae3fe3ad3e361c');
    const page = await getActivePage(stagehand);

    // Portrait
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const portraitContent = await page.evaluate(
      () => document.body.textContent!.length
    );

    // Landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);

    const landscapeContent = await page.evaluate(
      () => document.body.textContent!.length
    );

    console.log(
      `Portrait: ${portraitContent} chars, Landscape: ${landscapeContent} chars`
    );

    // Content should be present in both orientations
    expect(portraitContent).toBeGreaterThan(100);
    expect(landscapeContent).toBeGreaterThan(100);
  });
});
