/**
 * @vizualni/charts - React-specific types
 *
 * Types that depend on React. Separated from the domain layer
 * to keep domain logic framework-agnostic.
 */

import type { ComponentType, LazyExoticComponent, ReactNode } from 'react';

import type {
  ChartCapabilities,
  ChartConfig,
  ChartRendererDataRow,
  SupportedChartType,
} from './domain/chart-config';

export interface ChartRendererProps {
  config: ChartConfig;
  data: ChartRendererDataRow[];
  height?: number;
  locale?: string;
  filterBar?: ReactNode;
  showInternalLegend?: boolean;
  hiddenSeriesKeys?: string[];
  previewMode?: boolean;
}

export type ChartRendererComponentProps = ChartRendererProps;

export interface ChartTypeDefinition {
  type: SupportedChartType;
  label: string;
  icon: string;
  renderer:
    | ComponentType<ChartRendererComponentProps>
    | LazyExoticComponent<ComponentType<ChartRendererComponentProps>>;
  defaultConfig: Partial<ChartConfig>;
  capabilities: ChartCapabilities;
}
