import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth/auth-options';
import { validateCsrf } from '@/lib/api/csrf';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/api/rate-limit';
import { getChartRepository } from '@/lib/db/chart-repository-prisma';
import { chartConfigSchema } from '@/types/chart-config';

const updateChartSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(1000).optional(),
  config: chartConfigSchema.optional(),
  datasetIds: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/charts/[id] - Get a single chart by ID
 * Public for PUBLISHED charts, owner only for DRAFTs
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  // Check rate limit
  const rateLimitError = checkRateLimit(_request, RATE_LIMIT_CONFIGS.readOnly);
  if (rateLimitError) return rateLimitError;

  try {
    const repository = getChartRepository();
    const { id } = await params;
    const chart = await repository.getById(id);

    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }

    // Increment views for published charts (fire and forget)
    if (chart.status === 'PUBLISHED') {
      repository.incrementViews(id).catch(() => {});
    }

    // For drafts, check ownership
    if (chart.status !== 'PUBLISHED') {
      const session = await getServerSession(authOptions);
      const sessionUserId = (session?.user as { id?: string })?.id;
      if (!sessionUserId || chart.userId !== sessionUserId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    return NextResponse.json(chart);
  } catch (error) {
    console.error('Error fetching chart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/charts/[id] - Update a chart (owner only)
 * Uses repository with atomic ownership check
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  // Check rate limit
  const rateLimitError = checkRateLimit(request, RATE_LIMIT_CONFIGS.api);
  if (rateLimitError) return rateLimitError;

  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session?.user as { id?: string })?.id;
    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parseResult = updateChartSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, config, datasetIds, thumbnail } =
      parseResult.data;

    const repository = getChartRepository();
    const result = await repository.updateOwned(id, sessionUserId, {
      title,
      description,
      config,
      datasetIds,
      thumbnail,
    });

    if (!result.success) {
      if (result.error === 'NOT_FOUND') {
        return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
      }
      if (result.error === 'FORBIDDEN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
        { error: 'Failed to update chart' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error updating chart:', error);
    return NextResponse.json(
      { error: 'Failed to update chart' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/charts/[id] - Delete a chart (owner only)
 * Uses repository with atomic ownership check
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  // Check rate limit
  const rateLimitError = checkRateLimit(request, RATE_LIMIT_CONFIGS.api);
  if (rateLimitError) return rateLimitError;

  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session?.user as { id?: string })?.id;
    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const repository = getChartRepository();
    const result = await repository.softDeleteOwned(id, sessionUserId);

    if (!result.success) {
      if (result.error === 'NOT_FOUND') {
        return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
      }
      if (result.error === 'FORBIDDEN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
        { error: 'Failed to delete chart' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chart:', error);
    return NextResponse.json(
      { error: 'Failed to delete chart' },
      { status: 500 }
    );
  }
}
