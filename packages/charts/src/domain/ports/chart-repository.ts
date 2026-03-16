/**
 * @vizualni/charts - Chart Repository Port
 *
 * Defines the repository interface for chart persistence.
 * This is the "port" in ports-and-adapters architecture.
 * The domain layer defines this interface; the infrastructure layer implements it.
 */

import type { ChartConfig } from '../chart-config'

/**
 * Chart publication status
 */
export enum ChartStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

/**
 * Chart metadata (without full config) for list views
 */
export interface SavedChartMeta {
  id: string
  title: string
  description?: string | null
  chartType: string
  status: ChartStatus
  views: number
  thumbnail?: string | null
  userId?: string | null
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date | null
}

/**
 * Full saved chart with config
 */
export interface SavedChart extends SavedChartMeta {
  config: ChartConfig
  datasetIds: string[]
  thumbnail?: string | null
}

/**
 * Input for creating a new chart
 */
export interface CreateChartInput {
  title: string
  description?: string
  config: ChartConfig
  datasetIds: string[]
  thumbnail?: string
  chartType: string
  userId?: string
}

/**
 * Input for updating an existing chart
 */
export interface UpdateChartInput {
  title?: string
  description?: string
  config?: ChartConfig
  datasetIds?: string[]
  thumbnail?: string
  chartType?: string
}

/**
 * Filters for listing charts
 */
export interface ChartListFilters {
  status?: ChartStatus
  userId?: string
  chartType?: string
}

/**
 * Pagination parameters for listing charts
 */
export interface ChartListPagination {
  page: number
  pageSize: number
  sortBy: 'createdAt' | 'views' | 'updatedAt'
  sortOrder: 'asc' | 'desc'
}

/**
 * Paginated result of chart metadata
 */
export interface ChartListResult {
  charts: SavedChartMeta[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Repository operation result
 */
export type RepositoryResult<T> =
  | { success: true; data: T }
  | { success: false; error: 'NOT_FOUND' | 'FORBIDDEN' | 'INTERNAL_ERROR'; message?: string }

/**
 * Chart Repository Interface (Port)
 *
 * Defines the contract for chart persistence operations.
 * Implementation should handle:
 * - Atomic ownership checks for update/delete operations
 * - Soft deletes (status changes to ARCHIVED)
 * - View counting with race condition prevention
 */
export interface ChartRepository {
  /**
   * Create a new chart
   */
  create(input: CreateChartInput): Promise<SavedChart>

  /**
   * Get a chart by ID
   * Returns null if not found
   */
  getById(id: string): Promise<SavedChart | null>

  /**
   * List charts with filters and pagination
   */
  list(filters: ChartListFilters, pagination: ChartListPagination): Promise<ChartListResult>

  /**
   * Update a chart (no ownership check)
   * Returns null if not found
   */
  update(id: string, input: UpdateChartInput): Promise<SavedChart | null>

  /**
   * Update a chart with atomic ownership check
   * Returns result with NOT_FOUND or FORBIDDEN error
   */
  updateOwned(id: string, userId: string, input: UpdateChartInput): Promise<RepositoryResult<SavedChart>>

  /**
   * Soft delete a chart (no ownership check)
   * Returns false if not found
   */
  softDelete(id: string): Promise<boolean>

  /**
   * Soft delete a chart with atomic ownership check
   * Returns result with NOT_FOUND or FORBIDDEN error
   */
  softDeleteOwned(id: string, userId: string): Promise<RepositoryResult<void>>

  /**
   * Publish a chart (set status to PUBLISHED)
   * Returns null if not found
   */
  publish(id: string): Promise<SavedChart | null>

  /**
   * Publish a chart with ownership check
   * Returns result with NOT_FOUND or FORBIDDEN error
   */
  publishOwned(id: string, userId: string): Promise<RepositoryResult<SavedChart>>

  /**
   * Increment view counter (fire-and-forget)
   * Should use atomic SQL update to prevent race conditions
   */
  incrementViews(id: string): Promise<void>
}
