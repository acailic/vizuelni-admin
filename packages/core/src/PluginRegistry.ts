/**
 * @file PluginRegistry.ts
 * @description Plugin registry implementation
 */

import type {
  PluginRegistry as IPluginRegistry,
  ChartPluginConfig,
  ConnectorPluginConfig,
  TransformPluginConfig,
} from './types/plugin';

export class PluginRegistryImpl implements IPluginRegistry {
  private charts: Map<string, ChartPluginConfig> = new Map();
  private connectors: Map<string, ConnectorPluginConfig> = new Map();
  private transforms: Map<string, TransformPluginConfig> = new Map();

  registerChartType(config: ChartPluginConfig): void {
    this.charts.set(config.type, config);
    console.log(`[PluginRegistry] Registered chart: ${config.type}`);
  }

  registerConnector(config: ConnectorPluginConfig): void {
    this.connectors.set(config.id, config);
    console.log(`[PluginRegistry] Registered connector: ${config.id}`);
  }

  registerTransform(config: TransformPluginConfig): void {
    this.transforms.set(config.id, config);
    console.log(`[PluginRegistry] Registered transform: ${config.id}`);
  }

  getChartType(type: string): ChartPluginConfig | undefined {
    return this.charts.get(type);
  }

  getAllCharts(): ChartPluginConfig[] {
    return Array.from(this.charts.values());
  }

  getConnector(id: string): ConnectorPluginConfig | undefined {
    return this.connectors.get(id);
  }

  getTransform(id: string): TransformPluginConfig | undefined {
    return this.transforms.get(id);
  }
}

export const pluginRegistry = new PluginRegistryImpl();
