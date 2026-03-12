/**
 * Chart Registry Tests
 *
 * Tests for the chart plugin system registry functionality.
 *
 * @packageDocumentation
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  chartRegistry,
  registerChartPlugin,
  unregisterChartPlugin,
  getChartPlugin,
  listChartPlugins,
  hasChartPlugin,
  clearChartPlugins,
  getChartPluginStats,
} from "../../exports/charts/chart-registry";

import type { IChartPlugin, BaseChartConfig } from "../../exports/charts";

// Mock chart component for testing
const MockChartComponent = () => null;

// Create a valid test plugin
const createTestPlugin = (
  id: string,
  category: string = "test"
): IChartPlugin<BaseChartConfig> => ({
  id,
  name: `Test Plugin ${id}`,
  version: "1.0.0",
  author: "Test Author",
  description: `A test plugin for ${id}`,
  category,
  tags: ["test", "mock"],
  license: "MIT",
  minCoreVersion: "0.1.0-beta.1",
  component: MockChartComponent,
  defaultConfig: {
    xAxis: "x",
    yAxis: "y",
  },
});

// Invalid plugin for validation tests
const invalidPlugin = {
  id: "INVALID-ID", // Invalid: uppercase and special chars
  name: "",
  version: "",
  author: "",
  description: "",
  category: "",
  tags: [],
  license: "",
  minCoreVersion: "",
  component: MockChartComponent,
};

describe("Chart Registry", () => {
  beforeEach(() => {
    // Clear all external plugins before each test
    clearChartPlugins();
  });

  describe("registerChartPlugin", () => {
    it("should register a valid plugin successfully", () => {
      const plugin = createTestPlugin("test-plugin-1");
      const result = registerChartPlugin(plugin);

      expect(result.success).toBe(true);
      expect(result.pluginId).toBe("test-plugin-1");
      expect(result.error).toBeUndefined();
    });

    it("should reject a plugin with invalid metadata", () => {
      // @ts-ignore - testing invalid plugin
      const result = registerChartPlugin(invalidPlugin);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain("Plugin validation failed");
    });

    it("should reject duplicate plugin IDs", () => {
      const plugin1 = createTestPlugin("duplicate-plugin");
      const plugin2 = createTestPlugin("duplicate-plugin");

      registerChartPlugin(plugin1);
      const result = registerChartPlugin(plugin2);

      expect(result.success).toBe(false);
      expect(result.error).toContain("already registered");
    });

    it("should allow overriding existing plugins with override option", () => {
      const plugin1 = createTestPlugin("override-plugin");
      const plugin2 = createTestPlugin("override-plugin");

      registerChartPlugin(plugin1);
      const result = registerChartPlugin(plugin2, { override: true });

      expect(result.success).toBe(true);
      expect(result.pluginId).toBe("override-plugin");
    });

    it("should call onRegister hook when provided", () => {
      const onRegister = vi.fn();
      const plugin = createTestPlugin("hook-plugin");
      plugin.hooks = { onRegister };

      registerChartPlugin(plugin);

      expect(onRegister).toHaveBeenCalled();
    });
  });

  describe("getChartPlugin", () => {
    it("should retrieve a registered plugin by ID", () => {
      const plugin = createTestPlugin("get-plugin");
      registerChartPlugin(plugin);

      const retrieved = getChartPlugin("get-plugin");

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe("get-plugin");
      expect(retrieved?.name).toBe("Test Plugin get-plugin");
    });

    it("should return undefined for non-existent plugin", () => {
      const retrieved = getChartPlugin("non-existent");

      expect(retrieved).toBeUndefined();
    });
  });

  describe("hasChartPlugin", () => {
    it("should return true for registered plugins", () => {
      const plugin = createTestPlugin("has-plugin");
      registerChartPlugin(plugin);

      expect(hasChartPlugin("has-plugin")).toBe(true);
    });

    it("should return false for non-existent plugins", () => {
      expect(hasChartPlugin("non-existent")).toBe(false);
    });
  });

  describe("listChartPlugins", () => {
    it("should list all registered plugins", () => {
      const plugin1 = createTestPlugin("list-plugin-1", "category1");
      const plugin2 = createTestPlugin("list-plugin-2", "category2");

      registerChartPlugin(plugin1);
      registerChartPlugin(plugin2);

      const plugins = listChartPlugins();

      expect(plugins.length).toBeGreaterThanOrEqual(2);
      expect(plugins.some((p) => p.id === "list-plugin-1")).toBe(true);
      expect(plugins.some((p) => p.id === "list-plugin-2")).toBe(true);
    });
  });

  describe("unregisterChartPlugin", () => {
    it("should unregister an external plugin", () => {
      const plugin = createTestPlugin("unregister-plugin");
      registerChartPlugin(plugin);

      expect(hasChartPlugin("unregister-plugin")).toBe(true);

      const result = unregisterChartPlugin("unregister-plugin");

      expect(result).toBe(true);
      expect(hasChartPlugin("unregister-plugin")).toBe(false);
    });

    it("should return false for non-existent plugin", () => {
      const result = unregisterChartPlugin("non-existent");

      expect(result).toBe(false);
    });

    it("should call onUnregister hook when provided", () => {
      const onUnregister = vi.fn();
      const plugin = createTestPlugin("unregister-hook-plugin");
      plugin.hooks = { onUnregister };

      registerChartPlugin(plugin);
      unregisterChartPlugin("unregister-hook-plugin");

      expect(onUnregister).toHaveBeenCalled();
    });
  });

  describe("clearChartPlugins", () => {
    it("should remove all external plugins", () => {
      const plugin1 = createTestPlugin("clear-plugin-1");
      const plugin2 = createTestPlugin("clear-plugin-2");

      registerChartPlugin(plugin1);
      registerChartPlugin(plugin2);

      expect(hasChartPlugin("clear-plugin-1")).toBe(true);
      expect(hasChartPlugin("clear-plugin-2")).toBe(true);

      clearChartPlugins();

      expect(hasChartPlugin("clear-plugin-1")).toBe(false);
      expect(hasChartPlugin("clear-plugin-2")).toBe(false);
    });
  });

  describe("getChartPluginStats", () => {
    it("should return plugin statistics", () => {
      const plugin1 = createTestPlugin("stats-plugin-1", "category1");
      const plugin2 = createTestPlugin("stats-plugin-2", "category1");
      const plugin3 = createTestPlugin("stats-plugin-3", "category2");

      registerChartPlugin(plugin1);
      registerChartPlugin(plugin2);
      registerChartPlugin(plugin3);

      const stats = getChartPluginStats();

      expect(stats.total).toBeGreaterThanOrEqual(3);
      expect(stats.external).toBeGreaterThanOrEqual(3);
      expect(stats.byCategory["category1"]).toBeGreaterThanOrEqual(2);
      expect(stats.byCategory["category2"]).toBeGreaterThanOrEqual(1);
    });
  });

  describe("chartRegistry instance", () => {
    it("should provide direct access to registry methods", () => {
      const plugin = createTestPlugin("instance-plugin");

      const result = chartRegistry.register(plugin);

      expect(result.success).toBe(true);

      const retrieved = chartRegistry.get("instance-plugin");
      expect(retrieved).toBeDefined();

      const exists = chartRegistry.has("instance-plugin");
      expect(exists).toBe(true);

      chartRegistry.unregister("instance-plugin");
      expect(chartRegistry.has("instance-plugin")).toBe(false);
    });
  });
});

describe("Plugin Validation", () => {
  beforeEach(() => {
    clearChartPlugins();
  });

  it("should validate required fields", () => {
    const incompletePlugin = {
      id: "incomplete",
      name: "Incomplete Plugin",
      // Missing required fields
      component: MockChartComponent,
    } as any;

    const result = registerChartPlugin(incompletePlugin);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Plugin author is required");
  });

  it("should validate plugin ID format", () => {
    const invalidIdPlugin = {
      ...createTestPlugin("valid-id"),
      id: "Invalid_ID_123!", // Invalid format
    };

    const result = registerChartPlugin(invalidIdPlugin);

    expect(result.success).toBe(false);
    expect(result.error).toContain("lowercase letters, numbers, and hyphens");
  });

  it("should validate version compatibility", () => {
    const incompatiblePlugin = {
      ...createTestPlugin("incompatible-version"),
      minCoreVersion: "99.0.0", // Future version
    };

    const result = registerChartPlugin(incompatiblePlugin);

    expect(result.success).toBe(false);
    expect(result.error).toContain("requires core version");
  });

  it("should allow force option to bypass validation", () => {
    const incompatiblePlugin = {
      ...createTestPlugin("force-plugin"),
      minCoreVersion: "99.0.0",
    };

    const result = registerChartPlugin(incompatiblePlugin, { force: true });

    expect(result.success).toBe(true);
    expect(result.warnings).toBeDefined();
    expect(result.warnings?.length).toBeGreaterThan(0);
  });
});
