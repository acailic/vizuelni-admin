import { loadDatasetFromUrl } from '@/lib/data';
import type {
  BrowseDataset,
  BrowseFacets,
  BrowsePageResponse,
  BrowseResource,
  BrowseSearchParams,
  BrowseTopic,
  FacetOption,
} from '@/types/browse';
import type { ParsedDataset } from '@/types/observation';

const DATA_GOV_BASE_URL =
  process.env.NEXT_PUBLIC_DATA_GOV_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://data.gov.rs/api/1';

const CACHE_TTL_MS = 60 * 60 * 1000;
const ORGANIZATION_PAGE_SIZE = 100;
const PREVIEWABLE_FORMATS = new Set(['csv', 'json']);
const PREVIEW_HOSTS = new Set([
  'data.gov.rs',
  'stats.data.gov.rs',
  'opendata.stat.gov.rs',
]);
const PREVIEW_FORMAT_PRIORITY: Record<string, number> = {
  csv: 0,
  json: 1,
};

interface CachedValue<T> {
  data: T;
  timestamp: number;
}

interface BrowseOrganizationRecord {
  id: string;
  name: string;
  slug: string;
  metrics?: {
    datasets?: number;
  };
}

interface FrequencyRecord {
  id: string;
  label: string;
}

type StaticFacets = Omit<BrowseFacets, 'formats'>;

function uniqueFacetOptions(values: string[]) {
  return [...new Set(values.filter(Boolean))]
    .sort((left, right) => left.localeCompare(right))
    .map((value) => ({
      value,
      label: value.toUpperCase(),
    }));
}

function buildApiUrl(
  path: string,
  params?: Record<string, string | number | undefined>
) {
  const url = new URL(
    path,
    DATA_GOV_BASE_URL.endsWith('/')
      ? DATA_GOV_BASE_URL
      : `${DATA_GOV_BASE_URL}/`
  );

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

function toPreviewValue(value: ParsedDataset['observations'][number][string]) {
  if (value == null) {
    return '';
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value);
}

export function buildPreviewRows(dataset: ParsedDataset, limit = 12) {
  return dataset.observations
    .slice(0, limit)
    .map((observation) =>
      Object.fromEntries(
        dataset.columns.map((column) => [
          column,
          toPreviewValue(observation[column]),
        ])
      )
    );
}

export function isPreviewableFormat(format?: string | null) {
  return !!format && PREVIEWABLE_FORMATS.has(format.toLowerCase());
}

export function isAllowedPreviewHost(hostname: string) {
  return PREVIEW_HOSTS.has(hostname) || hostname.endsWith('.data.gov.rs');
}

export function buildFormatFacetOptions(
  datasets: BrowseDataset[],
  selectedFormat?: string
): FacetOption[] {
  const formats = uniqueFacetOptions(
    datasets.flatMap((dataset) =>
      dataset.resources.map((resource) => resource.format?.toLowerCase() ?? '')
    )
  );

  if (
    selectedFormat &&
    !formats.some((option) => option.value === selectedFormat)
  ) {
    return uniqueFacetOptions([
      ...formats.map((option) => option.value),
      selectedFormat.toLowerCase(),
    ]);
  }

  return formats;
}

export function findPreviewableResource(resources: BrowseResource[]) {
  return resources
    .filter((resource) => isPreviewableFormat(resource.format))
    .sort((left, right) => {
      const leftSize = left.filesize ?? Number.POSITIVE_INFINITY;
      const rightSize = right.filesize ?? Number.POSITIVE_INFINITY;

      if (leftSize !== rightSize) {
        return leftSize - rightSize;
      }

      const leftPriority =
        PREVIEW_FORMAT_PRIORITY[left.format.toLowerCase()] ??
        Number.MAX_SAFE_INTEGER;
      const rightPriority =
        PREVIEW_FORMAT_PRIORITY[right.format.toLowerCase()] ??
        Number.MAX_SAFE_INTEGER;

      return leftPriority - rightPriority;
    })[0];
}

class DataGovService {
  private cache = new Map<string, CachedValue<unknown>>();

  private getCached<T>(key: string) {
    const cached = this.cache.get(key) as CachedValue<T> | undefined;

    if (!cached) {
      return null;
    }

    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCached<T>(key: string, data: T) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private async fetchJson<T>(
    path: string,
    params?: Record<string, string | number | undefined>,
    signal?: AbortSignal
  ) {
    const url = buildApiUrl(path, params);
    const cacheKey = `json:${url}`;
    const cached = this.getCached<T>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`data.gov.rs request failed with ${response.status}`);
    }

    const data = (await response.json()) as T;
    this.setCached(cacheKey, data);
    return data;
  }

  async getDatasetList(params: BrowseSearchParams = {}, signal?: AbortSignal) {
    return this.fetchJson<BrowsePageResponse<BrowseDataset>>(
      'datasets/',
      {
        q: params.q,
        page: params.page ?? 1,
        page_size: params.pageSize ?? 12,
        organization: params.organization,
        topic: params.topic,
        format: params.format,
        frequency: params.frequency,
        sort: params.sort ?? '-last_update',
      },
      signal
    );
  }

  async getDataset(id: string, signal?: AbortSignal) {
    return this.fetchJson<BrowseDataset>(`datasets/${id}/`, undefined, signal);
  }

  async getTopics(signal?: AbortSignal) {
    return this.fetchJson<BrowsePageResponse<BrowseTopic>>(
      'topics/',
      undefined,
      signal
    );
  }

  async getFrequencies(signal?: AbortSignal) {
    return this.fetchJson<FrequencyRecord[]>(
      'datasets/frequencies/',
      undefined,
      signal
    );
  }

  async getOrganizations(signal?: AbortSignal) {
    const firstPage = await this.fetchJson<
      BrowsePageResponse<BrowseOrganizationRecord>
    >(
      'organizations/',
      {
        page: 1,
        page_size: ORGANIZATION_PAGE_SIZE,
      },
      signal
    );

    const totalPages = Math.ceil(firstPage.total / ORGANIZATION_PAGE_SIZE);

    if (totalPages <= 1) {
      return firstPage.data;
    }

    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) =>
        this.fetchJson<BrowsePageResponse<BrowseOrganizationRecord>>(
          'organizations/',
          {
            page: index + 2,
            page_size: ORGANIZATION_PAGE_SIZE,
          },
          signal
        )
      )
    );

    return [firstPage, ...remainingPages].flatMap((page) => page.data);
  }

  async getStaticFacets(signal?: AbortSignal): Promise<StaticFacets> {
    const cacheKey = 'static-facets';
    const cached = this.getCached<StaticFacets>(cacheKey);

    if (cached) {
      return cached;
    }

    const [organizations, topics, frequencies] = await Promise.allSettled([
      this.getOrganizations(signal),
      this.getTopics(signal),
      this.getFrequencies(signal),
    ]);

    const facets: StaticFacets = {
      organizations:
        organizations.status === 'fulfilled'
          ? organizations.value.map((organization) => ({
              value: organization.slug,
              label: organization.name,
              count: organization.metrics?.datasets,
            }))
          : [],
      topics:
        topics.status === 'fulfilled'
          ? topics.value.data.map((topic) => ({
              value: topic.slug,
              label: topic.name,
            }))
          : [],
      frequencies:
        frequencies.status === 'fulfilled'
          ? frequencies.value.map((frequency) => ({
              value: frequency.id,
              label: frequency.label,
            }))
          : [],
    };

    this.setCached(cacheKey, facets);
    return facets;
  }

  async getBrowseFacets(
    datasets: BrowseDataset[] = [],
    selectedFormat?: string,
    signal?: AbortSignal
  ): Promise<BrowseFacets> {
    const staticFacets = await this.getStaticFacets(signal);

    return {
      ...staticFacets,
      formats: buildFormatFacetOptions(datasets, selectedFormat),
    };
  }

  async getResourceData(
    resourceUrl: string,
    format: string,
    options?: { limit?: number },
    signal?: AbortSignal
  ) {
    const resource = new URL(resourceUrl);

    if (!isAllowedPreviewHost(resource.hostname)) {
      throw new Error('Only official data.gov.rs resource hosts are allowed.');
    }

    if (!isPreviewableFormat(format)) {
      throw new Error('Only CSV and JSON previews are supported.');
    }

    return loadDatasetFromUrl(resourceUrl, {
      format,
      rowLimit: options?.limit ?? 150,
      fetchInit: {
        cache: 'no-store',
        signal,
      },
    });
  }
}

export const dataGovService = new DataGovService();
