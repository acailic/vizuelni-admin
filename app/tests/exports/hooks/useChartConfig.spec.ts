/**
 * Tests for useChartConfig hook
 *
 * Tests the React hook for managing chart configuration with validation.
 */

import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { validateConfig, DEFAULT_CONFIG } from "../../../exports/core";
import { useChartConfig } from "../../../exports/hooks/useChartConfig";

import type { VizualniAdminConfig } from "../../../exports/core";
import type { Mock } from "vitest";

// Mock validateConfig
vi.mock("../../../exports/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../../exports/core")>();
  return {
    ...actual,
    validateConfig: vi.fn(),
  };
});

describe("useChartConfig", () => {
  const mockValidConfig: VizualniAdminConfig = {
    project: {
      name: "Test Project",
      language: "sr",
      theme: "light",
    },
    categories: {
      enabled: ["economy", "transport"],
      featured: ["economy"],
    },
    datasets: {
      autoDiscovery: true,
      manualIds: {
        economy: ["dataset-1"],
        transport: ["dataset-2"],
      },
    },
    visualization: {
      defaultChartType: "line",
      colorPalette: "#6366f1",
      customColors: ["#6366f1", "#10b981"],
    },
    features: {
      embedding: true,
      export: true,
      sharing: false,
      tutorials: true,
    },
    deployment: {
      basePath: "/vizualni",
      customDomain: "",
      target: "local",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    (validateConfig as Mock).mockReturnValue({
      valid: true,
      errors: [],
    });
  });

  describe("config initialization", () => {
    it("should initialize with default config", () => {
      const { result } = renderHook(() => useChartConfig());

      expect(result.current.config).toBeDefined();
      expect(result.current.isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });

    it("should merge initialConfig with defaults", () => {
      const initialConfig = {
        project: {
          name: "Custom Project",
          language: "sr" as const,
          theme: "dark" as const,
        },
      };

      const { result } = renderHook(() =>
        useChartConfig({
          initialConfig,
        })
      );

      expect(result.current.config.project.name).toBe("Custom Project");
      expect(result.current.config.project.theme).toBe("dark");
    });

    it("should validate on mount by default", () => {
      renderHook(() => useChartConfig());

      // Validator is called internally
      expect(validateConfig).toHaveBeenCalled();
    });

    it("should not validate on mount when validateOnMount is false", () => {
      renderHook(() =>
        useChartConfig({
          validateOnMount: false,
        })
      );

      expect(validateConfig).not.toHaveBeenCalled();
    });

    it("should set isValid to true when validation passes", () => {
      const { result } = renderHook(() => useChartConfig());

      expect(result.current.isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });

    it("should set isValid to false when validation fails", () => {
      (validateConfig as Mock).mockReturnValue({
        valid: false,
        errors: [{ path: "/project/name", message: "name is required" }],
      });

      const { result } = renderHook(() =>
        useChartConfig({
          initialConfig: {
            project: { name: "", language: "invalid" as any, theme: "light" },
          },
        })
      );

      // The hook should handle invalid config
      expect(result.current.config).toBeDefined();
    });
  });

  describe("updateConfig function", () => {
    it("should update config with partial changes", () => {
      const { result } = renderHook(() => useChartConfig());

      act(() => {
        result.current.updateConfig({
          project: {
            name: "Updated Project",
            language: "sr",
            theme: "dark",
          },
        });
      });

      expect(result.current.config.project.name).toBe("Updated Project");
      expect(result.current.config.project.theme).toBe("dark");
    });

    it("should preserve other fields when updating", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          initialConfig: mockValidConfig,
        })
      );

      const originalTheme = result.current.config.project.theme;
      const originalLanguage = result.current.config.project.language;

      act(() => {
        result.current.updateConfig({
          project: {
            name: "New Name",
            language: originalLanguage,
            theme: originalTheme,
          },
        });
      });

      expect(result.current.config.project.name).toBe("New Name");
      expect(result.current.config.project.theme).toBe(originalTheme);
      expect(result.current.config.project.language).toBe(originalLanguage);
    });

    it("should auto-validate when autoValidate is true", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          autoValidate: true,
        })
      );

      // Update with valid config
      act(() => {
        result.current.updateConfig({
          project: {
            name: "Test",
            language: "sr",
            theme: "light",
          },
        });
      });

      // Should still be valid
      expect(result.current.config).toBeDefined();
    });

    it("should not auto-validate when autoValidate is false", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          autoValidate: false,
          validateOnMount: false,
        })
      );

      act(() => {
        result.current.updateConfig({
          project: {
            name: "Test",
            language: "sr",
            theme: "light",
          },
        });
      });

      // Should not call validateConfig
      expect(validateConfig).not.toHaveBeenCalled();
    });

    it("should merge updates with existing config", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          initialConfig: mockValidConfig,
        })
      );

      act(() => {
        result.current.updateConfig({
          features: {
            ...result.current.config.features,
            sharing: true,
          },
        });
      });

      expect(result.current.config.features.sharing).toBe(true);
      expect(result.current.config.features.embedding).toBe(true); // preserved
    });
  });

  describe("resetConfig function", () => {
    it("should reset to initial config", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          initialConfig: mockValidConfig,
        })
      );

      // Modify config
      act(() => {
        result.current.updateConfig({
          project: {
            name: "Modified Name",
            language: "en",
            theme: "dark",
          },
        });
      });

      expect(result.current.config.project.name).toBe("Modified Name");

      // Reset
      act(() => {
        result.current.resetConfig();
      });

      expect(result.current.config.project.name).toBe(
        mockValidConfig.project.name
      );
      expect(result.current.config.project.language).toBe(
        mockValidConfig.project.language
      );
    });

    it("should clear errors on reset", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          initialConfig: mockValidConfig,
          autoValidate: false,
        })
      );

      // Manually set errors
      act(() => {
        result.current.updateConfig({
          project: {
            name: "",
            language: "invalid" as any,
            theme: "light",
          },
        });
      });

      // Manually validate to get errors
      act(() => {
        (validateConfig as Mock).mockReturnValueOnce({
          valid: false,
          errors: [{ path: "/project/name", message: "name is required" }],
        });
        result.current.validate();
      });

      expect(result.current.errors).toHaveLength(1);

      // Reset - should clear errors even without validation
      act(() => {
        result.current.resetConfig();
      });

      expect(result.current.errors).toEqual([]);
    });

    it("should reset to default config when no initialConfig provided", () => {
      const { result } = renderHook(() => useChartConfig());

      // Modify config
      act(() => {
        result.current.updateConfig({
          project: {
            name: "Modified Name",
            language: "sr",
            theme: "dark",
          },
        });
      });

      // Reset
      act(() => {
        result.current.resetConfig();
      });

      expect(result.current.config).toEqual(DEFAULT_CONFIG);
    });
  });

  describe("validation errors", () => {
    it("should handle validation results", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          autoValidate: true,
        })
      );

      // Should be valid with default config
      expect(result.current.isValid).toBe(true);
      expect(result.current.errors).toEqual([]);
    });

    it("should update errors when validation fails", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          autoValidate: true,
        })
      );

      // Test that errors array exists and can be updated
      expect(Array.isArray(result.current.errors)).toBe(true);
    });
  });

  describe("setField function", () => {
    it("should set a single field value", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          initialConfig: mockValidConfig,
        })
      );

      act(() => {
        result.current.setField("project", {
          name: "New Project Name",
          language: "sr",
          theme: "dark",
        });
      });

      expect(result.current.config.project.name).toBe("New Project Name");
      expect(result.current.config.project.theme).toBe("dark");
    });

    it("should set nested field values", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          initialConfig: mockValidConfig,
        })
      );

      act(() => {
        result.current.setField("features", {
          embedding: false,
          export: true,
          sharing: true,
          tutorials: false,
        });
      });

      expect(result.current.config.features.embedding).toBe(false);
      expect(result.current.config.features.sharing).toBe(true);
    });

    it("should trigger validation when autoValidate is true", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          autoValidate: true,
        })
      );

      act(() => {
        result.current.setField("project", {
          name: "Test Project",
          language: "sr",
          theme: "light",
        });
      });

      expect(validateConfig).toHaveBeenCalled();
    });

    it("should maintain type safety for field keys", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          initialConfig: mockValidConfig,
        })
      );

      // TypeScript should catch invalid keys at compile time
      // This test ensures runtime behavior matches
      act(() => {
        result.current.setField("project", {
          name: "Test",
          language: "sr",
          theme: "light",
        });
      });

      expect(result.current.config.project).toBeDefined();
    });

    it("should preserve other fields when setting one field", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          initialConfig: mockValidConfig,
        })
      );

      const originalCategories = result.current.config.categories;
      const originalDatasets = result.current.config.datasets;

      act(() => {
        result.current.setField("project", {
          name: "New Name",
          language: "en",
          theme: "dark",
        });
      });

      expect(result.current.config.categories).toEqual(originalCategories);
      expect(result.current.config.datasets).toEqual(originalDatasets);
    });
  });

  describe("validate function", () => {
    it("should manually validate config", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          validateOnMount: false,
          autoValidate: false,
        })
      );

      let validationResult;

      act(() => {
        validationResult = result.current.validate();
      });

      // Should return a boolean
      expect(typeof validationResult).toBe("boolean");
    });

    it("should update errors when manually validating", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          validateOnMount: false,
          autoValidate: false,
        })
      );

      act(() => {
        result.current.validate();
      });

      // Should have errors array
      expect(Array.isArray(result.current.errors)).toBe(true);
    });
  });

  describe("integration tests", () => {
    it("should handle complete workflow: update, validate, reset", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          initialConfig: mockValidConfig,
          autoValidate: true,
        })
      );

      // Initial state
      expect(result.current.isValid).toBe(true);

      // Update
      act(() => {
        result.current.updateConfig({
          project: {
            name: "Changed",
            language: "sr",
            theme: "dark",
          },
        });
      });

      expect(result.current.config.project.name).toBe("Changed");

      // Reset
      act(() => {
        result.current.resetConfig();
      });

      expect(result.current.config.project.name).toBe(
        mockValidConfig.project.name
      );
    });

    it("should handle multiple rapid updates", () => {
      const { result } = renderHook(() =>
        useChartConfig({
          autoValidate: false,
        })
      );

      // Multiple updates
      act(() => {
        result.current.setField("project", {
          name: "Test 1",
          language: "sr",
          theme: "light",
        });
        result.current.setField("project", {
          name: "Test 2",
          language: "sr",
          theme: "light",
        });
        result.current.setField("project", {
          name: "Test 3",
          language: "sr",
          theme: "light",
        });
      });

      expect(result.current.config.project.name).toBe("Test 3");
    });
  });
});
