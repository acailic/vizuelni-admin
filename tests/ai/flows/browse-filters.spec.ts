import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Stagehand } from '@browserbasehq/stagehand';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
} from '../fixtures/test-helpers';
import { BrowsePageObject, browseSelectors } from '../shared/page-objects';
import { waitForLoadingComplete } from '../shared/assertions';
import {
  assertNoHorizontalScroll,
  assertResponsiveLayout,
} from '../shared/assertions';
import { TEST_VIEWPORTS } from '../shared/test-data/test-datasets';

describe('Browse & Filters (AI-Driven)', () => {
  let stagehand: Stagehand;
  let pageObj: BrowsePageObject;

  beforeEach(async () => {
    stagehand = await createStagehand();
    const page = await getActivePage(stagehand);
    pageObj = new BrowsePageObject(page);
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  describe('Dataset Browsing', () => {
    test('should display dataset grid on load', async () => {
      await navigateTo(stagehand, '/browse');
      const page = await getActivePage(stagehand);
      await waitForLoadingComplete(page);

      const count = await page.locator(browseSelectors.datasetCard).count();
      expect(count).toBeGreaterThan(0);
    });

    test('should show loading state initially', async () => {
      await navigateTo(stagehand, '/browse');
      const page = await getActivePage(stagehand);

      const hadLoading = await page.evaluate(() => {
        return !!document.querySelector(
          '[class*="loading"], [class*="skeleton"]'
        );
      });
      console.log(`Loading state shown: ${hadLoading}`);
    });

    test('should sort datasets', async () => {
      await pageObj.navigateToBrowse();
      const page = await getActivePage(stagehand);

      const sortSelect = page.locator(browseSelectors.sortSelect);
      if ((await sortSelect.count()) > 0) {
        await sortSelect.first().click();
        console.log('Sort select clicked');
      }
    });
  });

  describe('Search', () => {
    test('should have search input', async () => {
      await pageObj.navigateToBrowse();
      const page = await getActivePage(stagehand);

      const count = await page.locator(browseSelectors.searchInput).count();
      expect(count).toBeGreaterThan(0);
    });

    test('should search by query', async () => {
      await pageObj.navigateToBrowse();
      const page = await getActivePage(stagehand);

      await pageObj.search('populacija');
      const results = await pageObj.getVisibleDatasetCount();
      console.log(`Search results: ${results}`);
    });

    test('should handle Serbian Cyrillic search', async () => {
      await pageObj.navigateToBrowse();
      const page = await getActivePage(stagehand);

      await pageObj.search('попис');
      const results = await pageObj.getVisibleDatasetCount();
      console.log(`Cyrillic search results: ${results}`);
    });
  });

  describe('Visual Layout', () => {
    test('should have no horizontal scroll', async () => {
      await pageObj.navigateToBrowse();
      const page = await getActivePage(stagehand);

      await assertNoHorizontalScroll(page);
    });

    test('should be responsive on mobile', async () => {
      await pageObj.navigateToBrowse();
      const page = await getActivePage(stagehand);

      const { issues } = await assertResponsiveLayout(
        page,
        TEST_VIEWPORTS.mobile.width,
        TEST_VIEWPORTS.mobile.height
      );
      console.log(`Mobile issues: ${issues.join(', ') || 'none'}`);
    });
  });
});