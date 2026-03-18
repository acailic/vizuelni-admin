/**
 * @file PluginLoader.ts
 * @description Dynamic plugin loading
 */

import type { BasePlugin, PluginMetadata } from './types/plugin';
import { pluginRegistry } from './PluginRegistry';

export class PluginLoader {
  private loadedPlugins: Map<string, BasePlugin> = new Map();

  async loadPlugin(source: string): Promise<BasePlugin> {
    try {
      const module = await import(source);
      const PluginClass = module.default;
      const plugin: BasePlugin = new PluginClass();

      this.validateMetadata(plugin.metadata);
      await plugin.register(pluginRegistry);

      if (plugin.initialize) {
        await plugin.initialize();
      }

      this.loadedPlugins.set(plugin.metadata.id, plugin);
      console.log(`[PluginLoader] Loaded: ${plugin.metadata.name}`);

      return plugin;
    } catch (error) {
      console.error(`[PluginLoader] Failed to load from ${source}:`, error);
      throw error;
    }
  }

  async unloadPlugin(pluginId: string): Promise<void> {
    const plugin = this.loadedPlugins.get(pluginId);
    if (plugin) {
      if (plugin.dispose) await plugin.dispose();
      this.loadedPlugins.delete(pluginId);
      console.log(`[PluginLoader] Unloaded: ${pluginId}`);
    }
  }

  getLoadedPlugins(): BasePlugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  private validateMetadata(metadata: PluginMetadata): void {
    if (!metadata.id) throw new Error('Plugin missing id');
    if (!metadata.name) throw new Error('Plugin missing name');
    if (!metadata.version) throw new Error('Plugin missing version');
  }
}

export const pluginLoader = new PluginLoader();
