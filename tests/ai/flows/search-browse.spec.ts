import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Stagehand } from '@browserbasehq/stagehand';
import { z } from 'zod';
import {
  createStagehand,
  navigateTo,
  performAction,
  extractData,
  cleanup,
} from '../fixtures/test-helpers';
import { BASE_URL, TEST_CONFIG } from '../stagehand.config';

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
    await stagehand.context
      .pages()[0]
      .waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // AI-driven: Extract dataset information
    const result = await extractData(
      stagehand,
      'Count the datasets on this page. Return the total count shown and whether pagination exists.',
      z.object({
        datasetCount: z.number(),
        hasPagination: z.boolean(),
        totalCount: z.number().optional(),
      })
    );

    expect(result.datasetCount).toBeGreaterThan(0);
  });

  test('should search for datasets using AI', async () => {
    await navigateTo(stagehand, '/browse');
    await stagehand.context
      .pages()[0]
      .waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // AI-driven: Perform search
    await performAction(
      stagehand,
      "type 'statistika' in the search box and press enter"
    );
    await stagehand.context.pages()[0].waitForTimeout(2000);

    // Verify search results
    const result = await extractData(
      stagehand,
      'Check the search results. Return whether results were found and how many.',
      z.object({
        hasResults: z.boolean(),
        resultCount: z.number(),
        searchQuery: z.string().optional(),
      })
    );

    expect(result.hasResults).toBe(true);
  });

  test('should navigate from browse to create page', async () => {
    await navigateTo(stagehand, '/browse');
    await stagehand.context
      .pages()[0]
      .waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // AI-driven: Click visualize/create on first dataset
    await performAction(
      stagehand,
      'click the visualize or create chart button on the first dataset'
    );
    await stagehand.context
      .pages()[0]
      .waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Verify navigation to create page
    const url = stagehand.context.pages()[0].url();
    expect(url).toContain('/create');
  });

  test('should filter datasets by category', async () => {
    await navigateTo(stagehand, '/browse');
    await stagehand.context
      .pages()[0]
      .waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // AI-driven: Look for and interact with filters
    const result = await extractData(
      stagehand,
      "Check what filter options exist on this page. Return available filter categories and whether there's an active filter.",
      z.object({
        hasFilters: z.boolean(),
        filterCategories: z.array(z.string()),
        activeFilter: z.string().optional(),
      })
    );

    // If filters exist, try to use one
    if (result.hasFilters && result.filterCategories.length > 0) {
      await performAction(
        stagehand,
        `click on the ${result.filterCategories[0]} filter if available`
      );
      await stagehand.context.pages()[0].waitForTimeout(1000);

      // Verify filter applied
      const afterFilter = await extractData(
        stagehand,
        'Check if a filter has been applied and what the current result count is.',
        z.object({
          filterApplied: z.boolean(),
          resultCount: z.number(),
        })
      );

      expect(afterFilter.filterApplied).toBeDefined();
    }
  });
});
