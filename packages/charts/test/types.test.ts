import { describe, expect, it } from 'vitest';

import { getDefaultOptions, parseChartConfig } from '../src/types';

describe('chart config parsing', () => {
  it('preserves map-specific options returned by defaults', () => {
    const options = getDefaultOptions('map');
    const parsed = parseChartConfig({
      type: 'map',
      title: 'Population',
      x_axis: { field: 'district' },
      y_axis: { field: 'value' },
      options,
    });

    expect(parsed.options).toMatchObject({
      geoLevel: 'district',
      colorScaleType: 'sequential',
      colorPalette: 'blues',
      classificationMethod: 'quantiles',
      classCount: 5,
      showSymbols: false,
    });
  });

  it('allows table configs without explicit x/y axes', () => {
    expect(() =>
      parseChartConfig({
        type: 'table',
        title: 'Table preview',
        options: { pageSize: 10 },
      })
    ).not.toThrow();
  });
});
