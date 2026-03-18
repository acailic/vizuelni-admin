'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useDataSource } from '@/contexts/DataSourceContext';
import { dataGovService } from '@/lib/data-gov-api';
import {
  loadDemoDataset,
  loadDemoDatasetList,
  loadDemoDatasetWithData,
  convertDemoDataToParsedDataset,
} from '@/lib/demo-datasets';
import type { BrowseDataset, BrowseSearchParams } from '@/types/browse';

const ONE_HOUR = 60 * 60 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;

export function useDatasetList(params: BrowseSearchParams) {
  const {
    source,
    setFallback,
    clearError,
    incrementRetry,
    retryCount,
    setError,
    setStatus,
  } = useDataSource();

  const query = useQuery({
    queryKey: ['data-gov', 'datasets', source, params],
    queryFn: async ({ signal }) => {
      if (source === 'demo') {
        clearError();
        setStatus('connected');
        return loadDemoDatasetList(params);
      }

      setStatus('connecting');
      const result = await dataGovService.getDatasetList(params, signal);
      clearError();
      setStatus('connected');
      return result;
    },
    enabled: source === 'official' || source === 'demo',
    retry: source === 'official' ? 1 : false, // 1 retry = 2 total attempts
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    staleTime: FIVE_MINUTES,
  });

  // Handle errors with useEffect (modern pattern, not deprecated onError)
  // Combined into single useEffect to avoid race conditions between error setting and fallback check
  useEffect(() => {
    if (query.error && source === 'official') {
      setError(query.error);
      incrementRetry();
      // Check retryCount after increment will happen
      if (retryCount >= 1) {
        setFallback();
      }
    }
  }, [query.error, source, retryCount, setError, incrementRetry, setFallback]);

  return query;
}

export function useDataset(datasetId: string | null) {
  const { source, clearError, setStatus } = useDataSource();

  return useQuery({
    queryKey: ['data-gov', 'dataset', source, datasetId],
    queryFn: ({ signal }) => {
      if (!datasetId) {
        throw new Error('Dataset id is required.');
      }

      if (source === 'demo') {
        clearError();
        setStatus('connected');
        const dataset = loadDemoDataset(datasetId);
        if (!dataset) {
          throw new Error(`Demo dataset not found: ${datasetId}`);
        }
        return dataset;
      }

      return dataGovService.getDataset(datasetId, signal);
    },
    enabled: Boolean(datasetId),
    staleTime: ONE_HOUR,
  });
}

export function useBrowseFacets(
  datasets: BrowseDataset[],
  selectedFormat?: string
) {
  return useQuery({
    queryKey: [
      'data-gov',
      'browse-facets',
      datasets.map((dataset) => dataset.id),
      selectedFormat,
    ],
    queryFn: ({ signal }) =>
      dataGovService.getBrowseFacets(datasets, selectedFormat, signal),
    staleTime: ONE_HOUR,
  });
}

/**
 * Loads preview data for a demo dataset from its embedded data array.
 * Used in demo/static mode to avoid network requests to URLs that
 * would fail isAllowedPreviewHost checks.
 */
export function useDemoPreviewData(datasetId: string | null) {
  return useQuery({
    queryKey: ['demo-preview', datasetId],
    queryFn: () => {
      if (!datasetId) throw new Error('Dataset ID required.');
      const demo = loadDemoDatasetWithData(datasetId);
      if (!demo) throw new Error(`Demo dataset not found: ${datasetId}`);
      return convertDemoDataToParsedDataset(demo);
    },
    enabled: Boolean(datasetId),
    staleTime: Infinity,
  });
}

export function useResourceData(
  resourceUrl: string | null,
  format: string | null,
  options?: { limit?: number }
) {
  return useQuery({
    queryKey: ['data-gov', 'resource', resourceUrl, format, options?.limit],
    queryFn: ({ signal }) => {
      if (!resourceUrl || !format) {
        throw new Error('A previewable resource is required.');
      }

      return dataGovService.getResourceData(
        resourceUrl,
        format,
        options,
        signal
      );
    },
    enabled: Boolean(resourceUrl && format),
    staleTime: ONE_HOUR,
  });
}
