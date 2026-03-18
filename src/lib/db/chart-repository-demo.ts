/**
 * Demo/In-memory implementation of ChartRepository
 *
 * Used when DATABASE_URL is not available (e.g., Vercel free tier).
 * Charts are stored in memory and will be lost on server restart.
 */

import type { ChartConfig } from '@/types/chart-config';
import type {
  ChartRepository,
  SavedChart,
  SavedChartMeta,
  CreateChartInput,
  UpdateChartInput,
  ChartListFilters,
  ChartListPagination,
  ChartListResult,
  RepositoryResult,
} from '@vizualni/charts';
import { ChartStatus } from '@vizualni/charts';

/**
 * In-memory chart storage
 */
interface StoredChart {
  id: string;
  title: string;
  description: string | null;
  config: ChartConfig;
  datasetIds: string[];
  thumbnail: string | null;
  chartType: string;
  status: ChartStatus;
  views: number;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

// In-memory store (shared across all instances in the same process)
const chartStore = new Map<string, StoredChart>();

/**
 * Demo implementation of ChartRepository
 * Stores charts in memory - data is lost on server restart
 */
export class DemoChartRepository implements ChartRepository {
  async create(input: CreateChartInput): Promise<SavedChart> {
    const id = this.generateId();
    const now = new Date();

    const chart: StoredChart = {
      id,
      title: input.title,
      description: input.description ?? null,
      config: input.config,
      datasetIds: input.datasetIds,
      thumbnail: input.thumbnail ?? null,
      chartType: input.chartType,
      status: ChartStatus.DRAFT,
      views: 0,
      userId: input.userId ?? null,
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    };

    chartStore.set(id, chart);
    return this.toSavedChart(chart);
  }

  async getById(id: string): Promise<SavedChart | null> {
    const chart = chartStore.get(id);
    if (!chart) return null;
    return this.toSavedChart(chart);
  }

  async list(
    filters: ChartListFilters = {},
    pagination: ChartListPagination = {
      page: 1,
      pageSize: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }
  ): Promise<ChartListResult> {
    let charts = Array.from(chartStore.values());

    // Apply filters
    if (filters.status) {
      charts = charts.filter((c) => c.status === filters.status);
    } else {
      charts = charts.filter((c) => c.status !== ChartStatus.ARCHIVED);
    }

    if (filters.userId) {
      charts = charts.filter((c) => c.userId === filters.userId);
    }

    if (filters.chartType) {
      charts = charts.filter((c) => c.chartType === filters.chartType);
    }

    // Sort
    charts.sort((a, b) => {
      const aVal = a[pagination.sortBy];
      const bVal = b[pagination.sortBy];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return pagination.sortOrder === 'desc' ? -cmp : cmp;
    });

    const total = charts.length;
    const start = (pagination.page - 1) * pagination.pageSize;
    const paged = charts.slice(start, start + pagination.pageSize);

    return {
      charts: paged.map(this.toSavedChartMeta),
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }

  async update(
    id: string,
    input: UpdateChartInput
  ): Promise<SavedChart | null> {
    const chart = chartStore.get(id);
    if (!chart) return null;

    if (input.title !== undefined) chart.title = input.title;
    if (input.description !== undefined) chart.description = input.description;
    if (input.config !== undefined) {
      chart.config = input.config;
      chart.chartType = input.config.type;
    }
    if (input.datasetIds !== undefined) chart.datasetIds = input.datasetIds;
    if (input.thumbnail !== undefined) chart.thumbnail = input.thumbnail;
    if (input.chartType !== undefined) chart.chartType = input.chartType;

    chart.updatedAt = new Date();
    return this.toSavedChart(chart);
  }

  async updateOwned(
    id: string,
    userId: string,
    input: UpdateChartInput
  ): Promise<RepositoryResult<SavedChart>> {
    const chart = chartStore.get(id);

    if (!chart) {
      return { success: false, error: 'NOT_FOUND' };
    }

    if (chart.userId !== userId) {
      return { success: false, error: 'FORBIDDEN' };
    }

    const updated = await this.update(id, input);
    if (!updated) {
      return { success: false, error: 'NOT_FOUND' };
    }

    return { success: true, data: updated };
  }

  async softDelete(id: string): Promise<boolean> {
    const chart = chartStore.get(id);
    if (!chart) return false;

    chart.status = ChartStatus.ARCHIVED;
    chart.updatedAt = new Date();
    return true;
  }

  async softDeleteOwned(
    id: string,
    userId: string
  ): Promise<RepositoryResult<void>> {
    const chart = chartStore.get(id);

    if (!chart) {
      return { success: false, error: 'NOT_FOUND' };
    }

    if (chart.userId !== userId) {
      return { success: false, error: 'FORBIDDEN' };
    }

    chart.status = ChartStatus.ARCHIVED;
    chart.updatedAt = new Date();
    return { success: true, data: undefined };
  }

  async publish(id: string): Promise<SavedChart | null> {
    const chart = chartStore.get(id);
    if (!chart) return null;

    chart.status = ChartStatus.PUBLISHED;
    chart.publishedAt = new Date();
    chart.updatedAt = new Date();
    return this.toSavedChart(chart);
  }

  async publishOwned(
    id: string,
    userId: string
  ): Promise<RepositoryResult<SavedChart>> {
    const chart = chartStore.get(id);

    if (!chart) {
      return { success: false, error: 'NOT_FOUND' };
    }

    if (chart.userId !== userId) {
      return { success: false, error: 'FORBIDDEN' };
    }

    const published = await this.publish(id);
    if (!published) {
      return { success: false, error: 'NOT_FOUND' };
    }

    return { success: true, data: published };
  }

  async incrementViews(id: string): Promise<void> {
    const chart = chartStore.get(id);
    if (chart) {
      chart.views++;
    }
  }

  // Private helpers

  private generateId(): string {
    return `demo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  private toSavedChart(chart: StoredChart): SavedChart {
    return {
      id: chart.id,
      title: chart.title,
      description: chart.description,
      config: chart.config,
      datasetIds: chart.datasetIds,
      thumbnail: chart.thumbnail,
      chartType: chart.chartType,
      status: chart.status,
      views: chart.views,
      userId: chart.userId,
      createdAt: chart.createdAt,
      updatedAt: chart.updatedAt,
      publishedAt: chart.publishedAt,
    };
  }

  private toSavedChartMeta(chart: StoredChart): SavedChartMeta {
    return {
      id: chart.id,
      title: chart.title,
      description: chart.description,
      chartType: chart.chartType,
      status: chart.status,
      views: chart.views,
      thumbnail: chart.thumbnail,
      userId: chart.userId,
      createdAt: chart.createdAt,
      updatedAt: chart.updatedAt,
      publishedAt: chart.publishedAt,
    };
  }
}

/**
 * Check if demo mode is enabled
 */
export function isDemoMode(): boolean {
  // Explicit demo mode flag
  if (process.env.DEMO_MODE === 'true') return true;

  // No database URL means demo mode
  if (!process.env.DATABASE_URL) return true;

  // Static export builds are demo mode
  if (process.env.BUILD_MODE === 'static') return true;

  return false;
}
