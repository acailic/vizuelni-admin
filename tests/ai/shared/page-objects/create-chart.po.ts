/**
 * Chart creation page object
 */

import type { Page } from '@playwright/test';
import { CommonPageObject, commonSelectors } from './common.po';

export const createChartSelectors = {
  datasetSelector: "[data-testid='dataset-selector'], [role='listbox']",
  chartTypeBar: "[data-testid='chart-type-bar'], button:has-text('Bar')",
  chartTypeLine: "[data-testid='chart-type-line'], button:has-text('Line')",
  chartTypePie: "[data-testid='chart-type-pie'], button:has-text('Pie')",
  chartTypeButtons: "[data-testid*='chart-type-'], button[class*='chart-type']",
  fieldMapping: "[data-testid='field-mapping'], [class*='mapping']",
  chartPreview: "[data-testid='chart-preview'], canvas, svg",
  nextButton: commonSelectors.buttons.next,
} as const;

export class CreateChartPageObject extends CommonPageObject {
  async navigateToCreate(datasetId?: string): Promise<void> {
    const path = datasetId ? `/create?dataset=${datasetId}` : '/create';
    await this.page.goto(path);
    await this.waitForReady();
  }

  async selectChartType(type: 'bar' | 'line' | 'pie'): Promise<void> {
    const selector =
      createChartSelectors[
        `chartType${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof typeof createChartSelectors
      ];
    await this.page.locator(selector).first().click();
    await this.page.waitForTimeout(300);
  }

  async hasChartPreview(): Promise<boolean> {
    const preview = this.page.locator(createChartSelectors.chartPreview);
    return (await preview.count()) > 0;
  }

  async nextStep(): Promise<void> {
    await this.clickButton('next');
    await this.waitForReady();
  }
}