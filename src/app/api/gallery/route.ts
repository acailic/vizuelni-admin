import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ChartStatus } from '@/types/persistence'
import prisma from '@/lib/db/prisma'

const galleryQuerySchema = z.object({
  sortBy: z.enum(['createdAt', 'views', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const queryResult = galleryQuerySchema.safeParse(Object.fromEntries(searchParams))

    if (!queryResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryResult.error.flatten() },
        { status: 400 }
      )
    }

    const { sortBy: validSortBy, sortOrder: validSortOrder, page, pageSize } = queryResult.data

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
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.savedChart.count({
        where: {
          status: ChartStatus.PUBLISHED,
        },
      }),
    ])

    const formattedCharts = charts.map((chart) => ({
      id: chart.id,
      title: chart.title,
      description: chart.description,
      chartType: chart.chartType,
      views: chart.views,
      thumbnail: chart.thumbnail,
      createdAt: chart.createdAt.toISOString(),
      author: chart.user
        ? {
            name: chart.user.name,
            image: chart.user.image,
          }
        : null,
    }))

    return NextResponse.json({
      charts: formattedCharts,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    console.error('Gallery API error:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery charts' }, { status: 500 })
  }
}
