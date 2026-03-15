import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth/auth-options';
import { validateCsrf } from '@/lib/api/csrf';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/api/rate-limit';
import { getChartById, incrementViews } from '@/lib/db/charts';
import { chartConfigSchema } from '@/types/chart-config';
import prisma from '@/lib/db/prisma';

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
    const { id } = await params;
    const chart = await getChartById(id);

    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }

    // Increment views for published charts (fire and forget)
    if (chart.status === 'PUBLISHED') {
      incrementViews(id).catch(() => {});
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
 * Uses atomic operation to prevent TOCTOU race condition
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

    // Build update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (config !== undefined) {
      updateData.config = JSON.stringify(config);
      updateData.chartType = config.type;
    }
    if (datasetIds !== undefined)
      updateData.datasetIds = JSON.stringify(datasetIds);
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;

    // Use atomic updateMany with userId in WHERE clause to prevent race condition
    const result = await prisma.savedChart.updateMany({
      where: {
        id,
        userId: sessionUserId, // Atomic ownership check
      },
      data: updateData,
    });

    if (result.count === 0) {
      // Either chart doesn't exist or user doesn't own it
      // Check if chart exists to return appropriate error
      const chartExists = await prisma.savedChart.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!chartExists) {
        return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
      }

      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch and return the updated chart
    const updatedChart = await getChartById(id);
    return NextResponse.json(updatedChart);
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
 * Uses atomic operation to prevent TOCTOU race condition
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

    // Use atomic updateMany with userId in WHERE clause
    // Soft delete by setting status to ARCHIVED
    const result = await prisma.savedChart.updateMany({
      where: {
        id,
        userId: sessionUserId, // Atomic ownership check
      },
      data: {
        status: 'ARCHIVED',
      },
    });

    if (result.count === 0) {
      // Check if chart exists
      const chartExists = await prisma.savedChart.findUnique({
        where: { id },
        select: { id: true, userId: true },
      });

      if (!chartExists) {
        return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
      }

      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
