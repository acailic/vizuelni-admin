// src/lib/data/serbian-datasets/types.ts

import type { LocalizedText } from '@/lib/examples/types';
import type { DimensionMeta, MeasureMeta } from '@/types/observation';

export type DataCategory = 'demographics' | 'regional' | 'healthcare' | 'economic';

export interface SerbianDatasetMeta {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: DataCategory;
  tags: string[];
  source: {
    name: string;
    url: string;
  };
  lastUpdated: string;
  suggestedChartType: string;
}

export interface SerbianDataset extends SerbianDatasetMeta {
  observations: Record<string, unknown>[];
  dimensions: DimensionMeta[];
  measures: MeasureMeta[];
}
