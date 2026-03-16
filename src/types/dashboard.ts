import type {
  DashboardLayoutItem as DashboardLayoutItemType,
  DashboardConfig as DashboardConfigBase,
  DashboardTemplate as DashboardTemplateType,
  SharedFilterConfig as SharedFilterConfigType,
} from '@vizualni/charts'

import {
  generateDashboardId as generateDashboardIdBase,
  createEmptyDashboard as createEmptyDashboardBase,
  createDashboardFromTemplate as createDashboardFromTemplateBase,
  MAX_CHARTS,
  canAddChart,
} from '@vizualni/charts'

import type { ChartConfig } from '@/types'

// Re-export types from @vizualni/charts
export type {
  DashboardLayoutItemType as DashboardLayoutItem,
  DashboardTemplateType as DashboardTemplate,
  SharedFilterConfigType as SharedFilterConfig,
}

// DashboardConfig with proper ChartConfig type
export type DashboardConfig = DashboardConfigBase<ChartConfig>

// Typed wrapper functions
export const generateDashboardId = generateDashboardIdBase
export const createEmptyDashboard = (title?: string): DashboardConfig =>
  createEmptyDashboardBase<ChartConfig>(title)
export const createDashboardFromTemplate = (template: DashboardTemplateType, title?: string): DashboardConfig =>
  createDashboardFromTemplateBase<ChartConfig>(template, title)

export { MAX_CHARTS, canAddChart }

// Re-export constants
export { DASHBOARD_TEMPLATES } from './dashboard-templates'

// Type alias for backward compatibility
export type LayoutItem = DashboardLayoutItemType
