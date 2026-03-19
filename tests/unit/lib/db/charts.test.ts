jest.mock('@/lib/db/prisma', () => ({
  __esModule: true,
  default: {
    savedChart: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    $executeRaw: jest.fn(),
  },
}));

import { ChartStatus } from '@/types/persistence';
import { listCharts, incrementViews } from '@/lib/db/charts';

const prismaMock = jest.requireMock('@/lib/db/prisma').default as {
  savedChart: {
    create: jest.Mock;
    findUnique: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
    update: jest.Mock;
  };
  $executeRaw: jest.Mock;
};

describe('listCharts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns an empty result when the charts table is missing', async () => {
    prismaMock.savedChart.findMany.mockRejectedValue(
      new Error('The table `main.charts` does not exist.')
    );

    const result = await listCharts(
      { status: ChartStatus.PUBLISHED },
      { page: 2, pageSize: 12, sortBy: 'createdAt', sortOrder: 'desc' }
    );

    expect(result).toEqual({
      charts: [],
      total: 0,
      page: 2,
      pageSize: 12,
      totalPages: 0,
    });
  });
});

describe('incrementViews', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses Prisma atomic increment instead of raw SQL', async () => {
    const chartId = 'test-chart-id';

    prismaMock.savedChart.update.mockResolvedValue({
      id: chartId,
      views: 1,
    });

    await incrementViews(chartId);

    // Should use Prisma's update with increment, not $executeRaw
    expect(prismaMock.savedChart.update).toHaveBeenCalledWith({
      where: { id: chartId },
      data: { views: { increment: 1 } },
    });

    // Should NOT use raw SQL
    expect(prismaMock.$executeRaw).not.toHaveBeenCalled();
  });

  it('throws error when chart not found', async () => {
    const chartId = 'non-existent-id';

    const prismaError = new Error('Record not found');
    (prismaError as unknown as Record<string, unknown>).code = 'P2025';
    prismaMock.savedChart.update.mockRejectedValue(prismaError);

    // Should throw the error, not silently catch it
    await expect(incrementViews(chartId)).rejects.toThrow('Record not found');
  });
});
