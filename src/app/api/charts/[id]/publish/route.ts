import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { validateCsrf } from '@/lib/api/csrf';
import { getChartRepository } from '@/lib/db/chart-repository-prisma';
import {
  emptyStaticParams,
  isStaticExportBuild,
  staticExportApiUnavailable,
} from '@/lib/next/static-export';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return emptyStaticParams();
}

/**
 * POST /api/charts/[id]/publish - Publish a draft chart (owner only)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  if (isStaticExportBuild) {
    return staticExportApiUnavailable();
  }

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    const sessionUserId = (session?.user as { id?: string })?.id;
    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const repository = getChartRepository();

    const result = await repository.publishOwned(id, sessionUserId);

    if (!result.success) {
      if (result.error === 'NOT_FOUND') {
        return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
      }
      if (result.error === 'FORBIDDEN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
        { error: 'Failed to publish chart' },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error publishing chart:', error);
    return NextResponse.json(
      { error: 'Failed to publish chart' },
      { status: 500 }
    );
  }
}
