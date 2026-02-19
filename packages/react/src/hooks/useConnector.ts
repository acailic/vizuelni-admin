import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import type { DataConnector, DataSchema } from "@vizualni/connectors";
import type { Datum } from "@vizualni/core";

export interface ConnectorState<TMeta = unknown> {
  /** Fetched data */
  data: Datum[] | undefined;
  /** Data schema */
  schema: DataSchema | undefined;
  /** Loading state */
  loading: boolean;
  /** Error if fetch failed */
  error: Error | null;
  /** Metadata from connector */
  meta: TMeta | undefined;
}

export interface UseConnectorReturn<
  TMeta = unknown,
> extends ConnectorState<TMeta> {
  /** Refetch data */
  refetch: () => void;
}

/**
 * Hook for fetching data using a connector
 */
export function useConnector<TConfig, TMeta = unknown>(
  connector: DataConnector<TConfig, TMeta>,
  config: TConfig,
  options: { enabled?: boolean } = {}
): UseConnectorReturn<TMeta> {
  const { enabled = true } = options;

  const [state, setState] = useState<ConnectorState<TMeta>>({
    data: undefined,
    schema: undefined,
    loading: false,
    error: null,
    meta: undefined,
  });

  // Serialize config for dependency comparison to avoid infinite loops
  const configKey = useMemo(() => JSON.stringify(config), [config]);

  // Keep track of the latest config for the refetch function
  const configRef = useRef(config);
  configRef.current = config;
  const connectorRef = useRef(connector);
  connectorRef.current = connector;

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await connectorRef.current.fetch(configRef.current);
      setState({
        data: result.data,
        schema: result.schema,
        loading: false,
        error: null,
        meta: result.meta,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, configKey, fetchData]);

  return {
    ...state,
    refetch: fetchData,
  };
}
