import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

import type { Stagehand } from '@browserbasehq/stagehand';

import { createStagehandInstance, TEST_CONFIG } from '../../stagehand.config';
import { getActivePage, navigateTo } from '../../fixtures/test-helpers';
import {
  getSpecsForPage,
  writeTaskCache,
  type ResolvedUiValidatorConfig,
} from '../config';
import type { DiscoveredTask } from '../schemas/task.schema';
import { IssueCollector, type IssueCandidate } from './issue-collector';
import {
  buildValidationReport,
  exceedsThresholds,
  writeValidationReport,
  type ValidationStats,
} from './report-generator';
import { discoverTasks } from './task-discoverer';
import { runBehaviorValidator } from '../validators/behavior-validator';
import { runSemanticChecker } from '../validators/semantic-checker';
import { runVisualInspector } from '../validators/visual-inspector';

export interface ValidationEngineResult {
  report: ReturnType<typeof buildValidationReport>;
  exitCode: number;
  tasks: DiscoveredTask[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function attachArtifacts(input: {
  issues: IssueCandidate[];
  stagehand: Stagehand;
  config: ResolvedUiValidatorConfig;
  pageKey: string;
  viewportName: string;
}): Promise<void> {
  if (input.issues.length === 0) {
    return;
  }

  const page = await getActivePage(input.stagehand);
  const artifactBaseName = `${slugify(input.pageKey)}-${slugify(input.viewportName)}-${Date.now()}`;

  let screenshotPath: string | null = null;
  if (input.config.validation.screenshot_on_issue) {
    await mkdir(input.config.screenshotDir, { recursive: true });
    screenshotPath = path.join(
      input.config.screenshotDir,
      `${artifactBaseName}.png`
    );
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      timeout: input.config.validation.timeout_ms,
    });
  }

  let domSnapshotPath: string | null = null;
  if (
    input.config.validation.dom_snapshot_on_issue &&
    input.config.report.include_dom_snapshots
  ) {
    await mkdir(input.config.domSnapshotDir, { recursive: true });
    domSnapshotPath = path.join(
      input.config.domSnapshotDir,
      `${artifactBaseName}.html`
    );
    await writeFile(
      domSnapshotPath,
      await page.evaluate(() => document.documentElement.outerHTML),
      'utf8'
    );
  }

  for (const issue of input.issues) {
    issue.screenshot =
      issue.screenshot ??
      (screenshotPath ? path.relative(process.cwd(), screenshotPath) : null);
    issue.dom_snapshot =
      issue.dom_snapshot ??
      (domSnapshotPath ? path.relative(process.cwd(), domSnapshotPath) : null);
  }
}

async function runPageValidators(input: {
  stagehand: Stagehand;
  config: ResolvedUiValidatorConfig;
  pageConfig: ResolvedUiValidatorConfig['resolvedPages'][number];
  tasks: DiscoveredTask[];
  stats: ValidationStats;
  collector: IssueCollector;
}): Promise<void> {
  const pageSpecs = getSpecsForPage(input.config, input.pageConfig);
  const relevantTasks = input.tasks.filter(
    (task) => task.page === input.pageConfig.path
  );

  for (const viewport of input.config.validation.viewports) {
    const page = await getActivePage(input.stagehand);
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await navigateTo(
      input.stagehand,
      input.pageConfig.normalizedPath,
      input.pageConfig.locale
    );
    await page.waitForTimeout(
      TEST_CONFIG.pageLoadBuffer + TEST_CONFIG.animationBuffer
    );

    const visualResult = await runVisualInspector({
      stagehand: input.stagehand,
      pageConfig: input.pageConfig,
      specs: pageSpecs,
      tasks: relevantTasks,
      viewport,
    });

    const semanticResult = await runSemanticChecker({
      stagehand: input.stagehand,
      pageConfig: input.pageConfig,
      tasks: relevantTasks,
      viewport,
    });

    await navigateTo(
      input.stagehand,
      input.pageConfig.normalizedPath,
      input.pageConfig.locale
    );
    await page.waitForTimeout(
      TEST_CONFIG.pageLoadBuffer + TEST_CONFIG.animationBuffer
    );

    const behaviorResult = await runBehaviorValidator({
      stagehand: input.stagehand,
      pageConfig: input.pageConfig,
      tasks: relevantTasks,
      viewport,
    });

    const pageIssues = [
      ...visualResult.issues,
      ...semanticResult.issues,
      ...behaviorResult.issues,
    ];

    input.stats.totalChecks +=
      visualResult.checksRun +
      semanticResult.checksRun +
      behaviorResult.checksRun;
    input.stats.passedChecks +=
      visualResult.passedChecks +
      semanticResult.passedChecks +
      behaviorResult.passedChecks;

    await attachArtifacts({
      issues: pageIssues,
      stagehand: input.stagehand,
      config: input.config,
      pageKey: `${input.pageConfig.locale}${input.pageConfig.normalizedPath}`,
      viewportName: viewport.name,
    });

    input.collector.addMany(pageIssues);
  }
}

export async function runValidationEngine(
  config: ResolvedUiValidatorConfig,
  options: { forceTaskDiscovery?: boolean } = {}
): Promise<ValidationEngineResult> {
  const startedAt = Date.now();
  const stagehand = await createStagehandInstance();

  try {
    const tasks = await discoverTasks(stagehand, config, {
      force: options.forceTaskDiscovery,
    });
    await writeTaskCache(config.cachePath, tasks);

    const collector = new IssueCollector(tasks);
    const stats: ValidationStats = {
      totalChecks: 0,
      passedChecks: 0,
    };

    for (const pageConfig of config.resolvedPages) {
      await runPageValidators({
        stagehand,
        config,
        pageConfig,
        tasks,
        stats,
        collector,
      });
    }

    const report = buildValidationReport({
      config,
      tasks,
      issues: collector.getAll(),
      durationMs: Date.now() - startedAt,
      stats,
    });

    await writeValidationReport(report, config.reportOutputPath);

    return {
      report,
      exitCode: exceedsThresholds(report, config) ? 1 : 0,
      tasks,
    };
  } finally {
    await stagehand.close();
  }
}
