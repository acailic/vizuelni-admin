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

jest.mock('@/lib/api/rate-limit', () => ({
  checkRateLimit: jest.fn(() => null),
  RATE_LIMIT_CONFIGS: {
    api: 'api',
    readOnly: 'readOnly',
  },
}));

jest.mock('@/lib/db/chart-repository-prisma', () => ({
  getChartRepository: jest.fn(),
}));

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';

import { DELETE, PUT } from '@/app/api/charts/[id]/route';
import { getChartRepository } from '@/lib/db/chart-repository-prisma';

const mockGetServerSession = jest.mocked(getServerSession);
const mockGetChartRepository = jest.mocked(getChartRepository);

describe('/api/charts/[id] routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 403 when PUT hits a forbidden ownership check', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1' },
    } as never);
    mockGetChartRepository.mockReturnValue({
      updateOwned: jest
        .fn()
        .mockResolvedValue({ success: false, error: 'FORBIDDEN' }),
    } as never);

    const request = new NextRequest('http://localhost/api/charts/chart-1', {
      method: 'PUT',
      body: JSON.stringify({ title: 'Updated title' }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await PUT(request, {
      params: Promise.resolve({ id: 'chart-1' }),
    });

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: 'Forbidden' });
  });

  it('returns 404 when DELETE cannot find the chart', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1' },
    } as never);
    mockGetChartRepository.mockReturnValue({
      softDeleteOwned: jest
        .fn()
        .mockResolvedValue({ success: false, error: 'NOT_FOUND' }),
    } as never);

    const request = new NextRequest('http://localhost/api/charts/chart-1', {
      method: 'DELETE',
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: 'chart-1' }),
    });

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: 'Chart not found',
    });
  });
});
