// app/pages/demos/playground/_hooks/useUrlState.ts
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { useCallback } from "react";

import type { PlaygroundState } from "../_types";

interface ShareableState {
  t: PlaygroundState["chartType"];
  d: PlaygroundState["data"];
  c: {
    x: string;
    y: string;
    color: string;
  };
  th: string;
}

export function compressState(state: PlaygroundState): string {
  const shareable: ShareableState = {
    t: state.chartType,
    d: state.data,
    c: {
      x: state.config.xAxis,
      y: state.config.yAxis,
      color: state.config.color,
    },
    th: state.themeId,
  };
  return compressToEncodedURIComponent(JSON.stringify(shareable));
}

export function decompressState(
  compressed: string
): Partial<PlaygroundState> | null {
  try {
    const decompressed = decompressFromEncodedURIComponent(compressed);
    if (!decompressed) return null;

    const shareable: ShareableState = JSON.parse(decompressed);
    return {
      chartType: shareable.t,
      data: shareable.d,
      config: {
        xAxis: shareable.c.x,
        yAxis: shareable.c.y,
        color: shareable.c.color,
      },
      themeId: shareable.th,
    };
  } catch {
    return null;
  }
}

export function useUrlState() {
  const getShareUrl = useCallback((state: PlaygroundState): string => {
    const compressed = compressState(state);
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("s", compressed);
    return url.toString();
  }, []);

  const getStateFromUrl = useCallback((): Partial<PlaygroundState> | null => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const compressed = params.get("s");
    if (!compressed) return null;
    return decompressState(compressed);
  }, []);

  return { getShareUrl, getStateFromUrl };
}
