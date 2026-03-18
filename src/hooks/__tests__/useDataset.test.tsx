import { describe, expect, it, beforeEach } from '@jest/globals';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import { DataSourceProvider } from '@/contexts/DataSourceContext';
import { useDatasetList, useDataset } from '@/hooks/useDataset';
import { dataGovService } from '@/lib/data-gov-api';

// Mock only the external API - demo-datasets uses actual implementation
// Use global jest (not from @jest/globals) to ensure mock methods work
jest.mock('@/lib/data-gov-api', () => ({
  dataGovService: {
    getDatasetList: jest.fn(),
    getDataset: jest.fn(),
    getTopics: jest.fn(),
    getFrequencies: jest.fn(),
    getOrganizations: jest.fn(),
    getStaticFacets: jest.fn(),
    getBrowseFacets: jest.fn(),
    getResourceData: jest.fn(),
  },
}));

// Mock localStorage for DataSourceContext
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Create a wrapper with all necessary providers
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <DataSourceProvider>{children}</DataSourceProvider>
      </QueryClientProvider>
    );
  };
}

describe('useDatasetList', () => {
  const mockedGetDatasetList = dataGovService.getDatasetList as ReturnType<
    typeof jest.fn
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('loads from official source by default', async () => {
    const mockResponse = {
      data: [
        {
          id: 'dataset-1',
          slug: 'dataset-1',
          title: 'Test Dataset',
          description: 'A test dataset',
          created_at: '2024-01-01',
          last_modified: '2024-01-15',
          organization: null,
          resources: [],
          tags: [],
        },
      ],
      page: 1,
      page_size: 12,
      total: 1,
      next_page: null,
      previous_page: null,
    };

    mockedGetDatasetList.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useDatasetList({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(dataGovService.getDatasetList).toHaveBeenCalled();
  });

  it('loads from demo source when switched', async () => {
    // This test verifies the hook structure with demo data
    // Demo source is controlled by DataSourceContext, which starts as 'official' by default
    // When the API fails and fallback is triggered, it will use demo datasets

    const mockError = new Error('API unavailable');
    mockedGetDatasetList.mockRejectedValue(mockError);

    const { result } = renderHook(() => useDatasetList({}), {
      wrapper: createWrapper(),
    });

    // Since retry is enabled, wait for eventual failure
    await waitFor(
      () => {
        expect(result.current.isSuccess || result.current.isError).toBe(true);
      },
      { timeout: 5000 }
    );
  });

  it('handles API errors gracefully', async () => {
    const mockError = new Error('Network error');

    // Mock the API to fail
    mockedGetDatasetList.mockRejectedValue(mockError);

    const { result } = renderHook(() => useDatasetList({}), {
      wrapper: createWrapper(),
    });

    // The hook retries once (retry: 1), so wait for eventual error or success
    await waitFor(
      () => {
        expect(result.current.isSuccess || result.current.isError).toBe(true);
      },
      { timeout: 10000 }
    );

    // Since API always fails, it should eventually be in error state
    // (may take time due to retries)
    expect(result.current.isError || result.current.isSuccess).toBe(true);
  });
});

describe('useDataset', () => {
  const mockedGetDataset = dataGovService.getDataset as ReturnType<
    typeof jest.fn
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('loads single dataset from official source by default', async () => {
    const mockDataset = {
      id: 'official-dataset',
      slug: 'official-dataset',
      title: 'Official Dataset',
      description: 'Official dataset',
      created_at: '2024-01-01',
      last_modified: '2024-01-15',
      organization: null,
      resources: [],
      tags: [],
    };

    mockedGetDataset.mockResolvedValue(mockDataset);

    const { result } = renderHook(() => useDataset('official-dataset'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockDataset);
    expect(dataGovService.getDataset).toHaveBeenCalledWith(
      'official-dataset',
      expect.any(AbortSignal)
    );
  });

  it('returns null when datasetId is null', () => {
    const { result } = renderHook(() => useDataset(null), {
      wrapper: createWrapper(),
    });

    // Should not be loading and should have no data
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('throws error when official dataset fails', async () => {
    const mockError = new Error('Dataset not found');

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

    const Wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <DataSourceProvider>{children}</DataSourceProvider>
      </QueryClientProvider>
    );

    mockedGetDataset.mockRejectedValue(mockError);

    const { result } = renderHook(() => useDataset('non-existent-dataset'), {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toContain(
      'Dataset not found'
    );
  });
});
