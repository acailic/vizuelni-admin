/**
 * @vizualni/charts - Dashboard Rules
 *
 * Domain rules for dashboard management.
 * Extracted from src/stores/dashboard.ts for reuse.
 */

/**
 * Maximum number of charts allowed in a dashboard
 */
export const MAX_CHARTS = 6;

/**
 * Checks if a new chart can be added to the dashboard
 */
export function canAddChart(currentChartCount: number): boolean {
  return currentChartCount < MAX_CHARTS;
}

/**
 * Dashboard layout item shape
 */
export interface DashboardLayoutItem {
  chartId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

/**
 * Shared filter configuration shape
 */
export interface SharedFilterConfig {
  enabled: boolean;
  syncDimensions: string[];
  syncTimeRange: boolean;
}

/**
 * Dashboard configuration shape
 * @template TChart - The chart configuration type (defaults to unknown for flexibility)
 */
export interface DashboardConfig<TChart = unknown> {
  id: string;
  title: string;
  description?: string;
  layout: DashboardLayoutItem[];
  charts: Record<string, TChart>;
  sharedFilters: SharedFilterConfig;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Dashboard template shape
 */
export interface DashboardTemplate {
  id: string;
  name: string;
  nameKey: string;
  description: string;
  descriptionKey: string;
  layout: DashboardLayoutItem[];
  chartPlaceholders: Array<{
    chartId: string;
    suggestedType: string;
    label: string;
  }>;
}

/**
 * Runtime validation for dashboard payloads crossing persistence or URL boundaries.
 */
export function isValidDashboardConfig<TChart = unknown>(
  config: unknown
): config is DashboardConfig<TChart> {
  if (!config || typeof config !== 'object') {
    return false;
  }

  const candidate = config as Partial<DashboardConfig<TChart>>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    Array.isArray(candidate.layout) &&
    Boolean(candidate.charts) &&
    typeof candidate.charts === 'object' &&
    Boolean(candidate.sharedFilters) &&
    typeof candidate.sharedFilters === 'object' &&
    typeof candidate.sharedFilters.enabled === 'boolean' &&
    Array.isArray(candidate.sharedFilters.syncDimensions) &&
    typeof candidate.sharedFilters.syncTimeRange === 'boolean'
  );
}

/**
 * Generates a unique dashboard ID
 */
export function generateDashboardId(): string {
  return `dashboard-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Creates an empty dashboard configuration
 */
export function createEmptyDashboard<TChart = unknown>(
  title = 'Untitled Dashboard'
): DashboardConfig<TChart> {
  const now = new Date().toISOString();
  return {
    id: generateDashboardId(),
    title,
    layout: [],
    charts: {},
    sharedFilters: {
      enabled: false,
      syncDimensions: [],
      syncTimeRange: false,
    },
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Creates a dashboard from a template
 */
export function createDashboardFromTemplate<TChart = unknown>(
  template: DashboardTemplate,
  title?: string
): DashboardConfig<TChart> {
  const now = new Date().toISOString();
  return {
    id: generateDashboardId(),
    title: title ?? template.name,
    layout: template.layout.map((item) => ({ ...item })),
    charts: {},
    sharedFilters: {
      enabled: false,
      syncDimensions: [],
      syncTimeRange: false,
    },
    createdAt: now,
    updatedAt: now,
  };
}
