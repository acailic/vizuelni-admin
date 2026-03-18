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
import { listCharts } from '@/lib/db/charts';

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
