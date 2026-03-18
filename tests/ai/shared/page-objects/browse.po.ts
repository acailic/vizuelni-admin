/**
 * Browse page object
 */

import type { Page } from '@playwright/test';
import { CommonPageObject } from './common.po';

export const browseSelectors = {
  searchInput: "[data-testid='search-input'], input[type='search']",
  filterSidebar: "[data-testid='filter-sidebar'], aside",
  datasetCard: "[data-testid='dataset-card'], [class*='card']",
  resultCount: "[data-testid='result-count'], [class*='count']",
  sortSelect: "[data-testid='sort-select'], select",
} as const;

export class BrowsePageObject extends CommonPageObject {
  async navigateToBrowse(): Promise<void> {
    await this.page.goto('/browse');
    await this.waitForReady();
  }

  async search(query: string): Promise<void> {
    const input = this.page.locator(browseSelectors.searchInput).first();
    await input.clear();
    await input.fill(query);
    await this.page.waitForTimeout(500);
  }

  async getVisibleDatasetCount(): Promise<number> {
    return this.page.locator(browseSelectors.datasetCard).count();
  }

  async sortBy(value: string): Promise<void> {
    await this.page.locator(browseSelectors.sortSelect).first().click();
    await this.page.locator(`option[value="${value}"]`).click();
    await this.page.waitForTimeout(500);
  }
}