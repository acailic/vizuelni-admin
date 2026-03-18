/**
 * Export page object
 */

import type { Page } from '@playwright/test';
import { CommonPageObject } from './common.po';

export const exportSelectors = {
  exportButton: "[data-testid='export-button'], button:has-text('Izvoz')",
  shareButton: "[data-testid='share-button'], button:has-text('Deli')",
  embedCode: "[data-testid='embed-code'], textarea",
  shareUrl: "[data-testid='share-url'], input",
  copyButton: "[data-testid='copy-button'], button:has-text('Kopiraj')",
  successToast: "[role='status'], [class*='toast']",
} as const;

export class ExportPageObject extends CommonPageObject {
  async openExportMenu(): Promise<void> {
    await this.page.locator(exportSelectors.exportButton).first().click();
    await this.page.waitForTimeout(300);
  }

  async openShareModal(): Promise<void> {
    await this.page.locator(exportSelectors.shareButton).first().click();
    await this.page.waitForTimeout(300);
  }

  async getEmbedCode(): Promise<string> {
    await this.openShareModal();
    return this.page
      .locator(exportSelectors.embedCode)
      .first()
      .inputValue()
      .catch(
        () =>
          this.page.locator(exportSelectors.embedCode).first().textContent() ||
          ''
      );
  }

  async getShareUrl(): Promise<string> {
    await this.openShareModal();
    return (
      (await this.page.locator(exportSelectors.shareUrl).first().inputValue()) || ''
    );
  }

  async hasSuccessToast(): Promise<boolean> {
    return this.page
      .locator(exportSelectors.successToast)
      .isVisible()
      .catch(() => false);
  }
}