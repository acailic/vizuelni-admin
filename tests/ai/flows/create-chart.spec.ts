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

    // Extract page state using AI
    const result = await extractData(
      stagehand,
      'Check if this is the chart creation page. Return the step name and whether a dataset needs to be selected.',
      z.object({
        isCreatePage: z.boolean(),
        currentStep: z.string(),
        needsDatasetSelection: z.boolean(),
      })
    );

    expect(result.isCreatePage).toBe(true);
    expect(result.needsDatasetSelection).toBe(true);
  });

  test('should select a dataset using AI', async () => {
    await navigateTo(stagehand, '/create?dataset=678e312d0aae3fe3ad3e361c');

    // Wait for dataset to load
    const page = stagehand.context.pages()[0];
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // AI-driven: Check dataset loaded
    const result = await extractData(
      stagehand,
      'Check if a dataset is loaded. Return the dataset name if visible, and whether chart type options are shown.',
      z.object({
        datasetLoaded: z.boolean(),
        hasChartTypeOptions: z.boolean(),
        chartTypesAvailable: z.array(z.string()),
      })
    );

    expect(result.datasetLoaded).toBe(true);
    expect(result.hasChartTypeOptions).toBe(true);
    expect(result.chartTypesAvailable.length).toBeGreaterThan(0);
  });

  test('should select bar chart type using AI', async () => {
    await navigateTo(stagehand, '/create?dataset=678e312d0aae3fe3ad3e361c');
    const page = stagehand.context.pages()[0];
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // AI-driven: Select bar chart
    await performAction(stagehand, 'click on the bar chart type button');

    // Wait for selection to register
    await page.waitForTimeout(TEST_CONFIG.animationBuffer);

    // Verify URL updated
    const url = page.url();
    expect(url).toContain('type=bar');
  });

  test('should complete full chart creation flow', async () => {
    await navigateTo(stagehand, '/create?dataset=678e312d0aae3fe3ad3e361c');
    const page = stagehand.context.pages()[0];
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Step 1: Select chart type
    await performAction(stagehand, 'click on the bar chart type button');
    await page.waitForTimeout(TEST_CONFIG.animationBuffer);

    // Step 2: Proceed to next step
    await performAction(stagehand, 'click the next button to continue');
    await page.waitForTimeout(TEST_CONFIG.pageLoadBuffer);

    // Extract final state
    const result = await extractData(
      stagehand,
      'Check the current state of the chart creation. Return the current step, whether a preview is visible, and any visible chart elements.',
      z.object({
        currentStep: z.string(),
        hasPreview: z.boolean(),
        hasChartElements: z.boolean(),
      })
    );

    expect(result.hasPreview || result.hasChartElements).toBe(true);
  });
});
