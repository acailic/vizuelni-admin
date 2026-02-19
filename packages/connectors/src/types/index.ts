import type { Datum } from "@vizualni/core";

/**
 * Field type enumeration for data schemas
 */
export type FieldType = "string" | "number" | "date" | "boolean";

/**
 * Schema for a single field/column
 */
export interface FieldSchema {
  /** Field name/key in data */
  name: string;
  /** Data type */
  type: FieldType;
  /** Human-readable title */
  title?: string;
  /** Description */
  description?: string;
}

/**
 * Schema describing data structure
 */
export interface DataSchema {
  fields: FieldSchema[];
}

/**
 * Result from a connector fetch operation
 */
export interface ConnectorResult<TMeta = unknown> {
  /** Array of data records */
  data: Datum[];
  /** Schema describing the data */
  schema: DataSchema;
  /** Optional metadata from the source */
  meta?: TMeta;
}

/**
 * Configuration for inferring schema from data
 */
export interface SchemaInferenceOptions {
  /** Number of rows to sample for inference (default: 100) */
  sampleSize?: number;
}

/**
 * Generic data connector interface
 */
export interface DataConnector<TConfig = unknown, TMeta = unknown> {
  /** Connector type identifier */
  readonly type: string;
  /** Fetch data from the source */
  fetch(config: TConfig): Promise<ConnectorResult<TMeta>>;
  /** Optionally get schema without fetching all data */
  getSchema?(config: TConfig): Promise<DataSchema>;
}

/**
 * Options for the useConnector hook
 */
export interface UseConnectorOptions<TConfig> {
  /** Connector to use */
  connector: DataConnector<TConfig>;
  /** Connector configuration */
  config: TConfig;
  /** Auto-fetch on mount (default: true) */
  enabled?: boolean;
}
