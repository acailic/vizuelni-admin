import { createElement, type ComponentType } from 'react';

import { bench, describe } from 'vitest';
import { createRenderer } from 'react-test-renderer/shallow';

import { AreaChart } from '../src/components/charts/area/AreaChart';
import { BarChart } from '../src/components/charts/bar/BarChart';
import { LineChart } from '../src/components/charts/line/LineChart';
import { PieChart } from '../src/components/charts/pie/PieChart';
import type {
  ChartConfig,
  ChartRendererComponentProps,
  ChartRendererDataRow,
} from '../src/types/chart-config';

const generateData = (size: number): ChartRendererDataRow[] =>
  Array.from({ length: size }, (_, i) => ({
    category: `cat${i % 10}`,
    value: Math.random() * 100,
  }));

const baseConfig = {
  title: 'Benchmark Chart',
  x_axis: { field: 'category', label: 'Category', type: 'category' as const },
  y_axis: { field: 'value', label: 'Value', type: 'linear' as const },
  options: {
    animation: false,
    showLegend: false,
    showGrid: false,
  },
} satisfies Omit<ChartConfig, 'type'>;

const renderer = createRenderer();
const dataSizes = [100, 1000, 10000, 100000];

function createConfig(type: ChartConfig['type']): ChartConfig {
  return {
    ...baseConfig,
    type,
  };
}

function renderBenchmarkChart(
  Component: ComponentType<ChartRendererComponentProps>,
  config: ChartConfig,
  data: ChartRendererDataRow[]
) {
  renderer.render(
    createElement(Component, {
      config,
      data,
      height: 400,
      locale: 'en',
      previewMode: true,
    })
  );
}

function createMemoryHooks(chartType: ChartConfig['type'], size: number) {
  return {
    setup() {
      const memBefore =
        (performance as { memory?: { usedJSHeapSize?: number } }).memory
          ?.usedJSHeapSize ?? 0;
      return { memBefore };
    },
    teardown({ memBefore }: { memBefore: number }) {
      const memAfter =
        (performance as { memory?: { usedJSHeapSize?: number } }).memory
          ?.usedJSHeapSize ?? 0;
      const memUsed = memAfter - memBefore;

      console.log(
        JSON.stringify({
          chartType,
          dataSize: size,
          memUsed,
        })
      );
    },
  };
}

describe('Chart Rendering Benchmarks', () => {
  describe('Line Chart', () => {
    dataSizes.forEach((size) => {
      bench(
        `Line Chart with ${size} data points`,
        () => {
          renderBenchmarkChart(
            LineChart,
            createConfig('line'),
            generateData(size)
          );
        },
        createMemoryHooks('line', size)
      );
    });
  });

  describe('Bar Chart', () => {
    dataSizes.forEach((size) => {
      bench(
        `Bar Chart with ${size} data points`,
        () => {
          renderBenchmarkChart(
            BarChart,
            createConfig('bar'),
            generateData(size)
          );
        },
        createMemoryHooks('bar', size)
      );
    });
  });

  describe('Area Chart', () => {
    dataSizes.forEach((size) => {
      bench(
        `Area Chart with ${size} data points`,
        () => {
          renderBenchmarkChart(
            AreaChart,
            createConfig('area'),
            generateData(size)
          );
        },
        createMemoryHooks('area', size)
      );
    });
  });

  describe('Pie Chart', () => {
    dataSizes.forEach((size) => {
      bench(
        `Pie Chart with ${size} data points`,
        () => {
          renderBenchmarkChart(
            PieChart,
            createConfig('pie'),
            generateData(size)
          );
        },
        createMemoryHooks('pie', size)
      );
    });
  });
});
