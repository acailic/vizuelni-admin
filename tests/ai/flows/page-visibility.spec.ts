import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { z } from 'zod';
import { Stagehand } from '@browserbasehq/stagehand';
import {
  createStagehand,
  navigateTo,
  cleanup,
  getActivePage,
  extractData,
} from '../fixtures/test-helpers';
import { TEST_CONFIG } from '../stagehand.config';

const visibilitySchema = z.object({
  mainHeading: z.string().nullable().optional(),
  visibleSections: z.array(z.string()).default([]),
  primaryActions: z.array(z.string()).default([]),
  hasCriticalError: z.boolean().default(false),
});

type PageCheck = {
  name: string;
  path: string;
  minText?: number;
  minSections?: number;
  expectedSections?: string[];
  expectLoginRedirect?: boolean;
  extraWait?: number;
};

const pageChecks: PageCheck[] = [
  {
    name: 'Homepage',
    path: '/',
    minText: 120,
    minSections: 2,
    expectedSections: ['hero', 'quick stats', 'featured', 'getting started'],
  },
  {
    name: 'Browse datasets',
    path: '/browse',
    minText: 80,
    minSections: 2,
    expectedSections: ['browse', 'filters', 'datasets'],
  },
  {
    name: 'Create configurator',
    path: '/create',
    minText: 100,
    minSections: 2,
    expectedSections: ['configurator', 'chart', 'dataset', 'preview'],
  },
  {
    name: 'Charts gallery',
    path: '/charts',
    minText: 80,
    minSections: 2,
    expectedSections: ['gallery', 'charts', 'sorting'],
  },
  {
    name: 'Community gallery',
    path: '/gallery',
    minText: 80,
    minSections: 2,
    expectedSections: ['gallery', 'filters', 'featured'],
  },
  {
    name: 'Demo landing',
    path: '/demo',
    minText: 100,
    minSections: 2,
    expectedSections: ['hero', 'features', 'chart'],
  },
  {
    name: 'Demo gallery',
    path: '/demo-gallery',
    minText: 80,
    minSections: 2,
    expectedSections: ['gallery', 'examples'],
  },
  {
    name: 'Sample data',
    path: '/data',
    minText: 60,
    minSections: 2,
    expectedSections: ['sample data', 'datasets', 'preview'],
  },
  {
    name: 'Statistics overview',
    path: '/statistics',
    minText: 30,
    minSections: 1,
    expectedSections: ['statistics', 'popular charts', 'overview'],
    extraWait: 2000,
  },
  {
    name: 'Accessibility statement',
    path: '/accessibility',
    minText: 60,
    minSections: 1,
    expectedSections: ['accessibility', 'statement', 'guidelines'],
  },
  {
    name: 'Login',
    path: '/login',
    minText: 50,
    minSections: 1,
    expectedSections: ['login', 'sign in', 'email'],
  },
  {
    name: 'Dashboard redirect',
    path: '/dashboard',
    minText: 50,
    minSections: 1,
    expectedSections: ['login', 'sign in'],
    expectLoginRedirect: true,
  },
  {
    name: 'Profile redirect',
    path: '/profile',
    minText: 50,
    minSections: 1,
    expectedSections: ['login', 'sign in'],
    expectLoginRedirect: true,
  },
];

const settleDelay =
  TEST_CONFIG.pageLoadBuffer + (TEST_CONFIG.animationBuffer ?? 0);

describe('Page visibility (Stagehand)', () => {
  let stagehand: Stagehand;

  beforeEach(async () => {
    stagehand = await createStagehand();
  });

  afterEach(async () => {
    await cleanup(stagehand);
  });

  test.each(pageChecks)(
    '$name page should be visible and structured',
    async ({
      name,
      path,
      minText = 80,
      minSections = 2,
      expectedSections = [],
      expectLoginRedirect = false,
      extraWait = 0,
    }) => {
      await navigateTo(stagehand, path);
      const page = await getActivePage(stagehand);

      await page.waitForTimeout(settleDelay + extraWait);

      const collectMetrics = async () =>
        page.evaluate(() => {
          const text = document.body.innerText || '';
          const textLength = text.trim().length;
          const h1Count = document.querySelectorAll('h1').length;
          const mainElements = document.querySelectorAll('main').length;
          const headingRoles =
            document.querySelectorAll('[role="heading"]').length;
          const textLower = text.toLowerCase();
          const hasErrorSignal = [
            'application error',
            'page could not be found',
            'not found',
            'internal server error',
          ].some((keyword) => textLower.includes(keyword));

          return {
            textLength,
            hasHeading: h1Count > 0 || headingRoles > 0,
            hasMain: mainElements > 0,
            hasErrorSignal,
          };
        });

      let metrics = await collectMetrics();
      if (metrics.textLength <= minText) {
        await page.waitForTimeout(1000);
        metrics = await collectMetrics();
      }

      const currentUrl = page.url();
      if (expectLoginRedirect) {
        expect(currentUrl).toContain('/login');
      } else {
        expect(currentUrl).toContain(path === '/' ? '/sr-Latn' : path);
      }

      expect(metrics.textLength).toBeGreaterThan(minText);
      expect(metrics.hasHeading || metrics.hasMain).toBe(true);
      if (!expectLoginRedirect) {
        expect(metrics.hasErrorSignal).toBe(false);
      }

      const visibility = await extractData(
        stagehand,
        `Audit the "${name}" page that is currently open. Return the most prominent heading as mainHeading, a short list of visibleSections (major sections or panels visible without scrolling), and any primaryActions. Set hasCriticalError to true only if the page is clearly a blank, 404/500, or crash page. Always populate mainHeading with the best visible heading or hero text, even if the UI language is Serbian. If you are on a login screen, treat it as valid content (hasCriticalError should be false).`,
        visibilitySchema
      );

      const normalizedHeading = (visibility.mainHeading || '')
        .trim()
        .toLowerCase();
      const normalizedSections = visibility.visibleSections
        .map((section) => section.toLowerCase().trim())
        .filter(Boolean);

      expect(visibility.hasCriticalError).toBe(false);
      expect(normalizedHeading.length).toBeGreaterThan(0);
      expect(normalizedSections.length).toBeGreaterThanOrEqual(minSections);

      if (expectedSections.length > 0) {
        const matchedSection = expectedSections.some((expected) => {
          const normalizedExpected = expected.toLowerCase();
          return (
            normalizedHeading.includes(normalizedExpected) ||
            normalizedSections.some((section) =>
              section.includes(normalizedExpected)
            )
          );
        });

        expect(matchedSection).toBe(true);
      }
    }
  );
});
