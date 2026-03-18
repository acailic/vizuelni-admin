'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { isDemoMode } from '@/lib/app-mode';

export type DataSourceType = 'official' | 'demo';
export type ConnectionStatus =
  | 'connected'
  | 'connecting'
  | 'fallback'
  | 'error';

export interface DataSourceState {
  source: DataSourceType;
  status: ConnectionStatus;
  lastUpdated: Date | null;
  retryCount: number;
  error: Error | null;
  isFallbackDismissed: boolean;
}

interface DataSourceContextValue extends DataSourceState {
  switchSource: (source: DataSourceType) => void;
  retry: () => void;
  setFallback: () => void;
  setError: (error: Error | null) => void;
  clearError: () => void;
  incrementRetry: () => void;
  setStatus: (status: ConnectionStatus) => void;
  dismissFallback: () => void;
}

const DataSourceContext = createContext<DataSourceContextValue | null>(null);

const STORAGE_KEY = 'vas-preferred-source';

function getInitialSource(): DataSourceType {
  if (isDemoMode) {
    return 'demo';
  }
  if (typeof window === 'undefined') {
    return 'official';
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'demo' || stored === 'official') {
    return stored;
  }
  return 'official';
}

export function DataSourceProvider({ children }: { children: ReactNode }) {
  const [source, setSource] = useState<DataSourceType>(getInitialSource);
  const [status, setStatus] = useState<ConnectionStatus>(
    isDemoMode ? 'connected' : 'connecting'
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [isFallbackDismissed, setIsFallbackDismissed] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    const storedSource = getInitialSource();
    if (storedSource !== source) {
      setSource(storedSource);
    }
  }, []);

  const switchSource = useCallback((newSource: DataSourceType) => {
    setSource(newSource);
    setLastUpdated(new Date());
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newSource);
    }
  }, []);

  const retry = useCallback(() => {
    setRetryCount(0);
    setSource('official');
    setStatus('connecting');
    setError(null);
    setIsFallbackDismissed(false);
  }, []);

  const setFallback = useCallback(() => {
    setSource('demo');
    setStatus('fallback');
    setLastUpdated(new Date());
  }, []);

  const handleError = useCallback((err: Error | null) => {
    setError(err);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const incrementRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  const dismissFallback = useCallback(() => {
    setIsFallbackDismissed(true);
  }, []);

  const value: DataSourceContextValue = {
    source,
    status,
    lastUpdated,
    retryCount,
    error,
    isFallbackDismissed,
    switchSource,
    retry,
    setFallback,
    setError: handleError,
    clearError,
    incrementRetry,
    setStatus,
    dismissFallback,
  };

  return (
    <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>
  );
}

export function useDataSource(): DataSourceContextValue {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  return context;
}
