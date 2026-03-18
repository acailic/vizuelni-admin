import type { ParsedDataset } from '@vizualni/shared-kernel';

import type { ChartConfig } from './chart-config';
import type { ConfiguratorStep } from './chart-config';
export type { ConfiguratorStep } from './chart-config';

export const stepOrder: ConfiguratorStep[] = [
  'dataset',
  'chartType',
  'mapping',
  'customize',
  'review',
];

export function isConfigReady(config: Partial<ChartConfig>): boolean {
  if (config.type === 'table') {
    return true;
  }

  return !!config.x_axis?.field && !!config.y_axis?.field;
}

export function canProceedFromStep(
  step: ConfiguratorStep,
  config: Partial<ChartConfig>,
  parsedDataset: ParsedDataset | null = null
): boolean {
  switch (step) {
    case 'dataset':
      return parsedDataset !== null;
    case 'chartType':
      return !!config.type;
    case 'mapping':
      return isConfigReady(config);
    case 'customize':
    case 'review':
      return true;
    default:
      return false;
  }
}
