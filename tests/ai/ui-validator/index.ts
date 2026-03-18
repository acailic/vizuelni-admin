#!/usr/bin/env tsx

import path from 'path';

import {
  loadUiValidatorConfig,
  promoteTaskToSpec,
  type UiValidatorCliOptions,
} from './config';
import { createStagehandInstance } from '../stagehand.config';
import { discoverTasks, readTaskCache } from './core/task-discoverer';
import { writeTaskCache } from './config';
import { runValidationEngine } from './core/validation-engine';

interface ParsedCliArgs extends UiValidatorCliOptions {
  discoverTasksOnly?: boolean;
  listTasks?: boolean;
  promoteTaskId?: string;
  help?: boolean;
}

function printHelp(): void {
  console.log(`UI Validator

Usage:
  npm run test:ui-validate
  npx tsx tests/ai/ui-validator/index.ts --discover-tasks
  npx tsx tests/ai/ui-validator/index.ts --list-tasks
  npx tsx tests/ai/ui-validator/index.ts --promote-task task-001

Options:
  --config <path>         Use a custom YAML config file
  --pages <csv>           Validate specific pages only
  --discover-tasks        Force task discovery and write cache
  --list-tasks            Print cached tasks
  --promote-task <id>     Convert a cached task into a YAML spec
  --strict                Treat warnings as failures
  --max-critical <n>      Override critical threshold
  --max-warnings <n>      Override warning threshold
  --help                  Show this message`);
}

function parseCliArgs(argv: string[]): ParsedCliArgs {
  const parsed: ParsedCliArgs = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    switch (arg) {
      case '--config':
        parsed.configPath = next;
        index += 1;
        break;
      case '--pages':
        parsed.pages = next
          ?.split(',')
          .map((value) => value.trim())
          .filter(Boolean);
        index += 1;
        break;
      case '--discover-tasks':
        parsed.discoverTasksOnly = true;
        break;
      case '--list-tasks':
        parsed.listTasks = true;
        break;
      case '--promote-task':
        parsed.promoteTaskId = next;
        index += 1;
        break;
      case '--strict':
        parsed.strict = true;
        break;
      case '--max-critical':
        parsed.maxCritical = Number.parseInt(next, 10);
        index += 1;
        break;
      case '--max-warnings':
        parsed.maxWarnings = Number.parseInt(next, 10);
        index += 1;
        break;
      case '--help':
      case '-h':
        parsed.help = true;
        break;
      default:
        if (arg.startsWith('--')) {
          throw new Error(`Unknown argument: ${arg}`);
        }
    }
  }

  return parsed;
}

async function listTasks(cachePath: string): Promise<number> {
  const tasks = await readTaskCache(cachePath);

  if (!tasks || tasks.length === 0) {
    console.log('No discovered tasks found.');
    return 0;
  }

  for (const task of tasks) {
    console.log(
      `${task.id}\t${task.page}\t${task.name}\tconfidence=${task.confidence}`
    );
  }

  return 0;
}

async function discoverTasksCommand(cliArgs: ParsedCliArgs): Promise<number> {
  const config = await loadUiValidatorConfig(cliArgs);
  const stagehand = await createStagehandInstance();

  try {
    const tasks = await discoverTasks(stagehand, config, { force: true });
    await writeTaskCache(config.cachePath, tasks);
    console.log(
      `Discovered ${tasks.length} task(s) and wrote cache to ${path.relative(process.cwd(), config.cachePath)}`
    );
    return 0;
  } finally {
    await stagehand.close();
  }
}

async function promoteTaskCommand(cliArgs: ParsedCliArgs): Promise<number> {
  if (!cliArgs.promoteTaskId) {
    throw new Error('--promote-task requires a task id');
  }

  const config = await loadUiValidatorConfig(cliArgs);
  const tasks = await readTaskCache(config.cachePath);
  const task = tasks?.find(
    (candidate) => candidate.id === cliArgs.promoteTaskId
  );

  if (!task) {
    throw new Error(`Task "${cliArgs.promoteTaskId}" not found in cache`);
  }

  const targetFile = await promoteTaskToSpec(task, config);
  console.log(
    `Promoted ${task.id} to ${path.relative(process.cwd(), targetFile)}`
  );
  return 0;
}

async function main(): Promise<void> {
  const cliArgs = parseCliArgs(process.argv.slice(2));

  if (cliArgs.help) {
    printHelp();
    process.exit(0);
  }

  if (cliArgs.listTasks) {
    const config = await loadUiValidatorConfig(cliArgs);
    process.exit(await listTasks(config.cachePath));
  }

  if (cliArgs.promoteTaskId) {
    process.exit(await promoteTaskCommand(cliArgs));
  }

  if (cliArgs.discoverTasksOnly) {
    process.exit(await discoverTasksCommand(cliArgs));
  }

  const config = await loadUiValidatorConfig(cliArgs);
  const result = await runValidationEngine(config);

  console.log(
    [
      `Report: ${path.relative(process.cwd(), config.reportOutputPath)}`,
      `Critical: ${result.report.summary.critical}`,
      `Warnings: ${result.report.summary.warning}`,
      `Info: ${result.report.summary.info}`,
      `Blocked tasks: ${result.report.tasks.blocked_by_critical}`,
    ].join('\n')
  );

  process.exit(result.exitCode);
}

main().catch((error) => {
  console.error(
    error instanceof Error ? (error.stack ?? error.message) : String(error)
  );
  process.exit(1);
});
