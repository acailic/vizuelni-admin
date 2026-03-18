/**
 * Demo Dataset Loader
 *
 * Loads demo datasets from JSON files and normalizes them to BrowseDataset format.
 * Provides offline fallback when the external data.gov.rs API is unavailable.
 */

import type {
  BrowseDataset,
  BrowseOrganization,
  BrowseResource,
  BrowsePageResponse,
  BrowseSearchParams,
} from '@/types/browse';
import type {
  ParsedDataset,
  Observation,
  DimensionMeta,
  MeasureMeta,
} from '@/types/observation';

/**
 * Demo resource format matching BrowseResource
 */
export interface DemoResource {
  id: string;
  title: string;
  format: string;
  url: string;
  filesize?: number;
  description?: string;
}

/**
 * Demo dataset format (internal representation)
 */
export interface DemoDataset {
  id: string;
  title: string;
  description: string;
  organization: { name: string; slug: string };
  topic: string;
  tags: string[];
  resources: DemoResource[];
  last_modified: string;
  page?: string;
  data: Record<string, unknown>[];
}

// Cache for loaded demo datasets
let demoDatasetsCache: DemoDataset[] | null = null;

/**
 * Load all demo datasets from JSON files
 * Uses caching to avoid repeated filesystem reads
 */
function loadAllDemoDatasets(): DemoDataset[] {
  if (demoDatasetsCache) {
    return demoDatasetsCache;
  }

  // Import all demo catalog JSON files
  const demoFiles = [
    require('@/data/demo-catalog/demo-demographics.json'),
    require('@/data/demo-catalog/demo-gdp.json'),
    require('@/data/demo-catalog/demo-inflation.json'),
    require('@/data/demo-catalog/demo-cancer.json'),
    require('@/data/demo-catalog/demo-air-quality.json'),
    require('@/data/demo-catalog/demo-education.json'),
    require('@/data/demo-catalog/demo-budget.json'),
    require('@/data/demo-catalog/demo-emigration.json'),
    require('@/data/demo-catalog/demo-transport.json'),
    require('@/data/demo-catalog/demo-vital.json'),
  ];

  demoDatasetsCache = demoFiles as DemoDataset[];
  return demoDatasetsCache;
}

/**
 * Clear the demo datasets cache (useful for testing)
 */
export function clearDemoDatasetsCache(): void {
  demoDatasetsCache = null;
}

/**
 * Normalize a DemoDataset to BrowseDataset format for UI compatibility
 */
export function toBrowseDataset(demo: DemoDataset): BrowseDataset {
  const organization: BrowseOrganization = {
    id: demo.organization.slug,
    name: demo.organization.name,
    slug: demo.organization.slug,
  };

  const resources: BrowseResource[] = demo.resources.map((r) => ({
    id: r.id,
    title: r.title,
    format: r.format,
    url: r.url,
    filesize: r.filesize ?? null,
    description: r.description ?? null,
    mime: null,
    last_modified: null,
  }));

  // Include topic as first tag if not already present
  const tags = demo.tags.includes(demo.topic)
    ? demo.tags
    : [demo.topic, ...demo.tags];

  return {
    id: demo.id,
    slug: demo.id,
    title: demo.title,
    description: demo.description,
    created_at: '2024-01-01', // Default creation date for demo datasets
    last_modified: demo.last_modified,
    organization,
    resources,
    tags,
    page: demo.page,
    uri: undefined,
    frequency: null,
    license: null,
    temporal_coverage: null,
    spatial: null,
  };
}

/**
 * Check if a dataset matches the search query
 */
function matchesQuery(dataset: DemoDataset, query: string): boolean {
  const searchTerms = query.toLowerCase().split(/\s+/).filter(Boolean);

  const searchableText = [
    dataset.title,
    dataset.description,
    ...dataset.tags,
    dataset.topic,
    dataset.organization.name,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchTerms.every((term) => searchableText.includes(term));
}

/**
 * Check if a dataset has a resource with the specified format
 */
function hasFormat(dataset: DemoDataset, format: string): boolean {
  const formatLower = format.toLowerCase();
  return dataset.resources.some((r) => r.format.toLowerCase() === formatLower);
}

/**
 * Sort datasets by the specified field
 */
function sortDatasets(datasets: DemoDataset[], sort: string): DemoDataset[] {
  const sorted = [...datasets];

  if (sort === 'title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === '-last_update' || sort === '-last_modified') {
    sorted.sort((a, b) => {
      const dateA = a.last_modified || '1970-01-01';
      const dateB = b.last_modified || '1970-01-01';
      return dateB.localeCompare(dateA); // Descending (newest first)
    });
  }

  return sorted;
}

/**
 * Load and filter demo datasets with pagination
 */
export function loadDemoDatasetList(
  params: BrowseSearchParams
): BrowsePageResponse<BrowseDataset> {
  const {
    q,
    page = 1,
    pageSize = 12,
    organization,
    topic,
    format,
    sort = '-last_update',
  } = params;

  let datasets = loadAllDemoDatasets();

  // Filter by search query
  if (q) {
    datasets = datasets.filter((d) => matchesQuery(d, q));
  }

  // Filter by topic (matches against tags)
  if (topic) {
    datasets = datasets.filter((d) => d.tags.includes(topic));
  }

  // Filter by organization
  if (organization) {
    datasets = datasets.filter((d) => d.organization.slug === organization);
  }

  // Filter by format
  if (format) {
    datasets = datasets.filter((d) => hasFormat(d, format));
  }

  // Sort datasets
  datasets = sortDatasets(datasets, sort);

  // Calculate pagination
  const total = datasets.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedDatasets = datasets.slice(startIndex, endIndex);

  // Normalize to BrowseDataset format
  const data = paginatedDatasets.map(toBrowseDataset);

  return {
    data,
    page,
    page_size: pageSize,
    total,
    next_page: endIndex < total ? `${page + 1}` : null,
    previous_page: page > 1 ? `${page - 1}` : null,
  };
}

/**
 * Get a single demo dataset by ID
 */
export function loadDemoDataset(id: string): BrowseDataset | null {
  const datasets = loadAllDemoDatasets();
  const dataset = datasets.find((d) => d.id === id);

  if (!dataset) {
    return null;
  }

  return toBrowseDataset(dataset);
}

/**
 * Get the raw demo dataset data by ID (includes embedded data)
 */
export function loadDemoDatasetWithData(
  id: string
): (DemoDataset & { browseData: BrowseDataset }) | null {
  const datasets = loadAllDemoDatasets();
  const dataset = datasets.find((d) => d.id === id);

  if (!dataset) {
    return null;
  }

  return {
    ...dataset,
    browseData: toBrowseDataset(dataset),
  };
}

/**
 * Get all unique topics from demo datasets
 */
export function getDemoTopics(): { value: string; label: string }[] {
  const datasets = loadAllDemoDatasets();
  const topicSet = new Set<string>();

  datasets.forEach((d) => {
    topicSet.add(d.topic);
    d.tags.forEach((t) => topicSet.add(t));
  });

  return Array.from(topicSet)
    .sort()
    .map((topic) => ({
      value: topic,
      label: topic.charAt(0).toUpperCase() + topic.slice(1),
    }));
}

/**
 * Convert a DemoDataset's embedded data array to ParsedDataset format
 * for use in the preview panel without making any network requests.
 */
export function convertDemoDataToParsedDataset(demo: DemoDataset): ParsedDataset {
  const observations = demo.data as Observation[];

  if (observations.length === 0) {
    return {
      observations: [],
      columns: [],
      dimensions: [],
      measures: [],
      metadataColumns: [],
      rowCount: 0,
      source: { format: 'json', fetchedAt: new Date().toISOString() },
    };
  }

  const columns = Object.keys(observations[0]);
  const dimensions: DimensionMeta[] = [];
  const measures: MeasureMeta[] = [];

  for (const col of columns) {
    const values = observations.map((o) => o[col]);
    const numericValues = values.filter((v) => typeof v === 'number') as number[];
    const isNumeric = numericValues.length > values.length * 0.5;

    if (isNumeric) {
      measures.push({
        key: col,
        label: col,
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        hasNulls: values.some((v) => v == null),
      });
    } else {
      const uniqueValues = [
        ...new Set(values.filter((v) => v != null).map(String)),
      ];
      dimensions.push({
        key: col,
        label: col,
        type: 'categorical',
        values: uniqueValues,
        cardinality: uniqueValues.length,
      });
    }
  }

  return {
    observations,
    columns,
    dimensions,
    measures,
    metadataColumns: [],
    rowCount: observations.length,
    source: {
      format: 'json',
      fetchedAt: new Date().toISOString(),
      name: demo.title,
    },
  };
}

/**
 * Get all unique organizations from demo datasets
 */
export function getDemoOrganizations(): {
  value: string;
  label: string;
}[] {
  const datasets = loadAllDemoDatasets();
  const orgMap = new Map<string, string>();

  datasets.forEach((d) => {
    if (!orgMap.has(d.organization.slug)) {
      orgMap.set(d.organization.slug, d.organization.name);
    }
  });

  return Array.from(orgMap.entries())
    .map(([slug, name]) => ({
      value: slug,
      label: name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
