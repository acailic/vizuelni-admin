/**
 * CSV URL Data Connector
 *
 * Fetches and parses CSV data from a URL.
 * Supports various CSV formats and provides schema detection.
 *
 * @packageDocumentation
 */

import type {
  IDataConnector,
  BaseConnectorConfig,
  ConnectorResult,
  ConnectorCapabilities,
  DataSchema,
  DataType,
  ConnectorError,
  ConnectorErrorCode,
  HealthCheckResult,
} from "./types";

/**
 * Configuration for CSV URL connector
 */
export interface CsvUrlConnectorConfig extends BaseConnectorConfig {
  /**
   * URL to fetch the CSV from
   */
  url: string;

  /**
   * CSV delimiter character
   * @default ","
   */
  delimiter?: string;

  /**
   * Whether the first row contains headers
   * @default true
   */
  hasHeader?: boolean;

  /**
   * Character used for quoting
   * @default '"'
   */
  quoteChar?: string;

  /**
   * Character used for escaping
   * @default '"'
   */
  escapeChar?: string;

  /**
   * Skip empty lines
   * @default true
   */
  skipEmptyLines?: boolean;

  /**
   * Maximum file size in bytes (0 = no limit)
   * @default 10485760 (10MB)
   */
  maxFileSize?: number;
}

/**
 * Parsed CSV row data
 */
export type CsvRow = Record<string, string | number | boolean | null>;

/**
 * Schema detection result
 */
interface SchemaDetection {
  columns: string[];
  columnTypes: Record<string, DataType>;
  nullableColumns: string[];
}

/**
 * CSV URL Connector Implementation
 *
 * Fetches CSV data from a URL, parses it, and provides schema detection.
 */
export class CsvUrlConnector implements IDataConnector<CsvUrlConnectorConfig> {
  readonly config: Required<CsvUrlConnectorConfig>;
  readonly capabilities: ConnectorCapabilities;

  private cachedData?: CsvRow[];
  private cachedSchema?: DataSchema;

  constructor(config: CsvUrlConnectorConfig) {
    this.config = {
      id: config.id,
      name: config.name,
      description: config.description,
      url: config.url,
      timeout: config.timeout ?? 10000,
      maxRetries: config.maxRetries ?? 3,
      debug: config.debug ?? false,
      delimiter: config.delimiter ?? ",",
      hasHeader: config.hasHeader ?? true,
      quoteChar: config.quoteChar ?? '"',
      escapeChar: config.escapeChar ?? '"',
      skipEmptyLines: config.skipEmptyLines ?? true,
      maxFileSize: config.maxFileSize ?? 10485760, // 10MB default
    };

    this.capabilities = {
      supportsPagination: false,
      supportsFiltering: false,
      supportsSorting: false,
      supportsRealtime: false,
      supportedFormats: ["csv", "text/csv"],
    };
  }

  /**
   * Initialize the connector by fetching and parsing the CSV
   */
  async initialize(): Promise<void> {
    if (this.config.debug) {
      console.debug(`[CsvUrlConnector:${this.config.id}] Initializing...`);
    }

    await this.fetch();
  }

  /**
   * Health check for the connector
   */
  async healthCheck(): Promise<HealthCheckResult> {
    try {
      const response = await this.fetchWithTimeout(this.config.url, {
        method: "HEAD",
      });

      const contentType = response.headers.get("content-type") || "";
      const contentLength = response.headers.get("content-length");
      const size = contentLength ? parseInt(contentLength, 10) : 0;

      const isCsv =
        contentType.includes("csv") ||
        contentType.includes("text/plain") ||
        this.config.url.endsWith(".csv");

      const healthy = response.ok && isCsv;

      return {
        healthy,
        message: healthy
          ? "CSV URL is accessible"
          : `CSV URL is ${response.ok ? "not CSV format" : "not accessible"}`,
        details: {
          url: this.config.url,
          status: response.status,
          contentType,
          size,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        healthy: false,
        message: `Health check failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: {
          url: this.config.url,
          error: error instanceof Error ? error.message : String(error),
        },
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Fetch and parse the CSV data
   */
  async fetch(): Promise<ConnectorResult<CsvRow[]>> {
    if (this.cachedData) {
      return {
        data: this.cachedData,
        cacheKey: this.getCacheKey(),
      };
    }

    try {
      const response = await this.fetchWithTimeout(this.config.url);

      // Check content length
      const contentLength = response.headers.get("content-length");
      if (contentLength) {
        const size = parseInt(contentLength, 10);
        if (this.config.maxFileSize > 0 && size > this.config.maxFileSize) {
          throw this.createError(
            "FILE_TOO_LARGE",
            `CSV file size (${size} bytes) exceeds maximum allowed size (${this.config.maxFileSize} bytes)`
          );
        }
      }

      const csvText = await response.text();

      // Check actual size if content-length was not available
      if (
        this.config.maxFileSize > 0 &&
        csvText.length > this.config.maxFileSize
      ) {
        throw this.createError(
          "FILE_TOO_LARGE",
          `CSV file size (${csvText.length} bytes) exceeds maximum allowed size (${this.config.maxFileSize} bytes)`
        );
      }

      const data = this.parseCsv(csvText);

      this.cachedData = data;

      return {
        data,
        cacheKey: this.getCacheKey(),
      };
    } catch (error) {
      if (error instanceof ConnectorError) {
        throw error;
      }

      throw this.createError(
        "UNKNOWN_ERROR",
        `Failed to fetch CSV: ${error instanceof Error ? error.message : "Unknown error"}`,
        error
      );
    }
  }

  /**
   * Fetch with timeout support
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw this.createError(
          "NOT_FOUND",
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw this.createError(
          "TIMEOUT",
          `Request timeout after ${this.config.timeout}ms`
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Parse CSV text into array of objects
   */
  private parseCsv(csvText: string): CsvRow[] {
    const lines = csvText.split(/\r?\n/);
    const rows: CsvRow[] = [];

    if (lines.length === 0) {
      return rows;
    }

    // Parse header row
    const headerIndex = 0;
    const headers = this.parseLine(lines[headerIndex]);

    if (headers.length === 0) {
      throw this.createError("PARSING_ERROR", "CSV has no columns");
    }

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines if configured
      if (this.config.skipEmptyLines && line.length === 0) {
        continue;
      }

      const values = this.parseLine(line);

      // Skip rows with mismatched column count
      if (values.length !== headers.length) {
        if (this.config.debug) {
          console.warn(
            `[CsvUrlConnector:${this.config.id}] Row ${i} has ${values.length} values, expected ${headers.length}`
          );
        }
        continue;
      }

      const row: CsvRow = {};
      headers.forEach((header, index) => {
        const value = this.parseValue(values[index]);
        row[header] = value;
      });

      rows.push(row);
    }

    return rows;
  }

  /**
   * Parse a single CSV line handling quoted values
   */
  private parseLine(line: string): string[] {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === this.config.quoteChar) {
        if (inQuotes && nextChar === this.config.quoteChar) {
          // Escaped quote
          current += this.config.quoteChar;
          i++;
        } else {
          // Toggle quote mode
          inQuotes = !inQuotes;
        }
      } else if (char === this.config.delimiter && !inQuotes) {
        // Field delimiter
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    // Add the last value
    values.push(current.trim());

    return values;
  }

  /**
   * Parse a value to its appropriate type
   */
  private parseValue(value: string): string | number | boolean | null {
    const trimmed = value.trim();

    // Empty string becomes null
    if (trimmed === "") {
      return null;
    }

    // Boolean
    if (trimmed.toLowerCase() === "true") {
      return true;
    }
    if (trimmed.toLowerCase() === "false") {
      return false;
    }

    // Number
    if (/^-?\d+\.?\d*$/.test(trimmed)) {
      return parseFloat(trimmed);
    }

    // String
    return trimmed;
  }

  /**
   * Detect schema from CSV data
   */
  async getSchema(): Promise<DataSchema> {
    if (this.cachedSchema) {
      return this.cachedSchema;
    }

    if (!this.cachedData) {
      await this.fetch();
    }

    if (!this.cachedData || this.cachedData.length === 0) {
      return {
        columns: [],
        columnTypes: {},
        nullableColumns: [],
      };
    }

    const detection = this.detectSchema(this.cachedData);

    this.cachedSchema = {
      columns: detection.columns,
      columnTypes: detection.columnTypes,
      nullableColumns: detection.nullableColumns,
    };

    return this.cachedSchema;
  }

  /**
   * Detect schema from parsed CSV data
   */
  private detectSchema(data: CsvRow[]): SchemaDetection {
    const columns = Object.keys(data[0]);
    const columnTypes: Record<string, DataType> = {};
    const nullableColumns: string[] = [];
    const typeCounts: Record<string, Record<DataType, number>> = {};

    // Initialize type counters
    columns.forEach((col) => {
      typeCounts[col] = {
        string: 0,
        number: 0,
        integer: 0,
        boolean: 0,
        date: 0,
        datetime: 0,
        json: 0,
        unknown: 0,
      };
    });

    // Analyze each row
    data.forEach((row) => {
      columns.forEach((col) => {
        const value = row[col];
        const type = this.getValueType(value);
        typeCounts[col][type]++;
      });
    });

    // Determine most common type for each column
    columns.forEach((col) => {
      const counts = typeCounts[col];
      let maxCount = 0;
      let dominantType: DataType = "unknown";

      Object.entries(counts).forEach(([type, count]) => {
        if (count > maxCount) {
          maxCount = count;
          dominantType = type as DataType;
        }
      });

      columnTypes[col] = dominantType;

      // Check if column is nullable (has null values)
      const nullCount = data.filter((row) => row[col] === null).length;
      if (nullCount > 0) {
        nullableColumns.push(col);
      }
    });

    return {
      columns,
      columnTypes,
      nullableColumns,
    };
  }

  /**
   * Get the type of a value
   */
  private getValueType(value: unknown): DataType {
    if (value === null) {
      return "unknown";
    }

    if (typeof value === "boolean") {
      return "boolean";
    }

    if (typeof value === "number") {
      return Number.isInteger(value) ? "integer" : "number";
    }

    if (typeof value === "string") {
      // Try parsing as date
      if (!isNaN(Date.parse(value))) {
        return "date";
      }

      // Try parsing as JSON
      try {
        JSON.parse(value);
        return "json";
      } catch {
        // Not JSON
      }

      return "string";
    }

    return "unknown";
  }

  /**
   * Test the connection to the CSV URL
   */
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.healthCheck();
      return result.healthy;
    } catch {
      return false;
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.cachedData = undefined;
    this.cachedSchema = undefined;
  }

  /**
   * Create a connector error
   */
  private createError(
    code: ConnectorErrorCode,
    message: string,
    details?: unknown
  ): ConnectorError {
    const error = new Error(message) as ConnectorError;
    error.code = code;
    error.details = details;
    return error;
  }

  /**
   * Get cache key for this connector
   */
  private getCacheKey(): string {
    return `csv-url:${this.config.url}`;
  }
}

/**
 * Factory function to create a CSV URL connector
 */
export function createCsvUrlConnector(
  config: CsvUrlConnectorConfig
): CsvUrlConnector {
  return new CsvUrlConnector(config);
}
