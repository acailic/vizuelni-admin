/**
 * @jest-environment node
 *
 * Tests for PrismaChartRepository
 *
 * Note: Full integration tests require a database connection.
 * These tests verify the repository interface and factory function.
 * For comprehensive testing, use the setChartRepository() function to inject mocks.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ChartStatus } from '@vizualni/charts';
import type {
  ChartListFilters,
  ChartListPagination,
  ChartListResult,
  ChartRepository,
  CreateChartInput,
  RepositoryResult,
  SavedChart,
  UpdateChartInput,
} from '@vizualni/charts';
import {
  getChartRepository,
  setChartRepository,
} from '../chart-repository-prisma';

/**
 * Mock implementation of ChartRepository for testing
 */
class MockChartRepository implements ChartRepository {
  private charts: Map<string, SavedChart> = new Map();
  private nextId = 1;

  async create(input: CreateChartInput): Promise<SavedChart> {
    const chart: SavedChart = {
      id: `chart-${this.nextId++}`,
      title: input.title,
      description: input.description ?? null,
      config: input.config,
      datasetIds: input.datasetIds,
      thumbnail: input.thumbnail ?? null,
      chartType: input.chartType,
      status: ChartStatus.DRAFT,
      views: 0,
      userId: input.userId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: null,
    };
    this.charts.set(chart.id, chart);
    return chart;
  }

  async getById(id: string): Promise<SavedChart | null> {
    const chart = this.charts.get(id);
    if (!chart || chart.status === ChartStatus.ARCHIVED) {
      return null;
    }

    return chart;
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
    const allCharts = Array.from(this.charts.values()).filter((chart) => {
      if (filters.status) {
        return chart.status === filters.status;
      }

      if (chart.status === ChartStatus.ARCHIVED) {
        return false;
      }

      return (
        (!filters.userId || chart.userId === filters.userId) &&
        (!filters.chartType || chart.chartType === filters.chartType)
      );
    });

    const sortedCharts = [...allCharts].sort((a, b) => {
      const left = a[pagination.sortBy];
      const right = b[pagination.sortBy];
      const compare =
        left instanceof Date && right instanceof Date
          ? left.getTime() - right.getTime()
          : Number(left) - Number(right);

      return pagination.sortOrder === 'asc' ? compare : -compare;
    });

    const start = (pagination.page - 1) * pagination.pageSize;
    const charts = sortedCharts.slice(start, start + pagination.pageSize);

    return {
      charts,
      total: sortedCharts.length,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(sortedCharts.length / pagination.pageSize),
    };
  }

  async update(
    id: string,
    input: UpdateChartInput
  ): Promise<SavedChart | null> {
    const chart = this.charts.get(id);
    if (!chart) return null;
    const updated: SavedChart = {
      ...chart,
      ...input,
      chartType: input.chartType ?? input.config?.type ?? chart.chartType,
      updatedAt: new Date(),
    };
    this.charts.set(id, updated);
    return updated;
  }

  async updateOwned(
    id: string,
    userId: string,
    input: UpdateChartInput
  ): Promise<RepositoryResult<SavedChart>> {
    const chart = this.charts.get(id);
    if (!chart) return { success: false, error: 'NOT_FOUND' };
    if (chart.userId !== userId) return { success: false, error: 'FORBIDDEN' };
    const updated: SavedChart = {
      ...chart,
      ...input,
      chartType: input.chartType ?? input.config?.type ?? chart.chartType,
      updatedAt: new Date(),
    };
    this.charts.set(id, updated);
    return { success: true, data: updated };
  }

  async softDelete(id: string): Promise<boolean> {
    const chart = this.charts.get(id);
    if (!chart) return false;

    this.charts.set(id, {
      ...chart,
      status: ChartStatus.ARCHIVED,
      updatedAt: new Date(),
    });
    return true;
  }

  async softDeleteOwned(
    id: string,
    userId: string
  ): Promise<RepositoryResult<void>> {
    const chart = this.charts.get(id);
    if (!chart) return { success: false, error: 'NOT_FOUND' };
    if (chart.userId !== userId) return { success: false, error: 'FORBIDDEN' };
    this.charts.set(id, {
      ...chart,
      status: ChartStatus.ARCHIVED,
      updatedAt: new Date(),
    });
    return { success: true, data: undefined };
  }

  async publish(id: string): Promise<SavedChart | null> {
    const chart = this.charts.get(id);
    if (!chart) return null;
    const updated = {
      ...chart,
      status: ChartStatus.PUBLISHED,
      publishedAt: new Date(),
    };
    this.charts.set(id, updated);
    return updated;
  }

  async publishOwned(
    id: string,
    userId: string
  ): Promise<RepositoryResult<SavedChart>> {
    const chart = this.charts.get(id);
    if (!chart) return { success: false, error: 'NOT_FOUND' };
    if (chart.userId !== userId) return { success: false, error: 'FORBIDDEN' };
    const updated = {
      ...chart,
      status: ChartStatus.PUBLISHED,
      publishedAt: new Date(),
    };
    this.charts.set(id, updated);
    return { success: true, data: updated };
  }

  async incrementViews(id: string): Promise<void> {
    const chart = this.charts.get(id);
    if (chart) {
      chart.views += 1;
    }
  }
}

describe('ChartRepository', () => {
  let repository: ChartRepository;

  beforeEach(() => {
    repository = new MockChartRepository();
    setChartRepository(repository);
  });

  afterEach(() => {
    setChartRepository(null);
  });

  describe('create', () => {
    it('creates a chart with required fields', async () => {
      const input: CreateChartInput = {
        title: 'Test Chart',
        config: { type: 'bar', title: 'Test Chart' },
        datasetIds: ['dataset-1'],
        chartType: 'bar',
      };

      const result = await repository.create(input);

      expect(result.id).toBeDefined();
      expect(result.title).toBe('Test Chart');
      expect(result.chartType).toBe('bar');
      expect(result.status).toBe(ChartStatus.DRAFT);
      expect(result.views).toBe(0);
    });

    it('creates a chart with optional fields', async () => {
      const input: CreateChartInput = {
        title: 'Chart with Options',
        config: { type: 'line', title: 'Chart' },
        datasetIds: ['dataset-1'],
        chartType: 'line',
        description: 'A description',
        thumbnail: 'base64thumbnail',
        userId: 'user-123',
      };

      const result = await repository.create(input);

      expect(result.description).toBe('A description');
      expect(result.thumbnail).toBe('base64thumbnail');
      expect(result.userId).toBe('user-123');
    });
  });

  describe('getById', () => {
    it('returns chart when found', async () => {
      const created = await repository.create({
        title: 'Test',
        config: { type: 'bar', title: 'Test' },
        datasetIds: [],
        chartType: 'bar',
      });

      const result = await repository.getById(created.id);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(created.id);
    });

    it('returns null when not found', async () => {
      const result = await repository.getById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('list', () => {
    it('lists all charts', async () => {
      await repository.create({
        title: 'Chart 1',
        config: { type: 'bar', title: 'Chart 1' },
        datasetIds: [],
        chartType: 'bar',
      });
      await repository.create({
        title: 'Chart 2',
        config: { type: 'line', title: 'Chart 2' },
        datasetIds: [],
        chartType: 'line',
      });

      const result = await repository.list();

      expect(result.charts).toHaveLength(2);
      expect(result.total).toBe(2);
    });
  });

  describe('update', () => {
    it('updates chart fields', async () => {
      const created = await repository.create({
        title: 'Original',
        config: { type: 'bar', title: 'Original' },
        datasetIds: [],
        chartType: 'bar',
      });

      const result = await repository.update(created.id, { title: 'Updated' });

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Updated');
    });

    it('returns null for non-existent chart', async () => {
      const result = await repository.update('non-existent', {
        title: 'Updated',
      });

      expect(result).toBeNull();
    });
  });

  describe('updateOwned', () => {
    it('updates owned chart successfully', async () => {
      const created = await repository.create({
        title: 'Original',
        config: { type: 'bar', title: 'Original' },
        datasetIds: [],
        chartType: 'bar',
        userId: 'user-123',
      });

      const result = await repository.updateOwned(created.id, 'user-123', {
        title: 'Updated',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe('Updated');
      }
    });

    it('returns FORBIDDEN when user does not own chart', async () => {
      const created = await repository.create({
        title: 'Original',
        config: { type: 'bar', title: 'Original' },
        datasetIds: [],
        chartType: 'bar',
        userId: 'user-123',
      });

      const result = await repository.updateOwned(created.id, 'other-user', {
        title: 'Updated',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('FORBIDDEN');
      }
    });

    it('returns NOT_FOUND when chart does not exist', async () => {
      const result = await repository.updateOwned('non-existent', 'user-123', {
        title: 'Updated',
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('NOT_FOUND');
      }
    });
  });

  describe('softDelete', () => {
    it('deletes a chart', async () => {
      const created = await repository.create({
        title: 'To Delete',
        config: { type: 'bar', title: 'To Delete' },
        datasetIds: [],
        chartType: 'bar',
      });

      const result = await repository.softDelete(created.id);

      expect(result).toBe(true);

      const fetched = await repository.getById(created.id);
      expect(fetched).toBeNull();
    });
  });

  describe('softDeleteOwned', () => {
    it('deletes owned chart successfully', async () => {
      const created = await repository.create({
        title: 'To Delete',
        config: { type: 'bar', title: 'To Delete' },
        datasetIds: [],
        chartType: 'bar',
        userId: 'user-123',
      });

      const result = await repository.softDeleteOwned(created.id, 'user-123');

      expect(result.success).toBe(true);
    });

    it('returns FORBIDDEN when user does not own chart', async () => {
      const created = await repository.create({
        title: 'To Delete',
        config: { type: 'bar', title: 'To Delete' },
        datasetIds: [],
        chartType: 'bar',
        userId: 'user-123',
      });

      const result = await repository.softDeleteOwned(created.id, 'other-user');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('FORBIDDEN');
      }
    });
  });

  describe('publish', () => {
    it('publishes a chart', async () => {
      const created = await repository.create({
        title: 'To Publish',
        config: { type: 'bar', title: 'To Publish' },
        datasetIds: [],
        chartType: 'bar',
      });

      const result = await repository.publish(created.id);

      expect(result).not.toBeNull();
      expect(result?.status).toBe(ChartStatus.PUBLISHED);
      expect(result?.publishedAt).not.toBeNull();
    });
  });

  describe('publishOwned', () => {
    it('publishes owned chart successfully', async () => {
      const created = await repository.create({
        title: 'To Publish',
        config: { type: 'bar', title: 'To Publish' },
        datasetIds: [],
        chartType: 'bar',
        userId: 'user-123',
      });

      const result = await repository.publishOwned(created.id, 'user-123');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe(ChartStatus.PUBLISHED);
      }
    });

    it('returns FORBIDDEN when user does not own chart', async () => {
      const created = await repository.create({
        title: 'To Publish',
        config: { type: 'bar', title: 'To Publish' },
        datasetIds: [],
        chartType: 'bar',
        userId: 'user-123',
      });

      const result = await repository.publishOwned(created.id, 'other-user');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('FORBIDDEN');
      }
    });
  });

  describe('incrementViews', () => {
    it('increments view count', async () => {
      const created = await repository.create({
        title: 'Test',
        config: { type: 'bar', title: 'Test' },
        datasetIds: [],
        chartType: 'bar',
      });

      await repository.incrementViews(created.id);

      const fetched = await repository.getById(created.id);
      expect(fetched?.views).toBe(1);
    });
  });

  describe('getChartRepository', () => {
    it('returns the injected repository', async () => {
      const repo = getChartRepository();

      expect(repo).toBe(repository);
    });
  });
});
