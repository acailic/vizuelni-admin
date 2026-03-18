import type { Page } from '@playwright/test';

/**
 * Common selectors with fallbacks for missing data-testid
 */
export const commonSelectors = {
  // Navigation
  mainNav: "nav, [role='navigation'], [data-testid='main-nav']",
  skipLink: "[data-testid='skip-link'], a[href='#main'], a[href='#content']",
  localeSwitcher: "[data-testid='locale-switcher'], [class*='language']",

  // Landmarks
  mainContent: "main, [role='main'], #main, #content",
  footer: "footer, [role='contentinfo']",
  header: "header, [role='banner']",

  // Buttons
  buttons: {
    primary:
      "button[type='submit'], button:has-text('Sačuvaj'), button:has-text('Save')",
    next: "[data-testid='next-button'], button:has-text('Sledeće'), button:has-text('Next')",
    back: "[data-testid='back-button'], button:has-text('Nazad'), button:has-text('Back')",
    cancel:
      "[data-testid='cancel-button'], button:has-text('Otkaži'), button:has-text('Cancel')",
    close: "[data-testid='close-button'], button[aria-label*='close']",
  },

  // States
  loading: "[class*='loading'], [class*='spinner'], [class*='skeleton']",
  error: "[class*='error'], [role='alert'], [data-testid='error-message']",
  empty: "[class*='empty'], [class*='no-results'], [data-testid='empty-state']",
} as const;

export class CommonPageObject {
  constructor(protected page: Page) {}

  async waitForReady(timeout = 10000): Promise<void> {
    await this.page.waitForTimeout(500);
    try {
      await this.page
        .locator(commonSelectors.loading)
        .waitFor({ state: 'hidden', timeout });
    } catch {
      // Loading may have already finished
    }
  }

  async isInViewport(selector: string): Promise<boolean> {
    const element = this.page.locator(selector).first();
    const box = await element.boundingBox();
    if (!box) return false;

    const viewport = this.page.viewportSize();
    if (!viewport) return true;

    return (
      box.x >= 0 &&
      box.y >= 0 &&
      box.x + box.width <= viewport.width &&
      box.y + box.height <= viewport.height
    );
  }

  getCurrentLocale(): string | null {
    const match = this.page.url().match(/\/(sr-Latn|sr-Cyrl|en)/);
    return match ? match[1] : null;
  }

  async hasError(): Promise<boolean> {
    return this.page.locator(commonSelectors.error)
      .isVisible()
      .catch(() => false);
  }

  async isLoading(): Promise<boolean> {
    return this.page.locator(commonSelectors.loading)
      .isVisible()
      .catch(() => false);
  }

  async isEmpty(): Promise<boolean> {
    return this.page.locator(commonSelectors.empty)
      .isVisible()
      .catch(() => false);
  }

  async clickButton(type: 'next' | 'back' | 'cancel' | 'close' | 'primary'): Promise<void> {
    const selector = commonSelectors.buttons[type];
    await this.page.locator(selector).first().click();
  }
}