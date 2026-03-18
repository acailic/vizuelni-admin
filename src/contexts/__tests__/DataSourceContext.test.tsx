import React from 'react';
import { render, act } from '@testing-library/react';
import { DataSourceProvider, useDataSource } from '../DataSourceContext';

// Test helper component to access context
function TestConsumer({
  onMount,
}: {
  onMount?: (context: ReturnType<typeof useDataSource>) => void;
}) {
  const context = useDataSource();
  React.useEffect(() => {
    onMount?.(context);
  }, [context, onMount]);
  return null;
}

// Mock localStorage
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

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('DataSourceContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('Initial state', () => {
    it('initial state is "official" with "connecting" status', () => {
      let capturedContext: ReturnType<typeof useDataSource> | undefined;

      render(
        <DataSourceProvider>
          <TestConsumer
            onMount={(ctx) => {
              capturedContext = ctx;
            }}
          />
        </DataSourceProvider>
      );

      expect(capturedContext).toBeDefined();
      expect(capturedContext!.source).toBe('official');
      expect(capturedContext!.status).toBe('connecting');
      expect(capturedContext!.retryCount).toBe(0);
      expect(capturedContext!.error).toBeNull();
      expect(capturedContext!.lastUpdated).toBeNull();
    });

    it('reads initial source from localStorage if available', () => {
      localStorageMock.getItem.mockReturnValue('demo');

      let capturedContext: ReturnType<typeof useDataSource> | undefined;

      render(
        <DataSourceProvider>
          <TestConsumer
            onMount={(ctx) => {
              capturedContext = ctx;
            }}
          />
        </DataSourceProvider>
      );

      expect(capturedContext!.source).toBe('demo');
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        'vas-preferred-source'
      );
    });
  });

  describe('switchSource', () => {
    it('switchSource("demo") changes source and persists to localStorage', async () => {
      let capturedContext: ReturnType<typeof useDataSource> | undefined;

      render(
        <DataSourceProvider>
          <TestConsumer
            onMount={(ctx) => {
              capturedContext = ctx;
            }}
          />
        </DataSourceProvider>
      );

      await act(async () => {
        capturedContext!.switchSource('demo');
      });

      expect(capturedContext!.source).toBe('demo');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'vas-preferred-source',
        'demo'
      );
    });

    it('switchSource("official") changes source and persists to localStorage', async () => {
      // Start with demo in localStorage
      localStorageMock.getItem.mockReturnValue('demo');

      let capturedContext: ReturnType<typeof useDataSource> | undefined;

      render(
        <DataSourceProvider>
          <TestConsumer
            onMount={(ctx) => {
              capturedContext = ctx;
            }}
          />
        </DataSourceProvider>
      );

      await act(async () => {
        capturedContext!.switchSource('official');
      });

      expect(capturedContext!.source).toBe('official');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'vas-preferred-source',
        'official'
      );
    });
  });

  describe('setFallback', () => {
    it('setFallback() sets status to "fallback" and source to "demo"', async () => {
      let capturedContext: ReturnType<typeof useDataSource> | undefined;

      render(
        <DataSourceProvider>
          <TestConsumer
            onMount={(ctx) => {
              capturedContext = ctx;
            }}
          />
        </DataSourceProvider>
      );

      await act(async () => {
        capturedContext!.setFallback();
      });

      expect(capturedContext!.source).toBe('demo');
      expect(capturedContext!.status).toBe('fallback');
    });
  });

  describe('retry', () => {
    it('retry() resets retryCount to 0, sets source to "official", status to "connecting"', async () => {
      let capturedContext: ReturnType<typeof useDataSource> | undefined;

      render(
        <DataSourceProvider>
          <TestConsumer
            onMount={(ctx) => {
              capturedContext = ctx;
            }}
          />
        </DataSourceProvider>
      );

      // First, increment retry count and set an error
      await act(async () => {
        capturedContext!.incrementRetry();
        capturedContext!.incrementRetry();
        capturedContext!.setStatus('error');
      });

      expect(capturedContext!.retryCount).toBe(2);
      expect(capturedContext!.status).toBe('error');

      // Now retry
      await act(async () => {
        capturedContext!.retry();
      });

      expect(capturedContext!.retryCount).toBe(0);
      expect(capturedContext!.source).toBe('official');
      expect(capturedContext!.status).toBe('connecting');
    });
  });

  describe('incrementRetry', () => {
    it('incrementRetry() increments counter', async () => {
      let capturedContext: ReturnType<typeof useDataSource> | undefined;

      render(
        <DataSourceProvider>
          <TestConsumer
            onMount={(ctx) => {
              capturedContext = ctx;
            }}
          />
        </DataSourceProvider>
      );

      expect(capturedContext!.retryCount).toBe(0);

      await act(async () => {
        capturedContext!.incrementRetry();
      });

      expect(capturedContext!.retryCount).toBe(1);

      await act(async () => {
        capturedContext!.incrementRetry();
      });

      expect(capturedContext!.retryCount).toBe(2);
    });
  });

  describe('clearError', () => {
    it('clearError() sets error to null when no error is set', async () => {
      let capturedContext: ReturnType<typeof useDataSource> | undefined;

      render(
        <DataSourceProvider>
          <TestConsumer
            onMount={(ctx) => {
              capturedContext = ctx;
            }}
          />
        </DataSourceProvider>
      );

      // clearError should work even if there's no error set
      await act(async () => {
        capturedContext!.clearError();
      });

      expect(capturedContext!.error).toBeNull();
    });

    it('clearError() clears an actual error that was set', async () => {
      let capturedContext: ReturnType<typeof useDataSource> | undefined;

      render(
        <DataSourceProvider>
          <TestConsumer
            onMount={(ctx) => {
              capturedContext = ctx;
            }}
          />
        </DataSourceProvider>
      );

      // Set an actual error
      const testError = new Error('Connection failed');
      await act(async () => {
        capturedContext!.setError(testError);
      });

      expect(capturedContext!.error).toBe(testError);

      // Now clear the error
      await act(async () => {
        capturedContext!.clearError();
      });

      expect(capturedContext!.error).toBeNull();
    });
  });

  describe('setStatus', () => {
    it('setStatus() changes the connection status', async () => {
      let capturedContext: ReturnType<typeof useDataSource> | undefined;

      render(
        <DataSourceProvider>
          <TestConsumer
            onMount={(ctx) => {
              capturedContext = ctx;
            }}
          />
        </DataSourceProvider>
      );

      expect(capturedContext!.status).toBe('connecting');

      await act(async () => {
        capturedContext!.setStatus('connected');
      });

      expect(capturedContext!.status).toBe('connected');

      await act(async () => {
        capturedContext!.setStatus('error');
      });

      expect(capturedContext!.status).toBe('error');
    });
  });

  describe('dismissFallback', () => {
    it('dismissFallback() sets dismissed state to hide banner', async () => {
      let capturedContext: ReturnType<typeof useDataSource> | undefined;

      render(
        <DataSourceProvider>
          <TestConsumer
            onMount={(ctx) => {
              capturedContext = ctx;
            }}
          />
        </DataSourceProvider>
      );

      // Initially not dismissed
      expect(capturedContext!.isFallbackDismissed).toBe(false);

      await act(async () => {
        capturedContext!.dismissFallback();
      });

      expect(capturedContext!.isFallbackDismissed).toBe(true);
    });
  });

  describe('hook usage outside provider', () => {
    it('throws error when useDataSource is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        render(<TestConsumer />);
      }).toThrow('useDataSource must be used within a DataSourceProvider');

      consoleSpy.mockRestore();
    });
  });
});
