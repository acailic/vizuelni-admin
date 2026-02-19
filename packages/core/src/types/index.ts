/**
 * A single data point - a record of arbitrary values
 */
export type Datum = Record<string, unknown>;

/**
 * Field type enumeration
 */
export type FieldType = "string" | "number" | "date" | "boolean";

/**
 * Schema for a single field/column
 */
export interface Field {
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
  fields: Field[];
}

/**
 * Chart data with schema
 */
export interface ChartData {
  /** Array of data records */
  data: Datum[];
  /** Schema describing the data */
  schema: DataSchema;
}

/**
 * Margin dimensions
 */
export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Rectangle dimensions
 */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Chart dimensions
 */
export interface Dimensions {
  /** Total width */
  width: number;
  /** Total height */
  height: number;
  /** Margins */
  margins: Margins;
  /** Chart area (excluding margins) */
  chartArea: Rect;
}
