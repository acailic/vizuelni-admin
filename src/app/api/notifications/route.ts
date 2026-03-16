import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth/auth-options';
import { validateCsrf } from '@/lib/api/csrf';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/api/rate-limit';
import {
  isStaticExportBuild,
  staticExportApiUnavailable,
} from '@/lib/next/static-export';

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  if (isStaticExportBuild) {
    return staticExportApiUnavailable();
  }

  // Check rate limit
  const rateLimitError = checkRateLimit(request, RATE_LIMIT_CONFIGS.readOnly);
  if (rateLimitError) return rateLimitError;

  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session?.user as { id?: string } | undefined)?.id;

    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Cap at 100
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0); // Ensure non-negative

    const [notifications, unreadCount, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: sessionUserId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({
        where: { userId: sessionUserId, read: false },
      }),
      prisma.notification.count({
        where: { userId: sessionUserId },
      }),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
      totalCount,
      hasMore: offset + notifications.length < totalCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

const createNotificationSchema = z.object({
  userId: z.string().trim().min(1),
  type: z.enum(['dataset_update', 'chart_saved', 'announcement', 'export']),
  title: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(2000),
  actionUrl: z.string().url().optional().or(z.literal('')),
});

// POST /api/notifications - Create a notification (admin only)
export async function POST(request: NextRequest) {
  if (isStaticExportBuild) {
    return staticExportApiUnavailable();
  }

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  // Check rate limit (strict for admin operations)
  const rateLimitError = checkRateLimit(request, RATE_LIMIT_CONFIGS.auth);
  if (rateLimitError) return rateLimitError;

  try {
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as
      | { id?: string; role?: string }
      | undefined;

    if (!sessionUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check role from session (no database query needed)
    if (sessionUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parseResult = createNotificationSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, type, title, message, actionUrl } = parseResult.data;

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user not found' },
        { status: 404 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        actionUrl: actionUrl || undefined,
      },
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
