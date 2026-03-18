// src/lib/data/serbian-datasets/types.ts

import type { LocalizedText } from '@/lib/examples/types';
import type { MeasureMeta, Observation } from '@/types/observation';

export type DataCategory = 'demographics' | 'regional' | 'healthcare' | 'economic';

export interface SerbianDimensionMeta {
  key: string;
  label: string;
  type: string;
  values: Array<string | number | Date>;
  cardinality: number;
}

export interface RawSerbianDatasetMeta {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: string;
  tags: string[];
  source: {
    name: string;
    url: string;
  };
  lastUpdated: string;
  suggestedChartType: string;
}

export interface SerbianDatasetMeta extends Omit<RawSerbianDatasetMeta, 'category'> {
  category: DataCategory;
}

export interface RawSerbianDataset extends RawSerbianDatasetMeta {
  observations: Observation[];
  dimensions: SerbianDimensionMeta[];
  measures: MeasureMeta[];
}

export interface SerbianDataset extends SerbianDatasetMeta {
  observations: Observation[];
  dimensions: SerbianDimensionMeta[];
  measures: MeasureMeta[];
}
