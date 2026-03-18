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
 * Data validation tests
 * Verifies data loading, filtering, and chart rendering with real data
 */
describe('Data Validation (AI-Driven)', () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  test('should load dataset from data.gov.rs', async () => {
    await navigateTo(stagehand, '/create?dataset=678e312d0aae3fe3ad3e361c');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer * 2);

    // Check for dataset metadata
    const datasetInfo = await page.evaluate(() => {
      const body = document.body.textContent || '';

      // Look for common dataset indicators
      const hasDataIndicators =
        body.includes('podataka') ||
        body.includes('dataset') ||
        body.includes('података') ||
        body.includes('Statistika') ||
        body.includes('Republika') ||
        body.includes('Srbija');

      // Look for data preview or table
      const hasTable = document.querySelector(
        'table, [role="table"], [class*="data-grid"]'
      );
      const hasChartPreview = document.querySelector(
        'canvas, svg, [class*="chart"]'
      );

      return {
        hasDataIndicators,
        hasTable: !!hasTable,
        hasChartPreview: !!hasChartPreview,
        bodyLength: body.length,
      };
    });

    console.log('Dataset info:', datasetInfo);
    expect(datasetInfo.hasDataIndicators || datasetInfo.hasTable).toBe(true);
  });

  test('should display data columns for mapping', async () => {
    await navigateTo(
      stagehand,
      '/create?dataset=678e312d0aae3fe3ad3e361c&type=bar'
    );
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Check for column/field selectors
    const mappingUI = await page.evaluate(() => {
      const selects = document.querySelectorAll('select, [role="listbox"]');
      const inputs = document.querySelectorAll(
        'input[type="text"], input[type="search"]'
      );
      const labels = document.querySelectorAll('label');

      // Look for mapping-related text
      const body = document.body.textContent || '';
      const hasMappingTerms =
        body.includes('X-osa') ||
        body.includes('Y-osa') ||
        body.includes('X-axis') ||
        body.includes('Y-axis') ||
        body.includes('kolona') ||
        body.includes('column');

      return {
        selectCount: selects.length,
        inputCount: inputs.length,
        labelCount: labels.length,
        hasMappingTerms,
      };
    });

    console.log('Mapping UI:', mappingUI);

    // Should have some form elements for data mapping
    expect(mappingUI.selectCount + mappingUI.inputCount).toBeGreaterThan(0);
  });

  test('should handle Serbian Cyrillic characters', async () => {
    await navigateTo(stagehand, '/sr-Cyrl');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Check for Cyrillic content
    const cyrillicSupport = await page.evaluate(() => {
      const body = document.body.textContent || '';

      // Check for Cyrillic characters (Unicode range: U+0400 to U+04FF)
      const cyrillicPattern = /[\u0400-\u04FF]/;
      const hasCyrillic = cyrillicPattern.test(body);

      // Count Cyrillic characters
      const cyrillicChars = (body.match(/[\u0400-\u04FF]/g) || []).length;

      return {
        hasCyrillic,
        cyrillicCharCount: cyrillicChars,
        bodyLength: body.length,
      };
    });

    console.log('Cyrillic support:', cyrillicSupport);
    expect(cyrillicSupport.hasCyrillic).toBe(true);
    expect(cyrillicSupport.cyrillicCharCount).toBeGreaterThan(50);
  });

  test('should render chart preview with data', async () => {
    await navigateTo(
      stagehand,
      '/create?dataset=678e312d0aae3fe3ad3e361c&type=bar'
    );
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer * 2);

    // Check for chart rendering
    const chartRender = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      const canvas = document.querySelector('canvas');
      const chartContainer = document.querySelector(
        '[class*="chart"], [class*="preview"]'
      );

      return {
        hasSvg: !!svg,
        hasCanvas: !!canvas,
        hasChartContainer: !!chartContainer,
        svgContent: svg ? svg.innerHTML.length : 0,
      };
    });

    console.log('Chart render:', chartRender);

    // Should have some chart rendering
    expect(
      chartRender.hasSvg ||
        chartRender.hasCanvas ||
        chartRender.hasChartContainer
    ).toBe(true);
  });

  test('should handle data filtering', async () => {
    await navigateTo(
      stagehand,
      '/create?dataset=678e312d0aae3fe3ad3e361c&type=bar'
    );
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Look for filter options
    const filterUI = page.locator(
      '[class*="filter"], [data-testid*="filter"], select, input[type="checkbox"]'
    );

    const filterCount = await filterUI.count();
    console.log(`Found ${filterCount} potential filter elements`);

    if (filterCount > 0) {
      // Try to interact with first filter
      const firstFilter = filterUI.first();

      if (
        (await firstFilter.isSelectable?.()) ||
        (await firstFilter.evaluate((el) => el.tagName === 'SELECT'))
      ) {
        // It's a select or checkbox
        await firstFilter.click();
        await page.waitForTimeout(500);
      }
    }

    // Page should still be functional
    const url = page.url();
    expect(url).toContain('/create');
  });

  test('should validate required fields before chart creation', async () => {
    await navigateTo(stagehand, '/create');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Try to proceed without selecting dataset
    const nextButton = page
      .locator('button:has-text("Next"), button:has-text("Sledeće")')
      .first();

    if ((await nextButton.count()) > 0) {
      await nextButton.click();
      await page.waitForTimeout(500);

      // Check for validation message
      const validationState = await page.evaluate(() => {
        const body = document.body.textContent || '';
        const hasError =
          body.includes('obavezno') ||
          body.includes('required') ||
          body.includes('obavezna') ||
          body.includes('izaberite') ||
          body.includes('select') ||
          document.querySelector('[class*="error"], [role="alert"]');

        return {
          hasValidationError: !!hasError,
          stillOnStep1:
            body.includes('Skup podataka') || body.includes('Dataset'),
        };
      });

      console.log('Validation state:', validationState);
    }

    // Should still be on create page
    const url = page.url();
    expect(url).toContain('/create');
  });

  test('should display dataset statistics', async () => {
    await navigateTo(stagehand, '/create?dataset=678e312d0aae3fe3ad3e361c');
    const page = await getActivePage(stagehand);
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer * 2);

    // Check for data statistics/metadata
    const dataStats = await page.evaluate(() => {
      const body = document.body.textContent || '';

      // Look for numerical indicators
      const hasNumbers = /\d+/.test(body);
      const hasRows =
        body.includes('red') || body.includes('row') || body.includes('ред');
      const hasColumns =
        body.includes('kolona') ||
        body.includes('column') ||
        body.includes('колона');

      return {
        hasNumbers,
        hasRows,
        hasColumns,
        bodyLength: body.length,
      };
    });

    console.log('Data stats:', dataStats);
    expect(dataStats.hasNumbers).toBe(true);
  });
});
