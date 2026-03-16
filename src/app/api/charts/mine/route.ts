import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { getChartRepository } from '@/lib/db/chart-repository-prisma';
import {
  isStaticExportBuild,
  staticExportApiUnavailable,
} from '@/lib/next/static-export';

/**
 * GET /api/charts/mine
 * Fetch the current user's charts
 */
export async function GET(_request: NextRequest) {
  if (isStaticExportBuild) {
    return staticExportApiUnavailable();
  }

  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session?.user as { id?: string })?.id;

    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const repository = getChartRepository();
    const result = await repository.list(
      { userId: sessionUserId },
      { page: 1, pageSize: 100, sortBy: 'updatedAt', sortOrder: 'desc' }
    );

    return NextResponse.json({ charts: result.charts });
  } catch (error) {
    console.error('Error fetching user charts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch charts' },
      { status: 500 }
    );
  }
}
