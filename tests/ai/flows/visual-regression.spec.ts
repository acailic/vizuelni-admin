import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
} from '../fixtures/test-helpers';
import { TEST_CONFIG } from '../stagehand.config';
import { runFullVisualCheck } from '../helpers/visual-checks';

/**
 * Visual Regression Tests
 * Detects when UI elements become invisible due to styling changes
 * Tests all public pages in sr-Cyrl locale (most complex Cyrillic rendering)
 *
 * Prerequisites: Dev server must be running at localhost:3000
 */
describe('Visual Regression (AI-Driven)', () => {
  let stagehand: Awaited<ReturnType<typeof createStagehand>>;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  const locale = 'sr-Cyrl';

  // ========================================
  // CRITICAL PAGES
  // ========================================

  test('homepage - all content visible', async () => {
    await navigateTo(stagehand, '/', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Homepage visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
      visibleButtons: results.visibleButtons,
      hasHorizontalScroll: results.hasHorizontalScroll,
    });

    // No low-contrast text elements
    expect(results.lowContrastElements).toHaveLength(0);

    // No obscured interactive elements
    expect(results.obscuredElements).toHaveLength(0);

    // No horizontal scroll
    expect(results.hasHorizontalScroll).toBe(false);

    // Should have visible content
    expect(results.visibleTextElements).toBeGreaterThan(10);
  });

  test('browse page - all content visible', async () => {
    await navigateTo(stagehand, '/browse', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer * 2); // Extra time for data loading

    const results = await runFullVisualCheck(stagehand);

    console.log('Browse visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
      visibleButtons: results.visibleButtons,
      visibleLinks: results.visibleLinks,
    });

    expect(results.lowContrastElements).toHaveLength(0);
    expect(results.visibleButtons).toBeGreaterThan(0);
    expect(results.visibleLinks).toBeGreaterThan(0);
  });

  test('create page - all content visible', async () => {
    await navigateTo(stagehand, '/create', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Create visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
      visibleInputs: results.visibleInputs,
      visibleButtons: results.visibleButtons,
    });

    expect(results.lowContrastElements).toHaveLength(0);
    expect(results.visibleInputs).toBeGreaterThan(0);
  });

  // ========================================
  // HIGH PRIORITY PAGES
  // ========================================

  test('gallery page - all content visible', async () => {
    await navigateTo(stagehand, '/gallery', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Gallery visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
    });

    expect(results.lowContrastElements).toHaveLength(0);
  });

  test('charts page - all content visible', async () => {
    await navigateTo(stagehand, '/charts', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Charts visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
    });

    expect(results.lowContrastElements).toHaveLength(0);
  });

  // ========================================
  // MEDIUM PRIORITY PAGES
  // ========================================

  test('demo page - all content visible', async () => {
    await navigateTo(stagehand, '/demo', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Demo visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
    });

    expect(results.lowContrastElements).toHaveLength(0);
  });

  test('demo-gallery - all content visible', async () => {
    await navigateTo(stagehand, '/demo-gallery', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Demo-gallery visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
    });

    expect(results.lowContrastElements).toHaveLength(0);
  });

  test('statistics - all content visible', async () => {
    await navigateTo(stagehand, '/statistics', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Statistics visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
    });

    expect(results.lowContrastElements).toHaveLength(0);
  });

  test('accessibility - all content visible', async () => {
    await navigateTo(stagehand, '/accessibility', locale);
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    const results = await runFullVisualCheck(stagehand);

    console.log('Accessibility visual check:', {
      visibleText: results.visibleTextElements,
      lowContrast: results.lowContrastElements.length,
    });

    expect(results.lowContrastElements).toHaveLength(0);
  });
});
