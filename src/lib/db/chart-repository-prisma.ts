/**
 * Prisma implementation of ChartRepository
 *
 * This is the "adapter" in ports-and-adapters architecture.
 * Implements the ChartRepository interface defined in @vizualni/charts.
 *
 * Key features:
 * - Atomic ownership checks using Prisma's updateMany
 * - Soft deletes (status changes to ARCHIVED)
 * - Race condition prevention for view counting
 */

import type { ChartConfig } from '@/types/chart-config'
import type {
  ChartRepository,
  SavedChart,
  SavedChartMeta,
  CreateChartInput,
  UpdateChartInput,
  ChartListFilters,
  ChartListPagination,
  ChartListResult,
  RepositoryResult,
} from '@vizualni/charts'
import { ChartStatus } from '@vizualni/charts'
import prisma from './prisma'

/**
 * Prisma implementation of ChartRepository
 */
export class PrismaChartRepository implements ChartRepository {
  async create(input: CreateChartInput): Promise<SavedChart> {
    const chart = await prisma.savedChart.create({
      data: {
        title: input.title,
        description: input.description ?? null,
        config: JSON.stringify(input.config),
        datasetIds: JSON.stringify(input.datasetIds),
        thumbnail: input.thumbnail ?? null,
        chartType: input.chartType,
        userId: input.userId ?? null,
        status: ChartStatus.DRAFT,
      },
    })

    return this.toSavedChart(chart)
  }

  async getById(id: string): Promise<SavedChart | null> {
    const chart = await prisma.savedChart.findUnique({
      where: { id },
    })

    if (!chart) return null
    return this.toSavedChart(chart)
  }

  async list(
    filters: ChartListFilters = {},
    pagination: ChartListPagination = {
      page: 1,
      pageSize: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }
  ): Promise<ChartListResult> {
    const where = {
      ...(filters.status
        ? { status: filters.status }
        : { status: { not: ChartStatus.ARCHIVED } }),
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.chartType && { chartType: filters.chartType }),
    }

    const [charts, total] = await Promise.all([
      prisma.savedChart.findMany({
        where,
        orderBy: { [pagination.sortBy]: pagination.sortOrder },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
      }),
      prisma.savedChart.count({ where }),
    ])

    return {
      charts: charts.map(this.toSavedChartMeta),
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    }
  }

  async update(id: string, input: UpdateChartInput): Promise<SavedChart | null> {
    try {
      const chart = await prisma.savedChart.update({
        where: { id },
        data: this.buildUpdateData(input),
      })
      return this.toSavedChart(chart)
    } catch {
      return null
    }
  }

  async updateOwned(
    id: string,
    userId: string,
    input: UpdateChartInput
  ): Promise<RepositoryResult<SavedChart>> {
    // Use atomic updateMany with userId in WHERE clause to prevent race condition
    const result = await prisma.savedChart.updateMany({
      where: {
        id,
        userId, // Atomic ownership check
      },
      data: this.buildUpdateData(input),
    })

    if (result.count === 0) {
      // Either chart doesn't exist or user doesn't own it
      const chartExists = await prisma.savedChart.findUnique({
        where: { id },
        select: { id: true, userId: true },
      })

      if (!chartExists) {
        return { success: false, error: 'NOT_FOUND' }
      }

      return { success: false, error: 'FORBIDDEN' }
    }

    // Fetch and return the updated chart
    const updatedChart = await this.getById(id)
    if (!updatedChart) {
      return { success: false, error: 'NOT_FOUND' }
    }

    return { success: true, data: updatedChart }
  }

  async softDelete(id: string): Promise<boolean> {
    try {
      await prisma.savedChart.update({
        where: { id },
        data: { status: ChartStatus.ARCHIVED },
      })
      return true
    } catch {
      return false
    }
  }

  async softDeleteOwned(id: string, userId: string): Promise<RepositoryResult<void>> {
    // Use atomic updateMany with userId in WHERE clause
    const result = await prisma.savedChart.updateMany({
      where: {
        id,
        userId, // Atomic ownership check
      },
      data: {
        status: ChartStatus.ARCHIVED,
      },
    })

    if (result.count === 0) {
      const chartExists = await prisma.savedChart.findUnique({
        where: { id },
        select: { id: true, userId: true },
      })

      if (!chartExists) {
        return { success: false, error: 'NOT_FOUND' }
      }

      return { success: false, error: 'FORBIDDEN' }
    }

    return { success: true, data: undefined }
  }

  async publish(id: string): Promise<SavedChart | null> {
    try {
      const chart = await prisma.savedChart.update({
        where: { id },
        data: {
          status: ChartStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      })
      return this.toSavedChart(chart)
    } catch {
      return null
    }
  }

  async publishOwned(id: string, userId: string): Promise<RepositoryResult<SavedChart>> {
    // Use atomic updateMany with userId in WHERE clause
    const result = await prisma.savedChart.updateMany({
      where: {
        id,
        userId, // Atomic ownership check
      },
      data: {
        status: ChartStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    })

    if (result.count === 0) {
      const chartExists = await prisma.savedChart.findUnique({
        where: { id },
        select: { id: true, userId: true },
      })

      if (!chartExists) {
        return { success: false, error: 'NOT_FOUND' }
      }

      return { success: false, error: 'FORBIDDEN' }
    }

    const publishedChart = await this.getById(id)
    if (!publishedChart) {
      return { success: false, error: 'NOT_FOUND' }
    }

    return { success: true, data: publishedChart }
  }

  async incrementViews(id: string): Promise<void> {
    try {
      // Use raw SQL for atomic increment (SQLite-safe)
      await prisma.$executeRaw`
        UPDATE charts
        SET views = views + 1
        WHERE id = ${id}
      `
    } catch (error) {
      // Log but don't throw - view counting should not affect user experience
      console.error('Failed to increment view count:', error)
    }
  }

  // Private helper methods

  private buildUpdateData(input: UpdateChartInput): Record<string, unknown> {
    const data: Record<string, unknown> = {}

    if (input.title !== undefined) data.title = input.title
    if (input.description !== undefined) data.description = input.description
    if (input.config !== undefined) {
      data.config = JSON.stringify(input.config)
      data.chartType = input.config.type
    }
    if (input.datasetIds !== undefined) data.datasetIds = JSON.stringify(input.datasetIds)
    if (input.thumbnail !== undefined) data.thumbnail = input.thumbnail
    if (input.chartType !== undefined) data.chartType = input.chartType

    return data
  }

  private toSavedChart(chart: {
    id: string
    title: string
    description: string | null
    config: string
    datasetIds: string
    thumbnail: string | null
    chartType: string
    status: string
    views: number
    userId: string | null
    createdAt: Date
    updatedAt: Date
    publishedAt: Date | null
  }): SavedChart {
    return {
      id: chart.id,
      title: chart.title,
      description: chart.description,
      config: JSON.parse(chart.config) as ChartConfig,
      datasetIds: JSON.parse(chart.datasetIds) as string[],
      thumbnail: chart.thumbnail,
      chartType: chart.chartType,
      status: chart.status as ChartStatus,
      views: chart.views,
      userId: chart.userId,
      createdAt: chart.createdAt,
      updatedAt: chart.updatedAt,
      publishedAt: chart.publishedAt,
    }
  }

  private toSavedChartMeta(chart: {
    id: string
    title: string
    description: string | null
    chartType: string
    status: string
    views: number
    thumbnail: string | null
    userId: string | null
    createdAt: Date
    updatedAt: Date
    publishedAt: Date | null
  }): SavedChartMeta {
    return {
      id: chart.id,
      title: chart.title,
      description: chart.description,
      chartType: chart.chartType,
      status: chart.status as ChartStatus,
      views: chart.views,
      thumbnail: chart.thumbnail,
      userId: chart.userId,
      createdAt: chart.createdAt,
      updatedAt: chart.updatedAt,
      publishedAt: chart.publishedAt,
    }
  }
}

/**
 * Factory function to get the chart repository instance
 * Uses module-level singleton pattern (no DI container needed)
 */
let repositoryInstance: ChartRepository | null = null

export function getChartRepository(): ChartRepository {
  if (!repositoryInstance) {
    repositoryInstance = new PrismaChartRepository()
  }
  return repositoryInstance
}

/**
 * For testing: inject a mock repository
 */
export function setChartRepository(repository: ChartRepository | null): void {
  repositoryInstance = repository
}
