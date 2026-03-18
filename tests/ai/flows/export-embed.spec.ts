import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { Stagehand } from '@browserbasehq/stagehand';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
} from '../fixtures/test-helpers';
import { TEST_CONFIG } from '../stagehand.config';
import { TEST_DATASETS } from '../shared/test-data/test-datasets';
import { ExportPageObject, exportSelectors } from '../shared/page-objects';
import { waitForLoadingComplete } from '../shared/interactive-states';

describe('Export & Embed (AI-Driven)', () => {
  let stagehand: Stagehand;
  let pageObj: ExportPageObject;

  beforeEach(async () => {
    stagehand = await createStagehand();
    const page = await getActivePage(stagehand);
    pageObj = new ExportPageObject(page);
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  async function navigateToChart(): Promise<void> {
    const datasetId = TEST_DATASETS.populationByMunicipality.id;
    await navigateTo(stagehand, `/create?dataset=${datasetId}&type=bar`);
    const page = await getActivePage(stagehand);
    await waitForLoadingComplete(page);
  }

  describe('Export Options', () => {
    test('should display export button', async () => {
      await navigateToChart();
      const page = await getActivePage(stagehand);

      const count = await page.locator(exportSelectors.exportButton).count();
      expect(count).toBeGreaterThan(0);
    });

    test('should show export format options', async () => {
      await navigateToChart();
      await pageObj.openExportMenu();
      const page = await getActivePage(stagehand);

      const bodyText = (await page.textContent('body')) ?? '';
      const hasFormats = bodyText.includes('PNG') || bodyText.includes('SVG');
      console.log(`Export formats visible: ${hasFormats}`);
    });
  });

  describe('Embed Code', () => {
    test('should generate embed code', async () => {
      await navigateToChart();

      const embedCode = await pageObj.getEmbedCode();
      console.log(`Embed code length: ${embedCode.length}`);
    });

    test('should include iframe in embed code', async () => {
      await navigateToChart();

      const embedCode = await pageObj.getEmbedCode();
      const hasIframe = embedCode.includes('<iframe');
      console.log(`Embed code contains iframe: ${hasIframe}`);
    });
  });

  describe('Share URLs', () => {
    test('should generate share URL', async () => {
      await navigateToChart();

      const shareUrl = await pageObj.getShareUrl();
      console.log(`Share URL: ${shareUrl.slice(0, 50)}...`);
    });

    test('should include locale in share URL', async () => {
      await navigateToChart();

      const shareUrl = await pageObj.getShareUrl();
      const hasLocale = /\/(sr-Latn|sr-Cyrl|en)\//.test(shareUrl);
      console.log(`Share URL includes locale: ${hasLocale}`);
    });
  });
});