import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { ChartStatus } from '@/types/persistence';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/api/rate-limit';

const galleryQuerySchema = z.object({
  sortBy: z.enum(['createdAt', 'views', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

export async function GET(request: Request) {
  // Check rate limit
  const rateLimitError = checkRateLimit(
    request as any,
    RATE_LIMIT_CONFIGS.readOnly
  );
  if (rateLimitError) return rateLimitError;

  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session?.user;

    const { searchParams } = new URL(request.url);
    const queryResult = galleryQuerySchema.safeParse(
      Object.fromEntries(searchParams)
    );

    if (!queryResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: queryResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      sortBy: validSortBy,
      sortOrder: validSortOrder,
      page,
      pageSize,
    } = queryResult.data;

    const [charts, total] = await Promise.all([
      prisma.savedChart.findMany({
        where: {
          status: ChartStatus.PUBLISHED,
        },
        orderBy: {
          [validSortBy]: validSortOrder,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        // Only include user data if authenticated
        ...(isAuthenticated && {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        }),
      }),
      prisma.savedChart.count({
        where: {
          status: ChartStatus.PUBLISHED,
        },
      }),
    ]);

    // Format response based on authentication status
    const formattedCharts = charts.map((chart) => {
      const baseChart = {
        id: chart.id,
        title: chart.title,
        description: chart.description,
        chartType: chart.chartType,
        views: chart.views,
        thumbnail: chart.thumbnail,
        createdAt: chart.createdAt.toISOString(),
      };

      // Only include author info if authenticated
      if (isAuthenticated && 'user' in chart && chart.user) {
        const user = chart.user as {
          name: string | null;
          image: string | null;
        };
        return {
          ...baseChart,
          author: {
            name: user.name,
            image: user.image,
          },
        };
      }

      return baseChart;
    });

    return NextResponse.json({
      charts: formattedCharts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Gallery API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery charts' },
      { status: 500 }
    );
  }
}
