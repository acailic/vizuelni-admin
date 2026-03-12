/**
 * Connector Types Unit Tests
 *
 * Tests for connector type definitions and interfaces.
 */

import { describe, it, expect } from "vitest";

// Import types to verify they exist and are properly exported
import { ConnectorError } from "../../../exports/connectors";

import type {
  IDataConnector,
  BaseConnectorConfig,
  DataSchema,
  DataType,
  ConnectorResult,
  PaginatedResult,
  HealthCheckResult,
  ConnectorCapabilities,
  ConnectorErrorCode,
} from "../../../exports/connectors";

// Import ConnectorError class

describe("Connector Types", () => {
  describe("BaseConnectorConfig", () => {
    it("should define expected base config properties", () => {
      // This test verifies the type exists and has expected structure
      const config: BaseConnectorConfig = {
        id: "test-connector",
        name: "Test Connector",
      };

      expect(config.id).toBe("test-connector");
      expect(config.name).toBe("Test Connector");
    });

    it("should allow optional properties", () => {
      const config: BaseConnectorConfig = {
        id: "test",
        name: "Test",
        description: "Test description",
        timeout: 5000,
      };

      expect(config.description).toBeDefined();
      expect(config.timeout).toBeDefined();
    });
  });

  describe("DataSchema", () => {
    it("should define schema structure", () => {
      const schema: DataSchema = {
        columns: ["id", "value"],
        columnTypes: { id: "string", value: "number" },
      };

      expect(schema.columns).toHaveLength(2);
      expect(schema.columns[0]).toBe("id");
      expect(schema.columnTypes["id"]).toBe("string");
    });
  });

  describe("DataType", () => {
    it("should support all data types", () => {
      const types: DataType[] = [
        "string",
        "number",
        "integer",
        "boolean",
        "date",
        "datetime",
        "json",
        "unknown",
      ];

      expect(types).toContain("string");
      expect(types).toContain("number");
      expect(types).toContain("boolean");
      expect(types).toContain("date");
    });
  });

  describe("ConnectorCapabilities", () => {
    it("should define capability flags", () => {
      const capabilities: ConnectorCapabilities = {
        supportsPagination: true,
        supportsFiltering: true,
        supportsSorting: false,
        supportsRealtime: false,
        supportedFormats: ["csv"],
      };

      expect(capabilities.supportsPagination).toBe(true);
      expect(capabilities.supportsSorting).toBe(false);
    });
  });

  describe("ConnectorResult", () => {
    it("should define result structure", () => {
      const result: ConnectorResult<Record<string, unknown>[]> = {
        data: [{ id: 1, name: "Test" }],
        meta: {
          source: "test",
          fetchedAt: new Date().toISOString(),
          rowCount: 1,
        },
      };

      expect(result.data).toHaveLength(1);
      expect(result.meta).toBeDefined();
    });
  });

  describe("PaginatedResult", () => {
    it("should define pagination structure", () => {
      const result: PaginatedResult<Record<string, unknown>> = {
        data: [{ id: 1 }],
        meta: {
          page: 1,
          pageSize: 10,
          total: 100,
          totalPages: 10,
          hasNext: true,
          hasPrevious: false,
        },
      };

      expect(result.meta?.total).toBe(100);
      expect(result.meta?.hasNext).toBe(true);
    });
  });

  describe("HealthCheckResult", () => {
    it("should define health check structure", () => {
      const health: HealthCheckResult = {
        healthy: true,
        message: "OK",
        timestamp: new Date().toISOString(),
        details: { latency: 100 },
      };

      expect(health.healthy).toBe(true);
      expect(health.details).toBeDefined();
    });
  });
});

describe("ConnectorError", () => {
  it("should create error with code and message", () => {
    const error = new ConnectorError("Network failed", "NETWORK_ERROR");

    expect(error.code).toBe("NETWORK_ERROR");
    expect(error.message).toBe("Network failed");
    expect(error.name).toBe("ConnectorError");
  });

  it("should create error with context", () => {
    const error = new ConnectorError("Request timed out", "TIMEOUT", {
      url: "https://example.com",
      timeout: 5000,
    });

    expect(error.details).toEqual({
      url: "https://example.com",
      timeout: 5000,
    });
  });

  it("should be instanceof Error", () => {
    const error = new ConnectorError("Unknown error", "UNKNOWN_ERROR");

    expect(error instanceof Error).toBe(true);
    expect(error instanceof ConnectorError).toBe(true);
  });

  it("should have stack trace", () => {
    const error = new ConnectorError("Parse failed", "PARSING_ERROR");

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("ConnectorError");
  });
});

describe("ConnectorErrorCode", () => {
  it("should define all error codes", () => {
    const errorCodes: ConnectorErrorCode[] = [
      "NETWORK_ERROR",
      "TIMEOUT",
      "PARSING_ERROR",
      "AUTHENTICATION_ERROR",
      "AUTHORIZATION_ERROR",
      "NOT_FOUND",
      "RATE_LIMIT_EXCEEDED",
      "INVALID_REQUEST",
      "UNSUPPORTED_FORMAT",
      "UNKNOWN_ERROR",
    ];

    expect(errorCodes).toContain("NETWORK_ERROR");
    expect(errorCodes).toContain("TIMEOUT");
    expect(errorCodes).toContain("PARSING_ERROR");
    expect(errorCodes).toHaveLength(10);
  });
});

describe("IDataConnector Interface", () => {
  it("should define required methods", () => {
    // Type check - this will fail at compile time if interface is wrong
    const connector: IDataConnector<BaseConnectorConfig> = {
      config: { id: "test", name: "Test" },
      capabilities: {
        supportsPagination: false,
        supportsFiltering: false,
        supportsSorting: false,
        supportsRealtime: false,
        supportedFormats: [],
      },
      fetch: async () => ({
        data: [],
      }),
      getSchema: async () => ({ columns: [], columnTypes: {} }),
      healthCheck: async () => ({
        healthy: true,
        message: "OK",
        timestamp: "",
      }),
      destroy: async () => {},
    };

    expect(typeof connector.fetch).toBe("function");
    expect(typeof connector.getSchema).toBe("function");
    expect(typeof connector.healthCheck).toBe("function");
    expect(typeof connector.destroy).toBe("function");
    expect(connector.capabilities).toBeDefined();
  });
});
