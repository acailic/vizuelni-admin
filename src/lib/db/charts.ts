import { Prisma } from '@prisma/client';

import type { ChartConfig } from '@/types/chart-config';
import type {
  SavedChart,
  SavedChartMeta,
  CreateChartInput,
  UpdateChartInput,
  ChartListFilters,
  ChartListPagination,
  ChartListResult,
} from '@/types/persistence';
import { ChartStatus } from '@/types/persistence';
import prisma from './prisma';

/**
 * Create a new saved chart
 */
export async function createChart(
  input: CreateChartInput
): Promise<SavedChart> {
  const chart = await prisma.savedChart.create({
    data: {
      title: input.title,
      description: input.description,
      config: JSON.stringify(input.config),
      datasetIds: JSON.stringify(input.datasetIds),
      thumbnail: input.thumbnail,
      chartType: input.chartType,
      userId: input.userId,
      status: ChartStatus.DRAFT,
    },
  });

  return dbChartToSavedChart(chart);
}

/**
 * Get a chart by ID
 */
export async function getChartById(id: string): Promise<SavedChart | null> {
  const chart = await prisma.savedChart.findUnique({
    where: { id },
  });

  if (!chart) return null;
  return dbChartToSavedChart(chart);
}

/**
 * List charts with filters and pagination
 */
export async function listCharts(
  filters: ChartListFilters = {},
  pagination: ChartListPagination = {
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  }
): Promise<ChartListResult> {
  const where = {
    ...(filters.status
      ? { status: filters.status }
      : { status: { not: ChartStatus.ARCHIVED } }),
    ...(filters.userId && { userId: filters.userId }),
    ...(filters.chartType && { chartType: filters.chartType }),
  };

  try {
    const [charts, total] = await Promise.all([
      prisma.savedChart.findMany({
        where,
        orderBy: { [pagination.sortBy]: pagination.sortOrder },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
      }),
      prisma.savedChart.count({ where }),
    ]);

    return {
      charts: charts.map(dbChartToMeta),
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  } catch (error) {
    if (isMissingChartsTableError(error)) {
      return emptyChartListResult(pagination);
    }

    throw error;
  }
}

/**
 * Update a chart with ownership verification
 *
 * @deprecated Use getChartRepository().updateOwned() instead for atomic ownership checks.
 * This function requires userId to prevent unauthorized modifications.
 */
export async function updateChartOwned(
  id: string,
  userId: string,
  input: UpdateChartInput
): Promise<SavedChart | null> {
  const result = await prisma.savedChart.updateMany({
    where: { id, userId },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.config !== undefined && {
        config: JSON.stringify(input.config),
      }),
      ...(input.datasetIds !== undefined && {
        datasetIds: JSON.stringify(input.datasetIds),
      }),
      ...(input.thumbnail !== undefined && { thumbnail: input.thumbnail }),
      ...(input.chartType !== undefined && { chartType: input.chartType }),
    },
  });

  if (result.count === 0) {
    return null;
  }

  return getChartById(id);
}

/**
 * Soft delete a chart with ownership verification (set status to ARCHIVED)
 *
 * @deprecated Use getChartRepository().softDeleteOwned() instead for atomic ownership checks.
 * This function requires userId to prevent unauthorized deletions.
 */
export async function deleteChartOwned(
  id: string,
  userId: string
): Promise<boolean> {
  const result = await prisma.savedChart.updateMany({
    where: { id, userId },
    data: { status: ChartStatus.ARCHIVED },
  });

  return result.count > 0;
}

/**
 * Publish a chart with ownership verification (set status to PUBLISHED)
 *
 * @deprecated Use getChartRepository().publishOwned() instead for atomic ownership checks.
 * This function requires userId to prevent unauthorized publishing.
 */
export async function publishChartOwned(
  id: string,
  userId: string
): Promise<SavedChart | null> {
  const result = await prisma.savedChart.updateMany({
    where: { id, userId },
    data: {
      status: ChartStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  if (result.count === 0) {
    return null;
  }

  return getChartById(id);
}

/**
 * Increment view counter
 * Uses Prisma's atomic increment to prevent race conditions
 */
export async function incrementViews(id: string): Promise<void> {
  await prisma.savedChart.update({
    where: { id },
    data: { views: { increment: 1 } },
  });
}

/**
 * Get public gallery charts (published only)
 */
export async function getGalleryCharts(
  pagination: Omit<ChartListPagination, 'status'> = {
    page: 1,
    pageSize: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  }
): Promise<ChartListResult> {
  return listCharts({ status: ChartStatus.PUBLISHED }, pagination);
}

// Helper functions to convert DB models to domain types

function dbChartToSavedChart(chart: {
  id: string;
  title: string;
  description: string | null;
  config: string;
  datasetIds: string;
  thumbnail: string | null;
  chartType: string;
  status: string;
  views: number;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}): SavedChart {
  return {
    id: chart.id,
    title: chart.title,
    description: chart.description,
    config: JSON.parse(chart.config) as ChartConfig,
    datasetIds: JSON.parse(chart.datasetIds) as string[],
    thumbnail: chart.thumbnail,
    chartType: chart.chartType,
    status: chart.status as ChartStatus,
    views: chart.views,
    userId: chart.userId,
    createdAt: chart.createdAt,
    updatedAt: chart.updatedAt,
    publishedAt: chart.publishedAt,
  };
}

function emptyChartListResult(
  pagination: ChartListPagination
): ChartListResult {
  return {
    charts: [],
    total: 0,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages: 0,
  };
}

function isMissingChartsTableError(error: unknown): boolean {
  if (isPrismaKnownRequestError(error)) {
    return error.code === 'P2021';
  }

  return (
    error instanceof Error &&
    /table .*charts.* does not exist/i.test(error.message)
  );
}

function isPrismaKnownRequestError(
  error: unknown
): error is Prisma.PrismaClientKnownRequestError {
  return Boolean(
    error &&
    typeof error === 'object' &&
    'code' in error &&
    typeof (error as { code?: unknown }).code === 'string'
  );
}

function dbChartToMeta(chart: {
  id: string;
  title: string;
  description: string | null;
  chartType: string;
  status: string;
  views: number;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}): SavedChartMeta {
  return {
    id: chart.id,
    title: chart.title,
    description: chart.description,
    chartType: chart.chartType,
    status: chart.status as ChartStatus,
    views: chart.views,
    userId: chart.userId,
    createdAt: chart.createdAt,
    updatedAt: chart.updatedAt,
    publishedAt: chart.publishedAt,
  };
}
