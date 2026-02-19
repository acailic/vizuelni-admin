// @vizualni/connectors - Data connectors for fetching data from various sources
// This package provides connectors for CSV, JSON, and other data sources

// Types
export type {
  DataConnector,
  ConnectorResult,
  DataSchema,
  FieldSchema,
  FieldType,
  SchemaInferenceOptions,
  UseConnectorOptions,
} from "./types";

// CSV Connector
export { csvConnector } from "./csv";
export type { CsvConfig } from "./csv";

// JSON Connector
export { jsonConnector } from "./json";
export type { JsonConfig } from "./json";
