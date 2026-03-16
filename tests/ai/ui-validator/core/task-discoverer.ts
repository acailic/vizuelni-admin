import { readFile, stat } from 'fs/promises';
import { z } from 'zod';

import type {
  ResolvedUiValidationSpec,
  ResolvedUiValidatorConfig,
} from '../config';
import {
  taskCacheSchema,
  discoveredTaskSchema,
  type DiscoveredTask,
} from '../schemas/task.schema';
import { buildTaskDiscoveryPrompt } from '../prompts/discover-tasks';
import {
  createDomSummary,
  extractData,
  getActivePage,
  navigateTo,
} from '../../fixtures/test-helpers';
import { TEST_CONFIG } from '../../stagehand.config';
import type { Stagehand } from '@browserbasehq/stagehand';

function specSummary(specs: ResolvedUiValidationSpec[]): string {
  if (specs.length === 0) {
    return 'No explicit critical element specs configured.';
  }

  return specs
    .flatMap((spec) =>
      spec.critical_elements.map(
        (element) => `${element.selector}: ${element.expectation}`
      )
    )
    .join('\n');
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

function buildFallbackTasks(input: {
  pageName: string;
  pagePath: string;
  specs: ResolvedUiValidationSpec[];
  interactiveElements: string[];
}): DiscoveredTask[] {
  const criticalElements = Array.from(
    new Set(
      input.specs.flatMap((spec) =>
        spec.critical_elements.map((element) => element.selector)
      )
    )
  );

  const firstTarget =
    input.interactiveElements[0] ?? criticalElements[0] ?? 'main';

  return [
    {
      id: `${slugify(input.pageName)}-overview`,
      name: `Review ${input.pageName}`,
      description: `Open ${input.pageName} and confirm the primary interface is available.`,
      page: input.pagePath,
      steps: [
        {
          action: 'navigate',
          target: input.pagePath,
          expected_result: `${input.pageName} content is visible`,
        },
        {
          action: 'click',
          target: firstTarget,
          expected_result: 'The page remains interactive after the action',
        },
      ],
      criticalElements,
      discoveredAt: new Date().toISOString(),
      confidence: 0.35,
    },
  ];
}

function sanitizeTasks(
  tasks: DiscoveredTask[],
  pagePath: string,
  fallbackCriticalElements: string[]
): DiscoveredTask[] {
  return tasks.map((task, index) =>
    discoveredTaskSchema.parse({
      ...task,
      id: task.id || `task-${index + 1}`,
      page: pagePath,
      criticalElements:
        task.criticalElements.length > 0
          ? task.criticalElements
          : fallbackCriticalElements,
      discoveredAt: task.discoveredAt ?? new Date().toISOString(),
      confidence: task.confidence ?? 0.5,
    })
  );
}

export async function readTaskCache(
  cachePath: string
): Promise<DiscoveredTask[] | null> {
  try {
    const raw = await readFile(cachePath, 'utf8');
    return taskCacheSchema.parse(JSON.parse(raw)).tasks;
  } catch {
    return null;
  }
}

export async function discoverTasks(
  stagehand: Stagehand,
  config: ResolvedUiValidatorConfig,
  options: { force?: boolean } = {}
): Promise<DiscoveredTask[]> {
  const shouldUseCache = !options.force;

  if (shouldUseCache) {
    try {
      const fileStats = await stat(config.cachePath);
      const maxAgeMs = config.discovery.cache_ttl_hours * 60 * 60 * 1000;
      if (Date.now() - fileStats.mtimeMs < maxAgeMs) {
        const cachedTasks = await readTaskCache(config.cachePath);
        if (cachedTasks) {
          return cachedTasks;
        }
      }
    } catch {
      // Cache miss; continue with discovery.
    }
  }

  const taskSchema = z.array(discoveredTaskSchema).max(8);
  const discoveredTasks: DiscoveredTask[] = [];

  for (const pageConfig of config.resolvedPages) {
    const pageSpecs = config.resolvedSpecs.filter(
      (spec) =>
        spec.normalizedPath === pageConfig.normalizedPath &&
        spec.locale === pageConfig.locale
    );

    await navigateTo(stagehand, pageConfig.normalizedPath, pageConfig.locale);
    const page = await getActivePage(stagehand);
    await page.setViewportSize({
      width: config.validation.viewports[0].width,
      height: config.validation.viewports[0].height,
    });
    await page.waitForTimeout(
      TEST_CONFIG.pageLoadBuffer + TEST_CONFIG.animationBuffer
    );

    const domSummary = await createDomSummary(page);
    const interactiveElements = await page.evaluate(() => {
      const selectors = Array.from(
        document.querySelectorAll('button, a[href], input, select, textarea')
      )
        .map((element) => {
          if (element.id) {
            return `#${element.id}`;
          }

          if (element.getAttribute('aria-label')) {
            return `${element.tagName.toLowerCase()}[aria-label]`;
          }

          if (element.classList.length > 0) {
            return `${element.tagName.toLowerCase()}.${element.classList[0]}`;
          }

          return element.tagName.toLowerCase();
        })
        .filter(Boolean)
        .slice(0, 12);

      return selectors;
    });

    const fallbackCriticalElements = Array.from(
      new Set(
        pageSpecs.flatMap((spec) =>
          spec.critical_elements.map((element) => element.selector)
        )
      )
    );

    try {
      const tasks = await extractData(
        stagehand,
        buildTaskDiscoveryPrompt({
          pageName: pageConfig.name,
          pagePath: pageConfig.path,
          pageUrl: page.url(),
          domSummary: `${domSummary}\nInteractive selectors: ${interactiveElements.join(', ') || 'none'}`,
          explicitSpecSummary: specSummary(pageSpecs),
          maxDepth: config.discovery.max_depth,
        }),
        taskSchema
      );

      discoveredTasks.push(
        ...sanitizeTasks(tasks, pageConfig.path, fallbackCriticalElements)
      );
    } catch {
      discoveredTasks.push(
        ...buildFallbackTasks({
          pageName: pageConfig.name,
          pagePath: pageConfig.path,
          specs: pageSpecs,
          interactiveElements,
        })
      );
    }
  }

  return discoveredTasks;
}
