/**
 * Dashboard templates for creating new dashboards
 */

import type { DashboardTemplate, DashboardLayoutItem } from '@vizualni/charts'

/**
 * Single chart - full width layout
 */
const singleLayout: DashboardLayoutItem[] = [
  { chartId: 'chart-1', x: 0, y: 0, w: 12, h: 4, minW: 6, minH: 2 },
]

/**
 * Side by side - two charts next to each other
 */
const sideBySideLayout: DashboardLayoutItem[] = [
  { chartId: 'chart-1', x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 2 },
  { chartId: 'chart-2', x: 6, y: 0, w: 6, h: 4, minW: 4, minH: 2 },
]

/**
 * 2x2 grid - four charts in a grid
 */
const grid2x2Layout: DashboardLayoutItem[] = [
  { chartId: 'chart-1', x: 0, y: 0, w: 6, h: 2, minW: 4, minH: 2 },
  { chartId: 'chart-2', x: 6, y: 0, w: 6, h: 2, minW: 4, minH: 2 },
  { chartId: 'chart-3', x: 0, y: 2, w: 6, h: 2, minW: 4, minH: 2 },
  { chartId: 'chart-4', x: 6, y: 2, w: 6, h: 2, minW: 4, minH: 2 },
]

/**
 * Hero plus two - one large chart on top, two smaller below
 */
const heroPlusTwoLayout: DashboardLayoutItem[] = [
  { chartId: 'chart-1', x: 0, y: 0, w: 12, h: 3, minW: 8, minH: 2 },
  { chartId: 'chart-2', x: 0, y: 3, w: 6, h: 2, minW: 4, minH: 2 },
  { chartId: 'chart-3', x: 6, y: 3, w: 6, h: 2, minW: 4, minH: 2 },
]

/**
 * Available dashboard templates
 */
export const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
  {
    id: 'single',
    name: 'Single Chart',
    nameKey: 'dashboard.templates.single',
    description: 'One full-width chart for focused data presentation',
    descriptionKey: 'dashboard.templates.singleDescription',
    layout: singleLayout,
    chartPlaceholders: [{ chartId: 'chart-1', suggestedType: 'bar', label: 'Main Chart' }],
  },
  {
    id: 'side-by-side',
    name: 'Side by Side',
    nameKey: 'dashboard.templates.sideBySide',
    description: 'Two charts side by side for comparison',
    descriptionKey: 'dashboard.templates.sideBySideDescription',
    layout: sideBySideLayout,
    chartPlaceholders: [
      { chartId: 'chart-1', suggestedType: 'bar', label: 'Left Chart' },
      { chartId: 'chart-2', suggestedType: 'line', label: 'Right Chart' },
    ],
  },
  {
    id: '2x2-grid',
    name: '2x2 Grid',
    nameKey: 'dashboard.templates.grid',
    description: 'Four charts in a balanced grid layout',
    descriptionKey: 'dashboard.templates.gridDescription',
    layout: grid2x2Layout,
    chartPlaceholders: [
      { chartId: 'chart-1', suggestedType: 'bar', label: 'Top Left' },
      { chartId: 'chart-2', suggestedType: 'line', label: 'Top Right' },
      { chartId: 'chart-3', suggestedType: 'pie', label: 'Bottom Left' },
      { chartId: 'chart-4', suggestedType: 'area', label: 'Bottom Right' },
    ],
  },
  {
    id: 'hero-plus-two',
    name: 'Hero + Two',
    nameKey: 'dashboard.templates.heroPlusTwo',
    description: 'One prominent chart with two supporting charts below',
    descriptionKey: 'dashboard.templates.heroPlusTwoDescription',
    layout: heroPlusTwoLayout,
    chartPlaceholders: [
      { chartId: 'chart-1', suggestedType: 'line', label: 'Hero Chart' },
      { chartId: 'chart-2', suggestedType: 'bar', label: 'Supporting Left' },
      { chartId: 'chart-3', suggestedType: 'pie', label: 'Supporting Right' },
    ],
  },
]
