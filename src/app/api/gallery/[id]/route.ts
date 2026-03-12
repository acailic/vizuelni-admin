import { NextRequest, NextResponse } from 'next/server'
import { ChartStatus } from '@/types/persistence'
import prisma from '@/lib/db/prisma'
import { incrementViews } from '@/lib/db/charts'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const chart = await prisma.savedChart.findFirst({
      where: {
        id,
        status: ChartStatus.PUBLISHED,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 })
    }

    // Increment view count (fire and forget)
    incrementViews(id).catch((err) => console.error('Failed to increment views:', err))

    return NextResponse.json({
      id: chart.id,
      title: chart.title,
      description: chart.description,
      config: JSON.parse(chart.config),
      datasetIds: JSON.parse(chart.datasetIds),
      chartType: chart.chartType,
      views: chart.views + 1, // Return incremented view count
      thumbnail: chart.thumbnail,
      createdAt: chart.createdAt.toISOString(),
      updatedAt: chart.updatedAt.toISOString(),
      publishedAt: chart.publishedAt?.toISOString() || null,
      author: chart.user
        ? {
            name: chart.user.name,
            image: chart.user.image,
          }
        : null,
    })
  } catch (error) {
    console.error('Gallery chart detail API error:', error)
    return NextResponse.json({ error: 'Failed to fetch chart' }, { status: 500 })
  }
}
