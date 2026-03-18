/**
 * @file plugin.ts
 * @description Core plugin system types
 */

export interface BasePlugin {
  metadata: PluginMetadata;
  register(registry: PluginRegistry): void | Promise<void>;
  initialize?(config?: any): Promise<void>;
  dispose?(): void | Promise<void>;
}

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  author: PluginAuthor;
  category: PluginCategory;
  tags: string[];
  license: string;
  minCoreVersion: string;
}

export type PluginCategory =
  | 'chart'
  | 'connector'
  | 'transform'
  | 'theme'
  | 'widget';

export interface PluginAuthor {
  name: string;
  email?: string;
  url?: string;
}

export interface PluginRegistry {
  registerChartType(config: ChartPluginConfig): void;
  registerConnector(config: ConnectorPluginConfig): void;
  getChartType(type: string): ChartPluginConfig | undefined;
  getAllCharts(): ChartPluginConfig[];
}

export interface ChartPluginConfig {
  type: string;
  name: string;
  component: any;
  configSchema: any;
  icon: any;
}

export interface ConnectorPluginConfig {
  id: string;
  name: string;
  type: 'rest' | 'graphql' | 'database' | 'file';
  component: any;
  configSchema: any;
  client: any;
}

export interface TransformPluginConfig {
  id: string;
  name: string;
  transform: (data: any[], config: any) => any[];
}
