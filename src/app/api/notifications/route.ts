import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { authOptions } from '@/lib/auth/auth-options';
import { validateCsrf } from '@/lib/api/csrf';

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session?.user as { id?: string } | undefined)?.id;

    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const notifications = await prisma.notification.findMany({
      where: { userId: sessionUserId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: sessionUserId, read: false },
    });

    return NextResponse.json({ notifications, unreadCount });
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
  actionUrl: z.string().url().optional(),
});

// POST /api/notifications - Create a notification (admin only)
export async function POST(request: NextRequest) {
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  try {
    const session = await getServerSession(authOptions);
    const sessionUserId = (session?.user as { id?: string } | undefined)?.id;

    if (!sessionUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        actionUrl,
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
