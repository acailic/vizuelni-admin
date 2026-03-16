/** @jest-environment node */

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/auth/auth-options', () => ({
  authOptions: {},
}));

jest.mock('@/lib/api/csrf', () => ({
  validateCsrf: jest.fn(() => null),
}));

jest.mock('@/lib/db/chart-repository-prisma', () => ({
  getChartRepository: jest.fn(),
}));

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { POST } from '@/app/api/charts/[id]/publish/route';
import { getChartRepository } from '@/lib/db/chart-repository-prisma';

const mockGetServerSession = jest.mocked(getServerSession);
const mockGetChartRepository = jest.mocked(getChartRepository);

describe('/api/charts/[id]/publish route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 401 when publishing without an authenticated user', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new NextRequest(
      'http://localhost/api/charts/chart-1/publish',
      {
        method: 'POST',
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ id: 'chart-1' }),
    });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
  });

  it('returns the published chart on success', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1' },
    } as never);
    mockGetChartRepository.mockReturnValue({
      publishOwned: jest.fn().mockResolvedValue({
        success: true,
        data: { id: 'chart-1', status: 'PUBLISHED' },
      }),
    } as never);

    const request = new NextRequest(
      'http://localhost/api/charts/chart-1/publish',
      {
        method: 'POST',
      }
    );

    const response = await POST(request, {
      params: Promise.resolve({ id: 'chart-1' }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      id: 'chart-1',
      status: 'PUBLISHED',
    });
  });
});
