/**
 * Type definitions for the Insight Explorer feature.
 *
 * This module contains types for:
 * - Search and suggestions
 * - Topics and navigation
 * - Popular insights
 * - Dataset cards
 * - Preview panel
 * - Keyword extraction
 */
import type { Locale } from '@/lib/i18n/config';
import type {
  BrowseSearchParams,
  BrowseDataset,
  BrowseResource,
} from '@/types/browse';
import type { ChartConfig } from '@/types/chart-config';
import type { Observation } from '@/types/observation';

// ============================================
// Core Types
// ============================================

/** A string that varies by locale (sr-Cyrl, sr-Latn, en) */
export type LocalizedString = Record<Locale, string>;

// ============================================
// Search & Suggestions
// ============================================

export interface SearchSuggestion {
  id: string;
  query: string;
  label: LocalizedString;
  icon?: string;
}

// ============================================
// Topics & Navigation
// ============================================

export interface LifeTopic {
  id: string;
  icon: string;
  label: LocalizedString;
  description: LocalizedString;
  datasetCount: number;
  dataGovTopics: string[];
}

export interface LocationFilter {
  id: string;
  label: LocalizedString;
  type: 'region' | 'city' | 'municipality';
}

// ============================================
// Popular Insights
// ============================================

export type ChartType = 'line' | 'bar' | 'map' | 'pie';
export type FreshnessLevel = 'today' | 'this-week' | 'this-month' | 'this-year';
export type BadgeType = 'new' | 'trending' | 'featured';

export interface PopularInsight {
  id: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  chartType: ChartType;
  searchParams: Partial<BrowseSearchParams>;
  datasetId: string;
  freshness: FreshnessLevel;
  badge?: {
    type: BadgeType;
    label: LocalizedString;
  };
}

// ============================================
// Dataset Cards
// ============================================

export interface InsightBullets {
  datasetId: string;
  bullets: Record<Locale, string[]>;
}

export interface CitizenDatasetCardLabels {
  readyToVisualize: string;
  dataOnly: string;
  whatYouCanLearn: string;
  updated: string;
  rows: string;
  viewVisualization: string;
  visualizationLoaded: string;
  details: string;
  download: string;
}

// ============================================
// Preview Panel
// ============================================

export interface GeneratedInsight {
  text: string;
  type: 'observation' | 'trend' | 'comparison' | 'anomaly';
  confidence: 'high' | 'medium' | 'low';
}

export interface KeyStatistic {
  value: string | number;
  label: LocalizedString;
  icon: 'rows' | 'cities' | 'year' | 'records' | 'coverage';
}

// ============================================
// Keyword Extraction
// ============================================

export interface ExtractionPattern {
  type: 'topic' | 'location' | 'timeRange' | 'metric';
  patterns: Record<Locale, string[]>;
  mapsTo: string;
}

export interface ExtractedParams {
  q?: string;
  topic?: string;
  location?: string;
  year?: string;
  metric?: string;
}

// ============================================
// Hook Interface
// ============================================

export interface UseInsightExplorerReturn {
  searchQuery: string;
  selectedTopic: string | null;
  selectedLocation: string | null;
  selectedYear: string | null;
  selectedInsightType: string | null;
  selectedDataset: BrowseDataset | null;
  selectedResource: BrowseResource | null;
  datasets: BrowseDataset[];
  datasetsLoading: boolean;
  datasetsError: Error | null;
  totalDatasets: number;
  previewData: Observation[] | null;
  previewLoading: boolean;
  previewError: Error | null;
  chartConfig: ChartConfig | null;
  setSearchQuery: (query: string) => void;
  setSelectedTopic: (topicId: string | null) => void;
  setSelectedLocation: (locationId: string | null) => void;
  setSelectedYear: (year: string | null) => void;
  setSelectedInsightType: (type: string | null) => void;
  selectDataset: (datasetId: string) => void;
  selectResource: (resourceId: string) => void;
  clearFilters: () => void;
}

// ============================================
// Error States
// ============================================

export interface ErrorStateProps {
  locale: Locale;
  type: 'no-results' | 'preview-failed' | 'api-unavailable';
  onRetry?: () => void;
  onClearFilters?: () => void;
}

// ============================================
// Mobile Modal
// ============================================

export interface MobilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataset: BrowseDataset | null;
  locale: Locale;
}
