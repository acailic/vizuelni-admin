'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Database,
  FileJson,
  Settings2,
  BarChart3,
  Code2,
  TrendingUp,
  BarChart2,
  LineChart,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Table,
  Clock,
  MapPin,
  Tag,
  Hash,
  Copy,
  Check,
} from 'lucide-react';
import Papa from 'papaparse';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Locale } from '@/lib/i18n/config';
import { withBasePath } from '@/lib/url/base-path';
import {
  DATASET_PRESETS,
  getChartTypeLabel,
  getPresetLabels,
  type DemoTranslations,
  type DatasetPreset,
} from './translations';

interface ParsedSchema {
  dimensions: string[];
  measures: string[];
  timeField: string | null;
  geoField: string | null;
  warnings: ('NO_NUMERIC' | 'MANY_COLUMNS' | 'YEAR_NOT_RECOGNIZED')[];
  columnTypes: Record<string, 'text' | 'number' | 'mixed'>;
}

interface RawDataState {
  loading: boolean;
  error: string | null;
  data: Record<string, string | number | boolean | null>[] | null;
  delimiter: string;
  headers: string[];
  rowCount: number;
  isFallback?: boolean;
}

const INITIAL_RAW_DATA_STATE: RawDataState = {
  loading: false,
  error: null,
  data: null,
  delimiter: ',',
  headers: [],
  rowCount: 0,
};

// Colors for multi-line charts
const GOV_BLUE = '#0D4077';
const CHART_COLORS = [GOV_BLUE, '#C6363C', '#4B90F5', '#2d8a4e', '#e6a817', '#8b5cf6'];

/**
 * Map a structured schema warning code to its localized string.
 */
function getSchemaWarningText(
  warning: 'NO_NUMERIC' | 'MANY_COLUMNS' | 'YEAR_NOT_RECOGNIZED',
  t: DemoTranslations
): string {
  switch (warning) {
    case 'NO_NUMERIC':
      return t.schemaWarningNoNumeric;
    case 'MANY_COLUMNS':
      return t.schemaWarningManyColumns;
    case 'YEAR_NOT_RECOGNIZED':
      return t.schemaWarningYearNotRecognized;
  }
}

/**
 * Detect the delimiter used in CSV content
 */
function detectDelimiter(content: string): string {
  const firstLine = content.split('\n')[0] || '';
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (semicolonCount > commaCount && semicolonCount > tabCount) {
    return ';';
  }
  if (tabCount > commaCount && tabCount > semicolonCount) {
    return '\t';
  }
  return ',';
}

/**
 * Extract host from URL
 */
function getHostFromUrl(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return 'unknown';
  }
}

/**
 * Infer organization from URL
 */
function inferOrganization(url: string): string {
  const host = getHostFromUrl(url);
  if (host.includes('stat.gov.rs')) {
    return 'Republički zavod za statistiku';
  }
  if (host.includes('data.gov.rs')) {
    return 'data.gov.rs';
  }
  return host;
}

/**
 * Check if a string looks like a year or date
 */
function isTimeField(value: string, header: string): boolean {
  // Check header name for time indicators
  const headerLower = header.toLowerCase();
  const timeIndicators = ['godina', 'year', 'datum', 'date', 'vreme', 'time', 'god', 'yr'];
  if (timeIndicators.some((ind) => headerLower.includes(ind))) {
    return true;
  }

  // Check if values look like years (1900-2100)
  const yearMatch = value.match(/^(19|20)\d{2}$/);
  if (yearMatch) {
    return true;
  }

  // Check for date patterns
  const datePatterns = [/^\d{4}-\d{2}-\d{2}$/, /^\d{2}\.\d{2}\.\d{4}$/, /^\d{2}\/\d{2}\/\d{4}$/];
  return datePatterns.some((p) => p.test(value.trim()));
}

/**
 * Check if a string looks like a geographic name
 */
function isGeoField(header: string): boolean {
  const headerLower = header.toLowerCase();
  const geoIndicators = [
    'grad',
    'city',
    'opstina',
    'municipality',
    'region',
    'region',
    'drzava',
    'country',
    'mesto',
    'place',
    'naselje',
    'settlement',
    'okrug',
    'district',
  ];
  return geoIndicators.some((ind) => headerLower.includes(ind));
}

/**
 * Strip leading metadata lines from CSV text.
 * Some CSVs (e.g. sensor data) include key-value metadata rows at the top
 * (e.g. "Location - latitude,44.85876,,,,,") before the real header.
 * Detects these by checking if more than half of the comma-separated fields
 * in a line are empty, which is a reliable indicator of metadata rows.
 */
// Check at most this many non-blank lines for metadata headers
const MAX_METADATA_LINES_TO_CHECK = 5;
// A line is considered a metadata row if more than this fraction of its fields are empty
// (e.g. "Location - latitude,44.85876,,,,," has 5/7 ≈ 71% empty fields)
const METADATA_EMPTY_FIELD_THRESHOLD = 0.5;

function stripMetadataLines(text: string, delimiter: string): string {
  const lines = text.split('\n');
  if (lines.length <= 1) return text;

  let startIdx = 0;
  let checkedNonBlank = 0;
  for (let i = 0; i < lines.length && checkedNonBlank < MAX_METADATA_LINES_TO_CHECK; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '') {
      // Advance past leading blank lines
      if (i === startIdx) startIdx = i + 1;
      continue;
    }
    checkedNonBlank++;
    const fields = trimmed.split(delimiter);
    const emptyCount = fields.filter((f) => f.trim() === '').length;
    if (fields.length > 1 && emptyCount / fields.length > METADATA_EMPTY_FIELD_THRESHOLD) {
      startIdx = i + 1;
    } else {
      break;
    }
  }

  return lines.slice(startIdx).join('\n');
}

/**
 * Analyze column types and detect schema
 */
function analyzeSchema(
  data: Record<string, string | number | boolean | null>[],
  headers: string[]
): ParsedSchema {
  const dimensions: string[] = [];
  const measures: string[] = [];
  let timeField: string | null = null;
  let geoField: string | null = null;
  const warnings: ('NO_NUMERIC' | 'MANY_COLUMNS' | 'YEAR_NOT_RECOGNIZED')[] = [];
  const columnTypes: Record<string, 'text' | 'number' | 'mixed'> = {};

  // Sample up to 100 rows for analysis
  const sampleSize = Math.min(data.length, 100);

  headers.forEach((header) => {
    let numericCount = 0;
    let textCount = 0;
    let timeCount = 0;

    for (let i = 0; i < sampleSize; i++) {
      const value = data[i]?.[header];
      if (value === null || value === undefined || value === '') {
        continue;
      }

      const strValue = String(value);

      // Check for time field
      if (isTimeField(strValue, header)) {
        timeCount++;
      }

      // Check if numeric
      // Serbian locale uses comma for decimals
      const normalizedValue = strValue.replace(',', '.');
      if (!isNaN(parseFloat(normalizedValue)) && isFinite(parseFloat(normalizedValue))) {
        numericCount++;
      } else {
        textCount++;
      }
    }

    // Determine column type
    if (numericCount > textCount * 2) {
      columnTypes[header] = 'number';
      measures.push(header);
    } else if (textCount > 0) {
      columnTypes[header] = 'text';
      dimensions.push(header);
    } else {
      columnTypes[header] = 'mixed';
      dimensions.push(header);
    }

    // Detect time field
    if (timeCount > sampleSize * 0.5 && !timeField) {
      timeField = header;
    }

    // Detect geo field
    if (isGeoField(header) && !geoField) {
      geoField = header;
    }
  });

  // Generate warnings
  if (measures.length === 0) {
    warnings.push('NO_NUMERIC');
  }
  if (dimensions.length > 10) {
    warnings.push('MANY_COLUMNS');
  }
  if (!timeField && headers.some((h) => h.toLowerCase().includes('godina') || h.toLowerCase().includes('year'))) {
    warnings.push('YEAR_NOT_RECOGNIZED');
  }

  return {
    dimensions,
    measures,
    timeField,
    geoField,
    warnings,
    columnTypes,
  };
}

interface LiveDataDemoClientProps {
  locale: Locale;
  translations: DemoTranslations;
}

/**
 * Determine recommended chart type based on schema
 */
function determineChartType(schema: ParsedSchema | null): 'line' | 'bar' | 'multi-line' {
  if (!schema) return 'bar';

  const hasTimeField = schema.timeField !== null;
  const measureCount = schema.measures.length;

  if (hasTimeField && measureCount >= 2) {
    return 'multi-line';
  }
  if (hasTimeField) {
    return 'line';
  }
  return 'bar';
}

/**
 * Get recommendation explanation text key
 */
function getRecommendationKey(chartType: 'line' | 'bar' | 'multi-line'): keyof DemoTranslations {
  switch (chartType) {
    case 'line':
      return 'chartRecommendationLine';
    case 'bar':
      return 'chartRecommendationBar';
    case 'multi-line':
      return 'chartRecommendationMultiLine';
  }
}

/**
 * Get alternative chart types
 */
function getAlternativeChartTypes(
  currentType: 'line' | 'bar' | 'multi-line'
): ('line' | 'bar' | 'multi-line')[] {
  const all: ('line' | 'bar' | 'multi-line')[] = ['line', 'bar', 'multi-line'];
  return all.filter((t) => t !== currentType).slice(0, 2);
}

export default function LiveDataDemoClient({
  locale,
  translations: t,
}: LiveDataDemoClientProps) {
  const [selectedPreset, setSelectedPreset] = useState<DatasetPreset | null>(null);
  const [rawData, setRawData] = useState<RawDataState>(INITIAL_RAW_DATA_STATE);
  const [schema, setSchema] = useState<ParsedSchema | null>(null);
  const [selectedChartType, setSelectedChartType] = useState<'line' | 'bar' | 'multi-line' | null>(
    null
  );
  const [codeCopied, setCodeCopied] = useState(false);
  const [fallbackDate, setFallbackDate] = useState<string | null>(null);

  /**
   * Parse CSV text and return structured data
   */
  const parseCsvText = useCallback((text: string): {
    data: Record<string, string | number | boolean | null>[];
    delimiter: string;
    headers: string[];
  } => {
    const delimiter = detectDelimiter(text);
    const cleanedText = stripMetadataLines(text, delimiter);
    const parseResult = Papa.parse<Record<string, string>>(cleanedText, {
      header: true,
      delimiter,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
    });

    if (parseResult.errors.length > 0) {
      console.warn('CSV parse warnings:', parseResult.errors);
    }

    const data = parseResult.data as unknown as Record<
      string,
      string | number | boolean | null
    >[];
    const headers = parseResult.meta.fields || [];

    return { data, delimiter, headers };
  }, []);

  /**
   * Load fallback snapshot from local JSON file
   */
  const loadFallbackSnapshot = useCallback(async (presetId: string): Promise<{
    csv: string;
    captured: string;
  } | null> => {
    try {
      const response = await fetch(
        withBasePath(`/demo-snapshots/live-data-gov-rs/${presetId}.json`)
      );
      if (!response.ok) {
        console.warn(`No fallback snapshot found for ${presetId}`);
        return null;
      }
      const snapshot = await response.json();
      return {
        csv: snapshot.csv,
        captured: snapshot.metadata?.captured || 'unknown',
      };
    } catch (error) {
      console.warn(`Failed to load fallback snapshot for ${presetId}:`, error);
      return null;
    }
  }, []);

  const fetchCsvData = useCallback(async (preset: DatasetPreset) => {
    setRawData({
      ...INITIAL_RAW_DATA_STATE,
      loading: true,
    });
    setSchema(null);
    setFallbackDate(null);

    try {
      const response = await fetch(preset.csvUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      const { data, delimiter, headers } = parseCsvText(text);

      setRawData({
        loading: false,
        error: null,
        data,
        delimiter,
        headers,
        rowCount: data.length,
        isFallback: false,
      });

      // Analyze schema
      const detectedSchema = analyzeSchema(data, headers);
      setSchema(detectedSchema);
    } catch (error) {
      console.error('Error fetching live CSV:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isCorsError =
        errorMessage.includes('CORS') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('NetworkError');

      // Try fallback snapshot
      console.log('Attempting to load fallback snapshot...');
      const fallback = await loadFallbackSnapshot(preset.id);

      if (fallback) {
        const { data, delimiter, headers } = parseCsvText(fallback.csv);
        setFallbackDate(fallback.captured);

        setRawData({
          loading: false,
          error: null,
          data,
          delimiter,
          headers,
          rowCount: data.length,
          isFallback: true,
        });

        // Analyze schema
        const detectedSchema = analyzeSchema(data, headers);
        setSchema(detectedSchema);
      } else {
        // No fallback available, show error
        setRawData({
          loading: false,
          error: isCorsError ? 'CORS' : errorMessage,
          data: null,
          delimiter: ',',
          headers: [],
          rowCount: 0,
          isFallback: false,
        });
      }
    }
  }, [parseCsvText, loadFallbackSnapshot]);

  // Fetch data when preset changes
  useEffect(() => {
    if (selectedPreset) {
      fetchCsvData(selectedPreset);
    } else {
      setRawData(INITIAL_RAW_DATA_STATE);
      setSchema(null);
    }
  }, [selectedPreset, fetchCsvData]);

  const handlePresetClick = (preset: DatasetPreset) => {
    setSelectedPreset(preset);
  };

  const getChartIcon = (chartType: DatasetPreset['recommendedChart']) => {
    switch (chartType) {
      case 'line':
        return <TrendingUp className='h-4 w-4' />;
      case 'bar':
        return <BarChart2 className='h-4 w-4' />;
      case 'multi-line':
        return <LineChart className='h-4 w-4' />;
      default:
        return <BarChart3 className='h-4 w-4' />;
    }
  };

  // Get preview rows (first 8-12)
  const previewRows = rawData.data?.slice(0, 10) || [];

  // Determine recommended chart type from schema
  const recommendedChartType = useMemo(() => determineChartType(schema), [schema]);

  // Active chart type (user selection or recommendation)
  const activeChartType = selectedChartType || recommendedChartType;

  // Transform data for chart rendering
  const chartData = useMemo(() => {
    if (!rawData.data || !schema || rawData.data.length === 0) {
      return [];
    }

    // Transform data - convert Serbian decimal format and handle null values
    return rawData.data.map((row) => {
      const transformed: Record<string, string | number> = {};

      // Copy all fields with proper type conversion
      for (const [key, value] of Object.entries(row)) {
        if (value === null || value === undefined || value === '') {
          transformed[key] = 0;
        } else if (schema.measures.includes(key)) {
          // Convert Serbian decimal format (comma to dot)
          const numStr = String(value).replace(',', '.');
          const parsed = parseFloat(numStr);
          transformed[key] = isNaN(parsed) ? 0 : parsed;
        } else {
          transformed[key] = String(value);
        }
      }

      return transformed;
    });
  }, [rawData.data, schema]);

  // Get X-axis field (time field or first dimension)
  const xAxisField = useMemo(() => {
    if (!schema) return null;
    if (schema.timeField) return schema.timeField;
    if (schema.dimensions.length > 0) return schema.dimensions[0];
    return null;
  }, [schema]);

  // Get measure fields for Y-axis
  const measureFields = useMemo(() => {
    if (!schema) return [];
    return schema.measures.slice(0, 3); // Limit to 3 measures for readability
  }, [schema]);

  // Reset chart type when preset changes
  useEffect(() => {
    setSelectedChartType(null);
  }, [selectedPreset?.id]);

  // Generate copyable code
  const generatedCode = useMemo(() => {
    if (!selectedPreset || !schema || !xAxisField || measureFields.length === 0) {
      return '';
    }

    const csvUrl = selectedPreset.csvUrl;
    const delimiterCode =
      rawData.delimiter === ';' ? "';'" : rawData.delimiter === '\t' ? "'\\t'" : "','";
    const primaryMeasure = measureFields[0];

    // Generate measure field transformations for code
    const measureTransforms = measureFields
      .map((f) => `"${f}": parseFloat(String(row["${f}"] || '0').replace(',', '.')) || 0`)
      .join(',\n          ');

    if (activeChartType === 'bar') {
      return `/**
 * Bar Chart for ${selectedPreset.title}
 *
 * Generated for dataset: ${selectedPreset.csvUrl}
 *
 * OPTION 1: Using Recharts (full-featured)
 * OPTION 2: Using @vizualni/react (see below)
 */
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Papa from 'papaparse';

const GOV_BLUE = '#0D4077';

export default function DatasetChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('${csvUrl}')
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.text();
      })
      .then((csvText) => {
        // Parse CSV with detected delimiter
        const result = Papa.parse(csvText, {
          header: true,
          delimiter: ${delimiterCode},
          skipEmptyLines: true,
        });

        // Transform data - convert Serbian decimal format
        const transformed = result.data.map((row) => ({
          ...row,
          // Convert comma decimals to dots for numeric fields
          ${measureTransforms}
        }));

        setData(transformed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading data...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;
  if (data.length === 0) return <div style={{ padding: '2rem' }}>No data available</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="${xAxisField}"
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fontSize: 12 }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem'
          }}
        />
        <Bar
          dataKey="${primaryMeasure}"
          fill={GOV_BLUE}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ============================================================
 * OPTION 2: Using @vizualni/react
 *
 * import { BarChart } from '@vizualni/react';
 *
 * const config = {
 *   type: 'bar',
 *   x: { field: '${xAxisField}', type: 'band' },
 *   y: { field: '${primaryMeasure}', type: 'number' },
 * };
 *
 * <BarChart data={data} config={config} width={600} height={400} />
 *
 * Note: @vizualni/react provides lightweight, accessible chart
 * components. For advanced features (ResponsiveContainer, tooltips,
 * etc.), use Recharts or wrap @vizualni/react with your own logic.
 * ============================================================ */`;
    }

    if (activeChartType === 'multi-line' && measureFields.length >= 2) {
      const lineComponents = measureFields
        .slice(0, 3)
        .map(
          (f, i) =>
            `<Line type="monotone" dataKey="${f}" stroke={COLORS[${i}]} strokeWidth={2} dot={false} />`
        )
        .join('\n        ');

      return `/**
 * Multi-Line Chart for ${selectedPreset.title}
 *
 * Generated for dataset: ${selectedPreset.csvUrl}
 *
 * OPTION 1: Using Recharts (full-featured)
 * OPTION 2: Using @vizualni/react (see below)
 */
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import Papa from 'papaparse';

const COLORS = ${JSON.stringify(CHART_COLORS.slice(0, measureFields.length))};

export default function DatasetChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('${csvUrl}')
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.text();
      })
      .then((csvText) => {
        const result = Papa.parse(csvText, {
          header: true,
          delimiter: ${delimiterCode},
          skipEmptyLines: true,
        });

        const transformed = result.data.map((row) => ({
          ...row,
          ${measureTransforms}
        }));

        setData(transformed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading data...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;
  if (data.length === 0) return <div style={{ padding: '2rem' }}>No data available</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="${xAxisField}" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem'
          }}
        />
        <Legend />
        ${lineComponents}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ============================================================
 * OPTION 2: Using @vizualni/react
 *
 * import { LineChart } from '@vizualni/react';
 *
 * const config = {
 *   type: 'line',
 *   x: { field: '${xAxisField}', type: 'date' },
 *   y: { field: '${primaryMeasure}', type: 'number' },
 * };
 *
 * <LineChart data={data} config={config} width={600} height={400} />
 *
 * Note: For multi-line charts, you currently need to render
 * multiple LineChart components or use Recharts directly.
 * @vizualni/react is best for simple single-series charts.
 * ============================================================ */`;
    }

    // Single line chart (default)
    return `/**
 * Line Chart for ${selectedPreset.title}
 *
 * Generated for dataset: ${selectedPreset.csvUrl}
 *
 * OPTION 1: Using Recharts (full-featured)
 * OPTION 2: Using @vizualni/react (see below)
 */
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Papa from 'papaparse';

const GOV_BLUE = '#0D4077';

export default function DatasetChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('${csvUrl}')
      .then((res) => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.text();
      })
      .then((csvText) => {
        const result = Papa.parse(csvText, {
          header: true,
          delimiter: ${delimiterCode},
          skipEmptyLines: true,
        });

        const transformed = result.data.map((row) => ({
          ...row,
          "${primaryMeasure}": parseFloat(String(row["${primaryMeasure}"] || '0').replace(',', '.')) || 0
        }));

        setData(transformed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading data...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;
  if (data.length === 0) return <div style={{ padding: '2rem' }}>No data available</div>;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="${xAxisField}" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem'
          }}
        />
        <Line
          type="monotone"
          dataKey="${primaryMeasure}"
          stroke={GOV_BLUE}
          strokeWidth={2}
          dot={{ fill: GOV_BLUE, strokeWidth: 2, r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ============================================================
 * OPTION 2: Using @vizualni/react
 *
 * import { LineChart } from '@vizualni/react';
 *
 * const config = {
 *   type: 'line',
 *   x: { field: '${xAxisField}', type: 'date' },
 *   y: { field: '${primaryMeasure}', type: 'number' },
 * };
 *
 * <LineChart data={data} config={config} width={600} height={400} />
 *
 * Note: @vizualni/react provides lightweight, accessible chart
 * components. For advanced features (ResponsiveContainer, tooltips,
 * etc.), use Recharts or wrap @vizualni/react with your own logic.
 * ============================================================ */`;
  }, [selectedPreset, schema, xAxisField, measureFields, activeChartType, rawData.delimiter]);

  // Copy code to clipboard
  const handleCopyCode = useCallback(async () => {
    if (!generatedCode) return;

    try {
      await navigator.clipboard.writeText(generatedCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [generatedCode]);

  // Render chart based on type
  const renderChart = () => {
    if (!chartData.length || !xAxisField || measureFields.length === 0) {
      return (
        <div className='flex items-center justify-center h-64 text-slate-500'>
          {t.chartNoData}
        </div>
      );
    }

    // Limit data for performance
    const displayData = chartData.length > 100 ? chartData.slice(-100) : chartData;

    if (activeChartType === 'bar') {
      return (
        <ResponsiveContainer width='100%' height={350}>
          <RechartsBarChart
            data={displayData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis
              dataKey={xAxisField}
              angle={-45}
              textAnchor='end'
              height={60}
              tick={{ fontSize: 11 }}
              interval='preserveStartEnd'
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '12px',
              }}
            />
            <Bar dataKey={measureFields[0]} fill={GOV_BLUE} radius={[4, 4, 0, 0]} />
          </RechartsBarChart>
        </ResponsiveContainer>
      );
    }

    if (activeChartType === 'multi-line' && measureFields.length >= 2) {
      return (
        <ResponsiveContainer width='100%' height={350}>
          <RechartsLineChart
            data={displayData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis dataKey={xAxisField} tick={{ fontSize: 11 }} interval='preserveStartEnd' />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '12px',
              }}
            />
            <Legend />
            {measureFields.slice(0, 3).map((field, idx) => (
              <Line
                key={field}
                type='monotone'
                dataKey={field}
                stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      );
    }

    // Single line chart
    return (
      <ResponsiveContainer width='100%' height={350}>
        <RechartsLineChart
          data={displayData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
          <XAxis dataKey={xAxisField} tick={{ fontSize: 11 }} interval='preserveStartEnd' />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              fontSize: '12px',
            }}
          />
          <Line
            type='monotone'
            dataKey={measureFields[0]}
            stroke={GOV_BLUE}
            strokeWidth={2}
            dot={{ fill: GOV_BLUE, strokeWidth: 2, r: 3 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    );
  };

  const alternatives = getAlternativeChartTypes(activeChartType);

  return (
    <main className='min-h-screen bg-slate-50 py-8' lang={locale}>
      <div className='container-custom'>
        {/* Page Header */}
        <header className='mb-8'>
          <h1 className='text-3xl font-bold text-gov-primary mb-2'>{t.title}</h1>
          <p className='text-slate-600 text-lg'>{t.subtitle}</p>
        </header>

        {/* Fallback Data Banner */}
        {rawData.isFallback && (
          <div
            className='mb-6 p-4 rounded-lg border-2 border-amber-300 bg-amber-50'
            role='alert'
          >
            <div className='flex items-start gap-3'>
              <AlertTriangle className='h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5' />
              <div>
                <p className='font-semibold text-amber-800'>{t.fallbackBannerTitle}</p>
                <p className='text-sm text-amber-700 mt-1'>
                  {t.fallbackBannerMessage}{' '}
                  <span className='font-medium'>{fallbackDate || t.fallbackBannerDate}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Demo Layout: 2 columns on desktop */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Left Column */}
          <div className='space-y-6'>
            {/* Panel 1: Dataset Picker */}
            <section
              className='bg-white rounded-lg border border-slate-200 p-6'
              aria-labelledby='dataset-picker-heading'
            >
              <h2
                id='dataset-picker-heading'
                className='flex items-center gap-2 text-lg font-semibold text-gov-primary mb-2'
              >
                <Database className='h-5 w-5' />
                {t.panelDatasetPicker}
              </h2>
              <p className='text-slate-500 text-sm mb-4'>{t.presetsDescription}</p>

              {/* Dataset Preset Cards */}
              <div className='space-y-3'>
                {DATASET_PRESETS.map((preset) => {
                  const labels = getPresetLabels(preset, t);
                  const isSelected = selectedPreset?.id === preset.id;

                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gov-primary focus:ring-offset-2 ${
                        isSelected
                          ? 'border-gov-primary bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-gov-secondary hover:bg-slate-50'
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className='flex items-start justify-between gap-3'>
                        <div className='flex-1 min-w-0'>
                          {/* Category Label */}
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
                              {labels.categoryLabel}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className='h-4 w-4 text-gov-primary flex-shrink-0' />
                            )}
                          </div>
                          {/* Title */}
                          <h3 className='font-medium text-slate-900 text-sm mb-1 line-clamp-2'>
                            {preset.title}
                          </h3>
                          {/* Description */}
                          <p className='text-slate-500 text-xs mb-2'>
                            {labels.categoryDescription}
                          </p>
                          {/* Recommended Chart */}
                          <div className='flex items-center gap-1.5 text-xs text-slate-600'>
                            <span className='font-medium'>{t.recommendedChart}:</span>
                            <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100'>
                              {getChartIcon(preset.recommendedChart)}
                              {getChartTypeLabel(preset.recommendedChart, t)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Panel 2: Dataset Metadata */}
            <section
              className='bg-white rounded-lg border border-slate-200 p-6'
              aria-labelledby='metadata-heading'
            >
              <h2
                id='metadata-heading'
                className='flex items-center gap-2 text-lg font-semibold text-gov-primary mb-4'
              >
                <FileJson className='h-5 w-5' />
                {t.panelMetadata}
              </h2>

              {selectedPreset ? (
                <div className='space-y-4'>
                  {/* Selected Dataset Title */}
                  <div>
                    <span className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                      {t.metadataSelectedDataset}
                    </span>
                    <h3 className='font-medium text-slate-900 mt-1'>{selectedPreset.title}</h3>
                  </div>

                  {/* Metadata Grid */}
                  <dl className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {/* Dataset ID */}
                    <div>
                      <dt className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                        {t.metadataId}
                      </dt>
                      <dd className='mt-1 font-mono text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded'>
                        {selectedPreset.datasetId}
                      </dd>
                    </div>

                    {/* Organization */}
                    <div>
                      <dt className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                        {t.metadataOrganization}
                      </dt>
                      <dd className='mt-1 text-sm text-slate-700'>
                        {inferOrganization(selectedPreset.csvUrl)}
                      </dd>
                    </div>

                    {/* Format */}
                    <div>
                      <dt className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                        {t.metadataFormat}
                      </dt>
                      <dd className='mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        CSV
                      </dd>
                    </div>

                    {/* Last Updated */}
                    <div>
                      <dt className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                        {t.metadataLastUpdated}
                      </dt>
                      <dd className='mt-1 text-sm text-slate-500 italic'>
                        {t.metadataNotAvailable}
                      </dd>
                    </div>
                  </dl>

                  {/* Resource URL */}
                  <div>
                    <dt className='text-xs font-medium text-slate-500 uppercase tracking-wide mb-2'>
                      {t.metadataSource}
                    </dt>
                    <dd>
                      <a
                        href={selectedPreset.csvUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-gov-secondary hover:text-gov-primary transition-colors break-all font-mono text-xs hover:underline'
                      >
                        {selectedPreset.csvUrl}
                      </a>
                    </dd>
                  </div>

                  {/* Link to data.gov.rs */}
                  <a
                    href={`https://data.gov.rs/sr/datasets/${selectedPreset.datasetId}/`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 text-gov-secondary hover:text-gov-primary transition-colors text-sm font-medium'
                  >
                    <ExternalLink className='h-4 w-4' />
                    {t.metadataViewOnDataGov}
                  </a>
                </div>
              ) : (
                <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                  <p className='text-slate-500 font-medium'>{t.metadataNoSelection}</p>
                  <p className='text-slate-400 text-sm mt-1'>{t.metadataNoSelectionHint}</p>
                </div>
              )}
            </section>

            {/* Panel 3: Raw Preview */}
            <section
              className='bg-white rounded-lg border border-slate-200 p-6'
              aria-labelledby='raw-preview-heading'
            >
              <h2
                id='raw-preview-heading'
                className='flex items-center gap-2 text-lg font-semibold text-gov-primary mb-4'
              >
                <Table className='h-5 w-5' />
                {t.panelRawPreview}
              </h2>

              {rawData.loading ? (
                <div className='flex items-center justify-center py-12'>
                  <Loader2 className='h-6 w-6 animate-spin text-gov-primary' />
                  <span className='ml-2 text-slate-600'>{t.rawPreviewLoading}</span>
                </div>
              ) : rawData.error ? (
                <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                  <div className='flex items-start gap-3'>
                    <AlertTriangle className='h-5 w-5 text-red-500 flex-shrink-0 mt-0.5' />
                    <div>
                      <p className='font-medium text-red-800'>
                        {rawData.error === 'CORS' ? t.rawPreviewCorsError : t.rawPreviewError}
                      </p>
                      {rawData.error !== 'CORS' && (
                        <p className='text-sm text-red-600 mt-1'>{rawData.error}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : rawData.data && rawData.data.length > 0 ? (
                <div className='space-y-4'>
                  {/* Stats row */}
                  <div className='flex flex-wrap gap-4 text-sm'>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-slate-500'>{t.rawPreviewDelimiter}:</span>
                      <code className='bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs'>
                        {rawData.delimiter === ';'
                          ? 'semicolon (;)'
                          : rawData.delimiter === '\t'
                            ? 'tab'
                            : 'comma (,)'}
                      </code>
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-slate-500'>{t.rawPreviewResourceHost}:</span>
                      <code className='bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs'>
                        {getHostFromUrl(selectedPreset?.csvUrl || '')}
                      </code>
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-slate-500'>{t.rawPreviewRowCount}:</span>
                      <code className='bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs'>
                        {rawData.rowCount.toLocaleString()}
                      </code>
                    </div>
                  </div>

                  {/* Headers */}
                  <div>
                    <span className='text-xs font-medium text-slate-500 uppercase tracking-wide'>
                      {t.rawPreviewHeaders} ({rawData.headers.length})
                    </span>
                    <div className='flex flex-wrap gap-1.5 mt-2'>
                      {rawData.headers.map((header, idx) => (
                        <span
                          key={idx}
                          className='inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200'
                        >
                          <Tag className='h-3 w-3' />
                          {header}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-xs'>
                      <thead>
                        <tr className='bg-slate-100'>
                          {rawData.headers.map((header, idx) => (
                            <th
                              key={idx}
                              className='px-3 py-2 text-left font-medium text-slate-700 whitespace-nowrap'
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-slate-200'>
                        {previewRows.map((row, rowIdx) => (
                          <tr key={rowIdx} className='hover:bg-slate-50'>
                            {rawData.headers.map((header, colIdx) => (
                              <td
                                key={colIdx}
                                className='px-3 py-2 text-slate-600 whitespace-nowrap max-w-[200px] truncate'
                                title={String(row[header] ?? '')}
                              >
                                {String(row[header] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {rawData.rowCount > 10 && (
                    <p className='text-xs text-slate-400 italic'>
                      {t.rawPreviewShowingRows.replace('{count}', rawData.rowCount.toLocaleString())}
                    </p>
                  )}
                </div>
              ) : (
                <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                  <p className='text-slate-500'>{t.rawPreviewNoSelection}</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            {/* Panel 4: Parsed Schema */}
            <section
              className='bg-white rounded-lg border border-slate-200 p-6'
              aria-labelledby='schema-heading'
            >
              <h2
                id='schema-heading'
                className='flex items-center gap-2 text-lg font-semibold text-gov-primary mb-4'
              >
                <Settings2 className='h-5 w-5' />
                {t.panelSchema}
              </h2>

              {rawData.loading ? (
                <div className='flex items-center justify-center py-12'>
                  <Loader2 className='h-6 w-6 animate-spin text-gov-primary' />
                  <span className='ml-2 text-slate-600'>{t.schemaLoading}</span>
                </div>
              ) : schema ? (
                <div className='space-y-4'>
                  {/* Dimensions */}
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <Tag className='h-4 w-4 text-blue-600' />
                      <span className='text-sm font-medium text-slate-700'>
                        {t.schemaDimensions} ({schema.dimensions.length})
                      </span>
                    </div>
                    <div className='flex flex-wrap gap-1.5'>
                      {schema.dimensions.map((dim, idx) => (
                        <span
                          key={idx}
                          className='inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200'
                        >
                          {dim}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Measures */}
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <Hash className='h-4 w-4 text-green-600' />
                      <span className='text-sm font-medium text-slate-700'>
                        {t.schemaMeasures} ({schema.measures.length})
                      </span>
                    </div>
                    <div className='flex flex-wrap gap-1.5'>
                      {schema.measures.map((measure, idx) => (
                        <span
                          key={idx}
                          className='inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-50 text-green-700 border border-green-200'
                        >
                          {measure}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Time Field */}
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <Clock className='h-4 w-4 text-purple-600' />
                      <span className='text-sm font-medium text-slate-700'>
                        {t.schemaTimeField}
                      </span>
                    </div>
                    {schema.timeField ? (
                      <span className='inline-flex items-center px-2 py-0.5 rounded text-xs bg-purple-50 text-purple-700 border border-purple-200'>
                        {schema.timeField}
                      </span>
                    ) : (
                      <span className='text-sm text-slate-400 italic'>
                        {t.metadataNotAvailable}
                      </span>
                    )}
                  </div>

                  {/* Geo Field */}
                  <div>
                    <div className='flex items-center gap-2 mb-2'>
                      <MapPin className='h-4 w-4 text-orange-600' />
                      <span className='text-sm font-medium text-slate-700'>
                        {t.schemaGeoField}
                      </span>
                    </div>
                    {schema.geoField ? (
                      <span className='inline-flex items-center px-2 py-0.5 rounded text-xs bg-orange-50 text-orange-700 border border-orange-200'>
                        {schema.geoField}
                      </span>
                    ) : (
                      <span className='text-sm text-slate-400 italic'>
                        {t.metadataNotAvailable}
                      </span>
                    )}
                  </div>

                  {/* Warnings */}
                  {schema.warnings.length > 0 && (
                    <div className='rounded-lg border border-amber-200 bg-amber-50 p-3'>
                      <div className='flex items-center gap-2 mb-2'>
                        <AlertTriangle className='h-4 w-4 text-amber-600' />
                        <span className='text-sm font-medium text-amber-800'>
                          {t.schemaWarnings}
                        </span>
                      </div>
                      <ul className='space-y-1'>
                        {schema.warnings.map((warning, idx) => (
                          <li key={idx} className='text-xs text-amber-700'>
                            {getSchemaWarningText(warning, t)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Column Count Summary */}
                  <div className='pt-3 border-t border-slate-200'>
                    <p className='text-xs text-slate-500'>
                      {t.schemaDetectedColumns}: {schema.dimensions.length + schema.measures.length}{' '}
                      total
                    </p>
                  </div>
                </div>
              ) : rawData.error ? (
                <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                  <p className='text-slate-500'>{t.schemaNoData}</p>
                </div>
              ) : (
                <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                  <p className='text-slate-500'>{t.schemaNoSelection}</p>
                </div>
              )}
            </section>

            {/* Panel 5: Chart Output */}
            <section
              className='bg-white rounded-lg border border-slate-200 p-6'
              aria-labelledby='chart-output-heading'
            >
              <h2
                id='chart-output-heading'
                className='flex items-center gap-2 text-lg font-semibold text-gov-primary mb-4'
              >
                <BarChart3 className='h-5 w-5' />
                {t.panelChartOutput}
              </h2>

              {rawData.loading ? (
                <div className='flex items-center justify-center py-12'>
                  <Loader2 className='h-6 w-6 animate-spin text-gov-primary' />
                  <span className='ml-2 text-slate-600'>{t.schemaLoading}</span>
                </div>
              ) : schema && chartData.length > 0 ? (
                <div className='space-y-4'>
                  {/* Recommendation */}
                  <div className='flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200'>
                    <TrendingUp className='h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0' />
                    <p className='text-sm text-blue-800'>
                      {t[getRecommendationKey(activeChartType)]}
                    </p>
                  </div>

                  {/* Chart Type Switcher */}
                  <div className='flex flex-wrap gap-2'>
                    <button
                      onClick={() => setSelectedChartType(null)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        !selectedChartType
                          ? 'bg-gov-primary text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {getChartIcon(activeChartType)}
                      {getChartTypeLabel(activeChartType, t)}
                    </button>
                    {alternatives.map((alt) => (
                      <button
                        key={alt}
                        onClick={() => setSelectedChartType(alt)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedChartType === alt
                            ? 'bg-gov-primary text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {getChartIcon(alt)}
                        {getChartTypeLabel(alt, t)}
                      </button>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className='border border-slate-200 rounded-lg bg-white'>
                    {renderChart()}
                  </div>

                  {/* Data info */}
                  <p className='text-xs text-slate-500 text-center'>
                    {chartData.length > 100
                      ? `Showing last 100 of ${chartData.length.toLocaleString()} data points`
                      : `${chartData.length.toLocaleString()} data points`}
                  </p>
                </div>
              ) : rawData.error ? (
                <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                  <div className='flex items-start gap-3'>
                    <AlertTriangle className='h-5 w-5 text-red-500 flex-shrink-0 mt-0.5' />
                    <div>
                      <p className='font-medium text-red-800'>{t.chartRenderError}</p>
                      <p className='text-sm text-red-600 mt-1'>
                        {rawData.error === 'CORS' ? t.rawPreviewCorsError : rawData.error}
                      </p>
                    </div>
                  </div>
                </div>
              ) : selectedPreset ? (
                <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                  <p className='text-slate-500'>{t.chartNoData}</p>
                </div>
              ) : (
                <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                  <p className='text-slate-500'>{t.chartNoSelection}</p>
                </div>
              )}
            </section>

            {/* Panel 6: Copyable Code */}
            <section
              className='bg-white rounded-lg border border-slate-200 p-6'
              aria-labelledby='code-heading'
            >
              <div className='flex items-center justify-between mb-4'>
                <h2
                  id='code-heading'
                  className='flex items-center gap-2 text-lg font-semibold text-gov-primary'
                >
                  <Code2 className='h-5 w-5' />
                  {t.panelCode}
                </h2>
                {generatedCode && (
                  <button
                    onClick={handleCopyCode}
                    className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gov-primary text-white hover:bg-gov-secondary transition-colors'
                  >
                    {codeCopied ? (
                      <>
                        <Check className='h-4 w-4' />
                        {t.codeCopied}
                      </>
                    ) : (
                      <>
                        <Copy className='h-4 w-4' />
                        {t.codeCopyButton}
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className='mb-3'>
                <h3 className='text-sm font-medium text-slate-700 mb-1'>{t.codeTitle}</h3>
                <p className='text-xs text-slate-500'>{t.codeDescription}</p>
              </div>

              {generatedCode ? (
                <div className='relative'>
                  <pre className='bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs font-mono leading-relaxed max-h-[500px] overflow-y-auto'>
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              ) : selectedPreset ? (
                <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                  <p className='text-slate-500'>{t.codeNoData}</p>
                </div>
              ) : (
                <div className='rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center'>
                  <p className='text-slate-500'>{t.codeNoSelection}</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
