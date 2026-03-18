jest.mock('@/lib/db/prisma', () => ({
  __esModule: true,
  default: {
    savedChart: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    $executeRaw: jest.fn(),
  },
}));

import { ChartStatus } from '@vizualni/charts';

import { PrismaChartRepository } from '@/lib/db/chart-repository-prisma';

const prismaMock = jest.requireMock('@/lib/db/prisma').default as {
  savedChart: {
    create: jest.Mock;
    findUnique: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
  };
  $executeRaw: jest.Mock;
};

const repository = new PrismaChartRepository();

const baseDbChart = {
  id: 'chart-1',
  title: 'Budget chart',
  description: 'Budget overview',
  config: JSON.stringify({ type: 'column', title: 'Budget chart' }),
  datasetIds: JSON.stringify(['dataset-1']),
  thumbnail: null,
  chartType: 'column',
  status: ChartStatus.DRAFT,
  views: 42,
  userId: 'user-1',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-02T00:00:00.000Z'),
  publishedAt: null,
};

describe('PrismaChartRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('serializes config and dataset ids when creating charts', async () => {
    prismaMock.savedChart.create.mockResolvedValue(baseDbChart);

    const result = await repository.create({
      title: 'Budget chart',
      description: 'Budget overview',
      config: { type: 'column', title: 'Budget chart' },
      datasetIds: ['dataset-1'],
      thumbnail: undefined,
      chartType: 'column',
      userId: 'user-1',
    });

    expect(prismaMock.savedChart.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: 'Budget chart',
        description: 'Budget overview',
        config: JSON.stringify({ type: 'column', title: 'Budget chart' }),
        datasetIds: JSON.stringify(['dataset-1']),
        status: ChartStatus.DRAFT,
      }),
    });
    expect(result).toMatchObject({
      id: 'chart-1',
      chartType: 'column',
      datasetIds: ['dataset-1'],
      status: ChartStatus.DRAFT,
    });
  });

  it('returns FORBIDDEN when an ownership-checked update hits another users chart', async () => {
    prismaMock.savedChart.updateMany.mockResolvedValue({ count: 0 });
    prismaMock.savedChart.findUnique.mockResolvedValue({
      id: 'chart-1',
      userId: 'another-user',
    });

    const result = await repository.updateOwned('chart-1', 'user-1', {
      title: 'Updated',
    });

    expect(prismaMock.savedChart.updateMany).toHaveBeenCalledWith({
      where: { id: 'chart-1', userId: 'user-1' },
      data: { title: 'Updated' },
    });
    expect(result).toEqual({ success: false, error: 'FORBIDDEN' });
  });

  it('publishes owned charts and returns the refreshed saved chart', async () => {
    prismaMock.savedChart.updateMany.mockResolvedValue({ count: 1 });
    prismaMock.savedChart.findUnique.mockResolvedValue({
      ...baseDbChart,
      status: ChartStatus.PUBLISHED,
      publishedAt: new Date('2024-01-03T00:00:00.000Z'),
    });

    const result = await repository.publishOwned('chart-1', 'user-1');

    expect(prismaMock.savedChart.updateMany).toHaveBeenCalledWith({
      where: { id: 'chart-1', userId: 'user-1' },
      data: expect.objectContaining({
        status: ChartStatus.PUBLISHED,
        publishedAt: expect.any(Date),
      }),
    });
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      id: 'chart-1',
      status: ChartStatus.PUBLISHED,
    });
  });
});
