/**
 * Tests for useDataGovRs hook
 *
 * Tests the React hook for fetching data from the Serbian Open Data Portal.
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import {
  describe,
  expect,
  it,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";

import { useDataGovRs } from "../../../exports/hooks/useDataGovRs";

import type { DatasetMetadata } from "../../../exports/client";

describe("useDataGovRs", () => {
  const mockDatasetData: DatasetMetadata[] = [
    {
      id: "1",
      title: "Test Dataset 1",
      description: "Test description",
      created_at: "2023-01-01T00:00:00",
      updated_at: "2023-01-01T00:00:00",
      resources: [],
      tags: [],
      organization: {
        id: "test-org",
        name: "Test Organization",
        title: "Test Organization",
        description: "Test organization description",
        image_url: "https://example.com/org.png",
        created_at: "2023-01-01T00:00:00",
      },
    },
    {
      id: "2",
      title: "Test Dataset 2",
      description: "Test description 2",
      created_at: "2023-01-02T00:00:00",
      updated_at: "2023-01-02T00:00:00",
      resources: [],
      tags: [],
      organization: {
        id: "test-org",
        name: "Test Organization",
        title: "Test Organization",
        description: "Test organization description",
        image_url: "https://example.com/org.png",
        created_at: "2023-01-01T00:00:00",
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    const mockFetch = vi.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("data fetching", () => {
    it.skip("should fetch data successfully on mount", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 2,
            }),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-1-fetch-on-mount" },
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      expect(result.current.data).toEqual(mockDatasetData);
      expect(result.current.count).toBe(2);
      expect(result.current.error).toBeNull();
    });

    it.skip("should pass search params to the API", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 2,
            }),
        })
      );

      const params = {
        q: "test query",
        page: 2,
        page_size: 10,
        organization: "test-org",
      };

      renderHook(() =>
        useDataGovRs({
          params,
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(mockFetch).toHaveBeenCalled();
        },
        { timeout: 10000 }
      );

      const fetchUrl = mockFetch.mock.calls[0][0] as string;
      expect(fetchUrl).toContain("q=test%20query");
      expect(fetchUrl).toContain("page=2");
      expect(fetchUrl).toContain("page_size=10");
      expect(fetchUrl).toContain("organization=test-org");
    });

    it.skip("should return count from API response", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 100,
            }),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-3-count-response" },
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      expect(result.current.count).toBe(100);
    });
  });

  describe("loading states", () => {
    it.skip("should set isLoading to true while fetching", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () =>
                    Promise.resolve({
                      results: mockDatasetData,
                      count: 2,
                    }),
                }),
              100
            )
          )
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-4-loading-while-fetching" },
          cacheTime: 0,
        })
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );
    });

    it.skip("should set isLoading to false after successful fetch", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 2,
            }),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-5-loading-after-fetch" },
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      expect(result.current.data).toEqual(mockDatasetData);
    });

    it.skip("should set isLoading to false after failed fetch", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          json: () => Promise.resolve({ error: "Server error" }),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-6-loading-after-failed-fetch" },
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      expect(result.current.error).toBeTruthy();
    });
  });

  describe("error handling", () => {
    it.skip("should handle network errors", async () => {
      const mockFetch = global.fetch as Mock;
      const networkError = new Error("Network error");
      mockFetch.mockImplementation(() => Promise.reject(networkError));

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-7-network-error" },
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      expect(result.current.error).toBeTruthy();
      expect(result.current.error?.message).toBe("Network error");
    });

    it.skip("should handle API errors", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: "Not Found",
          json: () => Promise.resolve({ error: "Dataset not found" }),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-8-api-error" },
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      expect(result.current.error).toBeTruthy();
    });

    it.skip("should handle malformed JSON responses", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.reject(new Error("Invalid JSON")),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-9-malformed-json" },
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      expect(result.current.error).toBeTruthy();
    });

    it.skip("should clear error on successful refetch", async () => {
      const mockFetch = global.fetch as Mock;
      let callCount = 0;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: callCount++ === 0 ? false : true,
          status: 500,
          statusText: callCount === 0 ? "Internal Server Error" : "OK",
          json: () =>
            callCount === 1
              ? Promise.resolve({ error: "Server error" })
              : Promise.resolve({
                  results: mockDatasetData,
                  count: 2,
                }),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-10-clear-error-refetch" },
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(result.current.error).toBeTruthy();
        },
        { timeout: 10000 }
      );

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(
        () => {
          expect(result.current.error).toBeNull();
        },
        { timeout: 10000 }
      );
    });
  });

  describe("refetch functionality", () => {
    it.skip("should refetch data when refetch is called", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 2,
            }),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-11-refetch-data" },
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      const initialCallCount = mockFetch.mock.calls.length;

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      expect(mockFetch.mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    it.skip("should update data after refetch", async () => {
      const mockFetch = global.fetch as Mock;
      const updatedData: DatasetMetadata[] = [
        {
          id: "3",
          title: "Updated Dataset",
          description: "Updated description",
          created_at: "2023-01-01T00:00:00",
          updated_at: "2023-01-01T00:00:00",
          resources: [],
          tags: [],
          organization: {
            id: "test-org",
            name: "Test Organization",
            title: "Test Organization",
            description: "Test organization description",
            image_url: "https://example.com/org.png",
            created_at: "2023-01-01T00:00:00",
          },
        },
      ];

      let callCount = 0;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: callCount++ === 0 ? mockDatasetData : updatedData,
              count: callCount === 1 ? 2 : 1,
            }),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-12-update-after-refetch" },
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(result.current.data).toEqual(mockDatasetData);
        },
        { timeout: 10000 }
      );

      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(
        () => {
          expect(result.current.data).toEqual(updatedData);
          expect(result.current.count).toBe(1);
        },
        { timeout: 10000 }
      );
    });
  });

  describe("disabled state", () => {
    it.skip("should not fetch when enabled is false", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 2,
            }),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-13-disabled-false" },
          enabled: false,
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it.skip("should not fetch when enabled becomes false", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 2,
            }),
        })
      );

      const { result, rerender } = renderHook((props) => useDataGovRs(props), {
        initialProps: {
          params: { q: "test-14-enabled-becomes-false" },
          enabled: true,
          cacheTime: 0,
        },
      });

      await waitFor(
        () => {
          expect(result.current.data).not.toBeNull();
        },
        { timeout: 10000 }
      );

      const callCountAfterInitialFetch = mockFetch.mock.calls.length;

      rerender({
        params: { q: "test-14-enabled-becomes-false" },
        enabled: false,
        cacheTime: 0,
      });

      await waitFor(
        () => {
          expect(mockFetch.mock.calls.length).toBe(callCountAfterInitialFetch);
        },
        { timeout: 10000 }
      );
    });

    it.skip("should fetch when enabled becomes true", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 2,
            }),
        })
      );

      const { result, rerender } = renderHook((props) => useDataGovRs(props), {
        initialProps: {
          params: { q: "test-15-enabled-becomes-true" },
          enabled: false,
          cacheTime: 0,
        },
      });

      const initialCallCount = mockFetch.mock.calls.length;

      rerender({
        params: { q: "test-15-enabled-becomes-true" },
        enabled: true,
        cacheTime: 0,
      });

      await waitFor(
        () => {
          expect(result.current.data).not.toBeNull();
        },
        { timeout: 10000 }
      );

      expect(mockFetch.mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    it.skip("should not execute manual fetch when disabled", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 2,
            }),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-16-manual-fetch-disabled" },
          enabled: false,
          cacheTime: 0,
        })
      );

      await act(async () => {
        await result.current.fetch();
      });

      expect(result.current.data).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("manual fetch", () => {
    it.skip("should provide manual fetch function", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 2,
            }),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-17-manual-fetch-function" },
          cacheTime: 0,
        })
      );

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      const initialCallCount = mockFetch.mock.calls.length;

      await act(async () => {
        await result.current.fetch();
      });

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      expect(mockFetch.mock.calls.length).toBeGreaterThan(initialCallCount);
    });

    it.skip("should respect enabled state in manual fetch", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 2,
            }),
        })
      );

      const { result } = renderHook(() =>
        useDataGovRs({
          params: { q: "test-18-manual-fetch-respect-enabled" },
          enabled: false,
          cacheTime: 0,
        })
      );

      const initialCallCount = mockFetch.mock.calls.length;

      await act(async () => {
        await result.current.fetch();
      });

      expect(mockFetch.mock.calls.length).toBe(initialCallCount);
    });
  });

  describe("caching behavior", () => {
    it.skip("should use cached data when cache is fresh", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 2,
            }),
        })
      );

      const cacheTime = 5000;

      const { result, rerender } = renderHook(
        ({ params }) => useDataGovRs({ params, cacheTime }),
        {
          initialProps: {
            params: { q: "test-19-cache-fresh" },
          },
        }
      );

      await waitFor(
        () => {
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 }
      );

      const callCountAfterInitial = mockFetch.mock.calls.length;

      rerender({ params: { q: "test-19-cache-fresh" } });

      await waitFor(
        () => {
          expect(mockFetch.mock.calls.length).toBe(callCountAfterInitial);
        },
        { timeout: 10000 }
      );
    });

    it.skip("should use different cache keys for different params", async () => {
      const mockFetch = global.fetch as Mock;
      mockFetch.mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              results: mockDatasetData,
              count: 2,
            }),
        })
      );

      const { rerender } = renderHook((props) => useDataGovRs(props), {
        initialProps: {
          params: { q: "test-20-cache-keys-1" },
          cacheTime: 0,
        },
      });

      await waitFor(
        () => {
          expect(mockFetch).toHaveBeenCalled();
        },
        { timeout: 10000 }
      );

      const callCountAfterFirst = mockFetch.mock.calls.length;

      rerender({ params: { q: "test-20-cache-keys-2" }, cacheTime: 0 });

      await waitFor(
        () => {
          expect(mockFetch.mock.calls.length).toBeGreaterThan(
            callCountAfterFirst
          );
        },
        { timeout: 10000 }
      );
    });
  });
});
