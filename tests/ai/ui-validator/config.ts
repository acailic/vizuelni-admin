import { access, mkdir, readFile, readdir, writeFile } from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import YAML from 'yaml';

import { resolveLocalizedRoute } from '../fixtures/test-helpers';
import { LOCALES, type Locale } from '../stagehand.config';
import type { DiscoveredTask } from './schemas/task.schema';
import { viewportSchema } from './schemas/issue.schema';

const uiValidatorPageSchema = z.object({
  path: z.string().min(1),
  name: z.string().min(1),
  locale: z.enum(LOCALES).optional(),
});

const criticalElementSchema = z.object({
  selector: z.string().min(1),
  expectation: z.string().min(1),
  required: z.boolean().default(true),
  must_be_visible: z.boolean().default(true),
  min_count: z.number().int().positive().optional(),
  max_count: z.number().int().positive().optional(),
  text_contains: z.string().min(1).optional(),
});

const uiValidationSpecSchema = z.object({
  path: z.string().min(1),
  name: z.string().optional(),
  locale: z.enum(LOCALES).optional(),
  critical_elements: z.array(criticalElementSchema).default([]),
});

const uiValidatorConfigSchema = z.object({
  model: z.string().default('glm-5'),
  defaultLocale: z.enum(LOCALES).default('sr-Latn'),
  pages: z.array(uiValidatorPageSchema).default([
    { path: '/', name: 'Home' },
    { path: '/browse', name: 'Browse' },
    { path: '/create', name: 'Create' },
  ]),
  specs: z.array(z.string()).default(['.ui-validator/specs/*.yaml']),
  discovery: z
    .object({
      max_depth: z.number().int().positive().default(3),
      include_forms: z.boolean().default(true),
      include_navigation: z.boolean().default(true),
      cache_ttl_hours: z.number().positive().default(24),
    })
    .default({}),
  validation: z
    .object({
      viewports: z.array(viewportSchema).default([
        { width: 1280, height: 800, name: 'desktop' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 375, height: 667, name: 'mobile' },
      ]),
      screenshot_on_issue: z.boolean().default(true),
      dom_snapshot_on_issue: z.boolean().default(true),
      timeout_ms: z.number().int().positive().default(30000),
    })
    .default({}),
  report: z
    .object({
      format: z.literal('json').default('json'),
      output: z.string().default('test-results/ui-validation.json'),
      include_screenshots: z.boolean().default(true),
      include_suggestions: z.boolean().default(true),
      include_dom_snapshots: z.boolean().default(false),
    })
    .default({}),
  thresholds: z
    .object({
      max_critical: z.number().int().nonnegative().default(0),
      max_warnings: z.number().int().nonnegative().default(10),
    })
    .default({}),
});

export type UiValidatorPage = z.infer<typeof uiValidatorPageSchema>;
export type UiValidationSpec = z.infer<typeof uiValidationSpecSchema>;
export type UiValidatorConfig = z.infer<typeof uiValidatorConfigSchema>;
export type CriticalElementSpec = z.infer<typeof criticalElementSchema>;

export interface UiValidatorCliOptions {
  configPath?: string;
  pages?: string[];
  strict?: boolean;
  maxCritical?: number;
  maxWarnings?: number;
}

export interface ResolvedUiValidatorPage extends UiValidatorPage {
  locale: Locale;
  localizedPath: string;
  normalizedPath: string;
}

export interface ResolvedUiValidationSpec extends UiValidationSpec {
  locale: Locale;
  localizedPath: string;
  normalizedPath: string;
  sourceFile: string;
}

export interface ResolvedUiValidatorConfig extends UiValidatorConfig {
  configPath: string;
  rootDir: string;
  cachePath: string;
  screenshotDir: string;
  domSnapshotDir: string;
  reportOutputPath: string;
  strict: boolean;
  resolvedPages: ResolvedUiValidatorPage[];
  resolvedSpecs: ResolvedUiValidationSpec[];
}

function toAbsolutePath(filePath: string): string {
  return path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
}

function escapeRegex(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

function matchesSimpleGlob(fileName: string, pattern: string): boolean {
  const regex = new RegExp(
    `^${escapeRegex(pattern).replace(/\*/g, '.*')}$`,
    'i'
  );
  return regex.test(fileName);
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function expandSpecPattern(pattern: string): Promise<string[]> {
  const absolutePattern = toAbsolutePath(pattern);

  if (!absolutePattern.includes('*')) {
    return (await fileExists(absolutePattern)) ? [absolutePattern] : [];
  }

  const directory = path.dirname(absolutePattern);
  const filePattern = path.basename(absolutePattern);

  if (!(await fileExists(directory))) {
    return [];
  }

  const entries = await readdir(directory);
  return entries
    .filter((entry) => matchesSimpleGlob(entry, filePattern))
    .sort((left, right) => left.localeCompare(right))
    .map((entry) => path.join(directory, entry));
}

function resolvePageConfig(
  pageConfig: UiValidatorPage,
  defaultLocale: Locale
): ResolvedUiValidatorPage {
  const route = resolveLocalizedRoute(
    pageConfig.path,
    pageConfig.locale ?? defaultLocale
  );

  return {
    ...pageConfig,
    locale: pageConfig.locale ?? route.locale,
    localizedPath: route.localizedPath,
    normalizedPath: route.path,
  };
}

function pageMatchesFilter(
  pageConfig: ResolvedUiValidatorPage,
  filters: string[]
): boolean {
  return filters.some((filterValue) => {
    const normalizedFilter = filterValue.startsWith('/')
      ? filterValue
      : `/${filterValue}`;

    return [
      pageConfig.path,
      pageConfig.normalizedPath,
      pageConfig.localizedPath,
    ].includes(normalizedFilter);
  });
}

async function loadSpecFile(
  sourceFile: string,
  defaultLocale: Locale
): Promise<ResolvedUiValidationSpec> {
  const raw = await readFile(sourceFile, 'utf8');
  const parsed = uiValidationSpecSchema.parse(YAML.parse(raw) ?? {});
  const route = resolveLocalizedRoute(
    parsed.path,
    parsed.locale ?? defaultLocale
  );

  return {
    ...parsed,
    locale: parsed.locale ?? route.locale,
    localizedPath: route.localizedPath,
    normalizedPath: route.path,
    sourceFile,
  };
}

export async function loadUiValidatorConfig(
  cliOptions: UiValidatorCliOptions = {}
): Promise<ResolvedUiValidatorConfig> {
  const configPath = toAbsolutePath(
    cliOptions.configPath ?? '.ui-validator/config.yaml'
  );
  const rootDir = path.dirname(configPath);
  const rawConfig = (await fileExists(configPath))
    ? YAML.parse(await readFile(configPath, 'utf8'))
    : {};
  const parsedConfig = uiValidatorConfigSchema.parse(rawConfig ?? {});

  const resolvedPages = parsedConfig.pages
    .map((pageConfig) =>
      resolvePageConfig(pageConfig, parsedConfig.defaultLocale)
    )
    .filter((pageConfig) =>
      cliOptions.pages?.length
        ? pageMatchesFilter(pageConfig, cliOptions.pages)
        : true
    );

  const specFiles = (
    await Promise.all(
      parsedConfig.specs.map((pattern) => expandSpecPattern(pattern))
    )
  ).flat();

  const resolvedSpecs = await Promise.all(
    specFiles.map((sourceFile) =>
      loadSpecFile(sourceFile, parsedConfig.defaultLocale)
    )
  );

  const strict = cliOptions.strict ?? false;
  const thresholds = {
    max_critical:
      cliOptions.maxCritical ??
      (strict ? 0 : parsedConfig.thresholds.max_critical),
    max_warnings:
      cliOptions.maxWarnings ??
      (strict ? 0 : parsedConfig.thresholds.max_warnings),
  };

  const reportOutputPath = toAbsolutePath(parsedConfig.report.output);
  const screenshotDir = path.join(rootDir, 'screenshots');
  const domSnapshotDir = path.join(rootDir, 'dom-snapshots');
  const cachePath = path.join(rootDir, 'discovered-tasks.json');

  await mkdir(rootDir, { recursive: true });
  await mkdir(path.join(rootDir, 'specs'), { recursive: true });
  await mkdir(path.dirname(reportOutputPath), { recursive: true });

  return {
    ...parsedConfig,
    thresholds,
    configPath,
    rootDir,
    cachePath,
    screenshotDir,
    domSnapshotDir,
    reportOutputPath,
    strict,
    resolvedPages,
    resolvedSpecs,
  };
}

export function getSpecsForPage(
  config: ResolvedUiValidatorConfig,
  pageConfig: ResolvedUiValidatorPage
): ResolvedUiValidationSpec[] {
  return config.resolvedSpecs.filter((spec) => {
    return (
      spec.normalizedPath === pageConfig.normalizedPath &&
      spec.locale === pageConfig.locale
    );
  });
}

export async function writeTaskCache(
  cachePath: string,
  tasks: DiscoveredTask[]
): Promise<void> {
  await mkdir(path.dirname(cachePath), { recursive: true });
  await writeFile(
    cachePath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        tasks,
      },
      null,
      2
    ),
    'utf8'
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export async function promoteTaskToSpec(
  task: DiscoveredTask,
  config: ResolvedUiValidatorConfig
): Promise<string> {
  const targetFile = path.join(
    config.rootDir,
    'specs',
    `${slugify(task.name || task.id || 'task')}.yaml`
  );

  const document = {
    path: task.page,
    name: task.name,
    critical_elements: Array.from(new Set(task.criticalElements)).map(
      (selector) => ({
        selector,
        expectation: `Required to complete task "${task.name}"`,
      })
    ),
  };

  await writeFile(targetFile, YAML.stringify(document), 'utf8');
  return targetFile;
}
