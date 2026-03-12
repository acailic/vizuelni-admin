import { NextResponse } from 'next/server'
import { ChartStatus } from '@/types/persistence'
import prisma from '@/lib/db/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')

    const validSortBy = ['createdAt', 'views', 'updatedAt'].includes(sortBy) ? sortBy : 'createdAt'
    const validSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc'

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
