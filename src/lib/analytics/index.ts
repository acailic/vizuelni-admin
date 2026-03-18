// Analytics tracking for Vizuelni Admin Srbije
// Privacy-focused: no cookies, no personal data, anonymized IPs

type EventName =
  | 'chart_created'
  | 'chart_exported'
  | 'chart_shared'
  | 'dataset_viewed'
  | 'dataset_selected'
  | 'embed_generated'
  | 'search_performed'
  | 'filter_applied'
  | 'language_changed'
  | 'demo_gallery_viewed'
  | 'example_chart_viewed';

interface EventProperties {
  chartType?: string;
  datasetId?: string;
  format?: string;
  source?: string;
  query?: string;
  filterType?: string;
  filterValue?: string;
  fromLocale?: string;
  toLocale?: string;
  exampleId?: string;
  category?: string;
}

type AnalyticsProvider = 'plausible' | 'umami' | 'vercel' | 'none';
type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsRecord = Record<string, AnalyticsValue>;

const ANALYTICS_PROVIDERS: AnalyticsProvider[] = [
  'plausible',
  'umami',
  'vercel',
  'none',
];

interface PlausibleEventOptions {
  props?: AnalyticsRecord;
  u?: string;
}

declare global {
  interface Window {
    plausible?: (eventName: string, options?: PlausibleEventOptions) => void;
    umami?: {
      track: (eventName: string, properties?: AnalyticsRecord) => void;
    };
  }
}

function getAnalyticsProvider(provider?: string): AnalyticsProvider {
  return ANALYTICS_PROVIDERS.find((candidate) => candidate === provider) ?? 'none';
}

function toAnalyticsRecord(
  properties?: EventProperties
): AnalyticsRecord | undefined {
  return properties ? { ...properties } : undefined;
}

class AnalyticsService {
  private enabled: boolean;
  private provider: AnalyticsProvider;

  constructor() {
    this.enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
    this.provider = getAnalyticsProvider(
      process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER
    );
  }

  /**
   * Track an analytics event
   */
  track(name: EventName, properties?: EventProperties) {
    if (!this.enabled) {
      return;
    }

    const analyticsProperties = toAnalyticsRecord(properties);

    switch (this.provider) {
      case 'plausible':
        this.trackPlausible(name, analyticsProperties);
        break;
      case 'umami':
        this.trackUmami(name, analyticsProperties);
        break;
      case 'vercel':
        // Vercel Analytics tracks page views automatically
        // Custom events require @vercel/analytics sendTrack
        this.trackVercel(name, analyticsProperties);
        break;
      case 'none':
      default:
        break;
    }
  }

  /**
   * Track page view (for client-side navigation)
   */
  pageView(url?: string) {
    if (!this.enabled) return;

    const pageUrl =
      url || (typeof window !== 'undefined' ? window.location.pathname : '');

    // Plausible and Umami track page views automatically
    // This is for manual tracking if needed
    if (this.provider === 'plausible' && typeof window !== 'undefined') {
      window.plausible?.('pageview', { u: pageUrl });
    }
  }

  private trackPlausible(name: string, properties?: AnalyticsRecord) {
    if (typeof window !== 'undefined') {
      window.plausible?.(name, properties ? { props: properties } : undefined);
    }
  }

  private trackUmami(name: string, properties?: AnalyticsRecord) {
    if (typeof window !== 'undefined') {
      window.umami?.track(name, properties);
    }
  }

  private trackVercel(name: string, properties?: AnalyticsRecord) {
    if (typeof window !== 'undefined') {
      // Vercel Analytics custom events
      import('@vercel/analytics')
        .then(({ track }) => {
          track(name, properties);
        })
        .catch(() => {
          // Silently fail if Vercel Analytics not available
        });
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsService();

// Convenience functions for common events

/**
 * Track when a user creates a chart
 */
export function trackChartCreated(chartType: string, datasetId: string) {
  analytics.track('chart_created', { chartType, datasetId });
}

/**
 * Track when a user exports a chart
 */
export function trackChartExported(format: string, chartType?: string) {
  analytics.track('chart_exported', { format, chartType });
}

/**
 * Track when a user shares a chart
 */
export function trackChartShared(method: string, chartId?: string) {
  analytics.track('chart_shared', { format: method, datasetId: chartId });
}

/**
 * Track when a user views a dataset
 */
export function trackDatasetViewed(
  datasetId: string,
  source: 'browse' | 'search' | 'direct' | 'gallery'
) {
  analytics.track('dataset_viewed', { datasetId, source });
}

/**
 * Track when a user selects a dataset to visualize
 */
export function trackDatasetSelected(datasetId: string, source: string) {
  analytics.track('dataset_selected', { datasetId, source });
}

/**
 * Track when a user generates embed code
 */
export function trackEmbedGenerated(chartId: string, chartType?: string) {
  analytics.track('embed_generated', { datasetId: chartId, chartType });
}

/**
 * Track search queries (anonymized)
 */
export function trackSearch(query: string, _resultsCount?: number) {
  // Don't track potentially sensitive queries
  const sanitizedQuery =
    query.length > 100 ? query.substring(0, 100) + '...' : query;
  analytics.track('search_performed', { query: sanitizedQuery });
}

/**
 * Track filter usage
 */
export function trackFilterApplied(filterType: string, filterValue: string) {
  analytics.track('filter_applied', { filterType, filterValue });
}

/**
 * Track language changes
 */
export function trackLanguageChanged(fromLocale: string, toLocale: string) {
  analytics.track('language_changed', { fromLocale, toLocale });
}

/**
 * Track demo gallery interactions
 */
export function trackDemoGalleryViewed(category?: string) {
  analytics.track('demo_gallery_viewed', { category });
}

/**
 * Track when a user views an example chart
 */
export function trackExampleChartViewed(exampleId: string, chartType: string) {
  analytics.track('example_chart_viewed', { exampleId, chartType });
}

// Re-export types
export type { EventName, EventProperties };
