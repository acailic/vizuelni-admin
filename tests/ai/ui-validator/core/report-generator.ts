import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

import type { ResolvedUiValidatorConfig } from '../config';
import type { DiscoveredTask } from '../schemas/task.schema';
import type { Issue } from '../schemas/issue.schema';
import type { TaskSummary, ValidationReport } from '../schemas/report.schema';
import { validationReportSchema } from '../schemas/report.schema';

export interface ValidationStats {
  totalChecks: number;
  passedChecks: number;
}

function taskMatchesIssue(task: DiscoveredTask, issue: Issue): boolean {
  if (issue.task_blocked === task.id) {
    return true;
  }

  return (
    task.page === issue.page &&
    !!issue.element &&
    task.criticalElements.some(
      (selector) =>
        issue.element === selector ||
        issue.element.includes(selector) ||
        selector.includes(issue.element)
    )
  );
}

function summarizeTasks(
  tasks: DiscoveredTask[],
  issues: Issue[]
): TaskSummary[] {
  return tasks.map((task) => {
    const relatedIssues = issues.filter((issue) =>
      taskMatchesIssue(task, issue)
    );
    const hasCritical = relatedIssues.some(
      (issue) => issue.severity === 'critical'
    );
    const hasWarning = relatedIssues.some(
      (issue) => issue.severity === 'warning'
    );

    return {
      id: task.id,
      name: task.name,
      status: hasCritical ? 'blocked' : hasWarning ? 'warning' : 'passing',
      issues_count: relatedIssues.length,
    };
  });
}

export function buildValidationReport(input: {
  config: ResolvedUiValidatorConfig;
  tasks: DiscoveredTask[];
  issues: Issue[];
  durationMs: number;
  stats: ValidationStats;
}): ValidationReport {
  const taskSummaries = summarizeTasks(input.tasks, input.issues);
  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    duration_ms: input.durationMs,
    config: {
      model: input.config.model,
      pages_scanned: input.config.resolvedPages.length,
      viewports: input.config.validation.viewports,
    },
    summary: {
      total_checks: input.stats.totalChecks,
      passed: input.stats.passedChecks,
      critical: input.issues.filter((issue) => issue.severity === 'critical')
        .length,
      warning: input.issues.filter((issue) => issue.severity === 'warning')
        .length,
      info: input.issues.filter((issue) => issue.severity === 'info').length,
    },
    tasks: {
      discovered: input.tasks.length,
      blocked_by_critical: taskSummaries.filter(
        (summary) => summary.status === 'blocked'
      ).length,
      details: taskSummaries,
    },
    issues: input.issues,
  };

  return validationReportSchema.parse(report);
}

export async function writeValidationReport(
  report: ValidationReport,
  outputPath: string
): Promise<void> {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(report, null, 2), 'utf8');
}

export function exceedsThresholds(
  report: ValidationReport,
  config: ResolvedUiValidatorConfig
): boolean {
  return (
    report.summary.critical > config.thresholds.max_critical ||
    report.summary.warning > config.thresholds.max_warnings
  );
}
