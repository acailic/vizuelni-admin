import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
  getChartStatistics,
  getPopularCharts,
  getViewStatistics,
  getDatasetStatistics,
} from '../queries';

// Mock Prisma client
jest.mock('@/lib/db/prisma', () => {
  const mockSavedChart = {
    count: jest.fn(),
    findFirst: jest.fn(),
    aggregate: jest.fn(),
    findMany: jest.fn(),
  };

  return {
    prisma: {
      savedChart: mockSavedChart,
    },
  };
});

import { prisma } from '@/lib/db/prisma';

const mockPrisma = prisma as any;

describe('Statistics Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getChartStatistics returns total count and monthly average', async () => {
    mockPrisma.savedChart.count
      .mockResolvedValueOnce(100) // total count
      .mockResolvedValueOnce(10); // dashboards count
    mockPrisma.savedChart.findFirst.mockResolvedValue({
      createdAt: new Date('2025-01-01'),
    } as any);

    const stats = await getChartStatistics();

    expect(stats).toHaveProperty('total', 100);
    expect(stats).toHaveProperty('perMonthAverage');
    expect(stats.total).toBeGreaterThanOrEqual(0);
  });

  it('getViewStatistics returns aggregated view counts', async () => {
    mockPrisma.savedChart.aggregate.mockResolvedValue({
      _sum: { views: 5000 },
    } as any);
    mockPrisma.savedChart.findFirst.mockResolvedValue({
      createdAt: new Date('2025-01-01'),
    } as any);

    const stats = await getViewStatistics();

    expect(stats).toHaveProperty('total', 5000);
    expect(stats).toHaveProperty('perMonthAverage');
  });

  it('getPopularCharts returns charts sorted by views', async () => {
    mockPrisma.savedChart.findMany.mockResolvedValue([
      {
        id: '1',
        title: 'Chart 1',
        views: 100,
        thumbnail: null,
        createdAt: new Date(),
        userId: null,
      },
      {
        id: '2',
        title: 'Chart 2',
        views: 50,
        thumbnail: null,
        createdAt: new Date(),
        userId: null,
      },
    ] as any);

    const charts = await getPopularCharts(5);

    expect(charts.length).toBeLessThanOrEqual(5);
    // Verify sorted by views descending
    for (let i = 1; i < charts.length; i++) {
      expect(charts[i - 1].views).toBeGreaterThanOrEqual(charts[i].views);
    }
  });

  it('getDatasetStatistics returns placeholder values', async () => {
    const stats = await getDatasetStatistics();
    expect(stats).toHaveProperty('total');
    expect(stats).toHaveProperty('usedInCharts');
    expect(stats).toHaveProperty('organizations');
  });
});
