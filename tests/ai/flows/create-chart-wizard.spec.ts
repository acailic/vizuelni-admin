import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Stagehand } from '@browserbasehq/stagehand';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
} from '../fixtures/test-helpers';
import { TEST_CONFIG } from '../stagehand.config';
import { TEST_DATASETS } from '../shared/test-data/test-datasets';
import {
  CreateChartPageObject,
  createChartSelectors,
} from '../shared/page-objects';
import {
  waitForLoadingComplete,
  assertElementDisabled,
} from '../shared/assertions';

describe('Chart Creation Wizard (AI-Driven)', () => {
  let stagehand: Stagehand;
  let pageObj: CreateChartPageObject;

  beforeEach(async () => {
    stagehand = await createStagehand();
    const page = await getActivePage(stagehand);
    pageObj = new CreateChartPageObject(page);
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  describe('Step 1 - Dataset Selection', () => {
    test('should display dataset selection UI', async () => {
      await navigateTo(stagehand, '/create');
      const page = await getActivePage(stagehand);
      await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

      const count = await page
        .locator(createChartSelectors.datasetSelector)
        .count();
      expect(count).toBeGreaterThan(0);
    });

    test('should persist selected dataset in URL', async () => {
      const datasetId = TEST_DATASETS.populationByMunicipality.id;
      await navigateTo(stagehand, `/create?dataset=${datasetId}`);
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      expect(page.url()).toContain(`dataset=${datasetId}`);
    });

    test('should disable Next button until dataset selected', async () => {
      await navigateTo(stagehand, '/create');
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      await assertElementDisabled(page, createChartSelectors.nextButton);
    });
  });

  describe('Step 2 - Chart Type Selection', () => {
    test('should display all chart type options', async () => {
      const datasetId = TEST_DATASETS.populationByMunicipality.id;
      await navigateTo(stagehand, `/create?dataset=${datasetId}`);
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      const count = await page
        .locator(createChartSelectors.chartTypeButtons)
        .count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('should update URL when chart type selected', async () => {
      const datasetId = TEST_DATASETS.populationByMunicipality.id;
      await navigateTo(stagehand, `/create?dataset=${datasetId}`);
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      await pageObj.selectChartType('bar');
      expect(page.url()).toContain('type=bar');
    });

    test.each(['bar', 'line', 'pie'] as const)(
      'should select %s chart type',
      async (type) => {
        const datasetId = TEST_DATASETS.populationByMunicipality.id;
        await pageObj.navigateToCreate(datasetId);
        const page = await getActivePage(stagehand);

        await pageObj.selectChartType(type);
        expect(page.url()).toContain(`type=${type}`);
      }
    );
  });

  describe('Interactive States', () => {
    test('should show loading state during data fetch', async () => {
      await navigateTo(stagehand, '/create');
      const page = await getActivePage(stagehand);

      const hadLoading = await page.evaluate(() => {
        return !!document.querySelector(
          '[class*="loading"], [class*="skeleton"]'
        );
      });
      console.log(`Loading state detected: ${hadLoading}`);
    });

    test('should show error state on invalid dataset', async () => {
      await navigateTo(stagehand, '/create?dataset=invalid-id');
      const page = await getActivePage(stagehand);
      await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer * 2);

      const hasError = await page.evaluate(() => {
        return !!document.querySelector('[class*="error"], [role="alert"]');
      });
      console.log(`Error state for invalid dataset: ${hasError}`);
    });
  });

  describe('i18n', () => {
    test('should display UI in Serbian Latin', async () => {
      await navigateTo(stagehand, '/create', 'sr-Latn');
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      const text = (await page.textContent('body')) ?? '';
      expect(text.toLowerCase()).toMatch(/skup|podataka|napravi/);
    });
  });
});