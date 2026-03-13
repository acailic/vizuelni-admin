import { prisma } from '@/lib/db/prisma';
import type {
  ChartStatistics,
  ViewStatistics,
  PopularChart,
  DatasetStatistics,
} from './types';

/**
 * Calculate months between two dates
 */
function monthsBetween(start: Date, end: Date): number {
  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  return Math.max(1, months);
}

/**
 * Get chart creation statistics
 */
export async function getChartStatistics(): Promise<ChartStatistics> {
  const [total, oldestChart] = await Promise.all([
    prisma.savedChart.count({
      where: { status: 'PUBLISHED' },
    }),
    prisma.savedChart.findFirst({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    }),
  ]);

  const monthsActive = oldestChart
    ? monthsBetween(oldestChart.createdAt, new Date())
    : 1;

  const perMonthAverage = Math.round(total / monthsActive);

  const dashboards = await prisma.savedChart.count({
    where: { status: 'PUBLISHED' },
  });

  return {
    total,
    perMonthAverage,
    dashboards,
  };
}

/**
 * Get view statistics
 */
export async function getViewStatistics(): Promise<ViewStatistics> {
  const result = await prisma.savedChart.aggregate({
    where: { status: 'PUBLISHED' },
    _sum: { views: true },
  });

  const total = result._sum.views || 0;

  const oldestChart = await prisma.savedChart.findFirst({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  });

  const monthsActive = oldestChart
    ? monthsBetween(oldestChart.createdAt, new Date())
    : 1;

  const perMonthAverage = Math.round(total / monthsActive);
  const previews = 0;

  return {
    total,
    perMonthAverage,
    previews,
  };
}

/**
 * Get popular charts
 */
export async function getPopularCharts(
  limit: number = 25,
  since?: Date
): Promise<PopularChart[]> {
  const charts = await prisma.savedChart.findMany({
    where: {
      status: 'PUBLISHED',
      ...(since && { createdAt: { gte: since } }),
    },
    orderBy: { views: 'desc' },
    take: limit,
    select: {
      id: true,
      title: true,
      thumbnail: true,
      views: true,
      createdAt: true,
      userId: true,
    },
  });

  return charts.map((chart) => ({
    id: chart.id,
    title: chart.title,
    thumbnail: chart.thumbnail,
    views: chart.views,
    createdAt: chart.createdAt,
    createdBy: chart.userId,
  }));
}

/**
 * Get dataset statistics
 */
export async function getDatasetStatistics(): Promise<DatasetStatistics> {
  // Placeholder - would query actual dataset sources
  return {
    total: 0,
    usedInCharts: 0,
    organizations: 0,
  };
}
