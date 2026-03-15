// tests/scrape/lightpanda.ts
import { lightpanda, type LightpandaFetchOptions } from '@lightpanda/browser';

export interface FetchResult {
  url: string;
  body: string;
  timing: number;
  success: boolean;
}

/**
 * Fetch a page using Lightpanda's fast headless browser
 */
export async function fetchPage(
  url: string,
  options?: Partial<LightpandaFetchOptions>
): Promise<FetchResult> {
  const start = Date.now();
  const defaultOptions: LightpandaFetchOptions = {
    dump: true,
    disableHostVerification: false,
  };

  try {
    const response = await lightpanda.fetch(url, {
      ...defaultOptions,
      ...options,
    });

    // Convert Buffer to string if needed
    const body =
      typeof response === 'string' ? response : response.toString('utf-8');

    return {
      url,
      body,
      timing: Date.now() - start,
      success: true,
    };
  } catch (error) {
    return {
      url,
      body: '',
      timing: Date.now() - start,
      success: false,
    };
  }
}

/**
 * Run smoke tests against multiple pages
 */
export async function smokeTest(
  baseUrl: string,
  paths: string[] = ['/sr-Latn', '/sr-Latn/browse', '/sr-Latn/create']
): Promise<{ passed: boolean; results: FetchResult[] }> {
  const results = await Promise.all(
    paths.map((p) => fetchPage(`${baseUrl}${p}`))
  );

  return {
    passed: results.every((r) => r.success),
    results,
  };
}

/**
 * Fetch multiple pages in parallel and return timing info
 */
export async function fetchParallel(
  urls: string[]
): Promise<{ results: FetchResult[]; totalTime: number }> {
  const start = Date.now();
  const results = await Promise.all(urls.map((url) => fetchPage(url)));
  return {
    results,
    totalTime: Date.now() - start,
  };
}
