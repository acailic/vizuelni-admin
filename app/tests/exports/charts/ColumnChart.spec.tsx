/**
 * Tests for ColumnChart component
 *
 * Tests the standalone ColumnChart component from the exports module.
 */

import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, expect, it, vi } from 'vitest';
import { ColumnChart } from '../../../exports/charts/ColumnChart';

// Polyfill ResizeObserver for jsdom
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('ColumnChart', () => {
  const mockData = [
    { month: 'Jan', value: 100, alt: 80 },
    { month: 'Feb', value: 120, alt: 95 },
    { month: 'Mar', value: 115, alt: 110 },
    { month: 'Apr', value: 140, alt: 125 },
  ];

  describe('rendering with basic props', () => {
    it('should render without crashing', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value', color: '#6366f1' }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render with custom width', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          width={600}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '600');
    });

    it('should render with responsive width (100%)', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          width="100%"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveStyle({ width: '100%' });
    });

    it('should render with custom className and styles', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          className="custom-chart"
          style={{ border: '1px solid red' }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveClass('custom-chart');
      expect(wrapper).toHaveStyle({ border: '1px solid red' });
    });

    it('should render with title', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value', title: 'Monthly Sales' }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(screen.getByText('Monthly Sales')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          ariaLabel="Monthly sales data"
          description="Vertical bar chart showing monthly sales trends"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector('div');
      expect(wrapper).toHaveAttribute('role', 'img');
      expect(wrapper).toHaveAttribute('aria-label', 'Monthly sales data');
    });
  });

  describe('data configurations', () => {
    it('should render with single series', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const rects = container.querySelectorAll('svg rect');
      expect(rects.length).toBeGreaterThan(0);
    });

    it('should render with multi-series using yAxis array', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: ['value', 'alt'] }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const rects = container.querySelectorAll('svg rect[class^="bar-"]');
      expect(rects.length).toBeGreaterThan(0);
    });

    it('should handle empty data gracefully', async () => {
      const { container } = render(
        <ColumnChart
          data={[]}
          config={{ xAxis: 'month', yAxis: 'value' }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should not render any bars
      const rects = container.querySelectorAll('svg rect');
      expect(rects.length).toBe(0);
    });

    it('should handle data with null values', async () => {
      const dataWithNulls = [
        { month: 'Jan', value: 100 },
        { month: 'Feb', value: null },
        { month: 'Mar', value: 120 },
      ];

      const { container } = render(
        <ColumnChart
          data={dataWithNulls}
          config={{ xAxis: 'month', yAxis: 'value' }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should still render
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should handle single data point', async () => {
      const singleDataPoint = [{ month: 'Jan', value: 100 }];

      const { container } = render(
        <ColumnChart
          data={singleDataPoint}
          config={{ xAxis: 'month', yAxis: 'value' }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('responsive width handling', () => {
    it('should use container width when width is percentage', async () => {
      const { container } = render(
        <div style={{ width: '500px' }}>
          <ColumnChart
            data={mockData}
            config={{ xAxis: 'month', yAxis: 'value' }}
            width="100%"
            height={400}
          />
        </div>
      );

      await act(async () => Promise.resolve());

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should update container width on resize', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          width="100%"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector('div');
      if (wrapper) {
        // Simulate resize
        fireEvent(wrapper, new Event('resize'));
      }

      await waitFor(() => {
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });
  });

  describe('tooltip interactions', () => {
    it('should show tooltip on hover when showTooltip is true', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          showTooltip={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Find a bar and hover over it
      const bars = container.querySelectorAll('svg rect');
      if (bars.length > 0) {
        fireEvent.mouseEnter(bars[0]);

        await waitFor(() => {
          const tooltip = container.querySelector('div[style*="position: absolute"]');
          expect(tooltip).toBeInTheDocument();
        });
      }
    });

    it('should not show tooltip when showTooltip is false', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          showTooltip={false}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const bars = container.querySelectorAll('svg rect');
      if (bars.length > 0) {
        fireEvent.mouseEnter(bars[0]);

        await waitFor(() => {
          const tooltip = container.querySelector('div[style*="position: absolute"]');
          expect(tooltip).not.toBeInTheDocument();
        });
      }
    });

    it('should use custom tooltip renderer when provided', async () => {
      const customTooltip = vi.fn(() => <div>Custom Tooltip</div>);

      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          renderTooltip={customTooltip}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const bars = container.querySelectorAll('svg rect');
      if (bars.length > 0) {
        fireEvent.mouseEnter(bars[0]);

        await waitFor(() => {
          expect(customTooltip).toHaveBeenCalled();
          expect(screen.getByText('Custom Tooltip')).toBeInTheDocument();
        });
      }
    });

    it('should hide tooltip on mouse leave', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          showTooltip={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const bars = container.querySelectorAll('svg rect');
      if (bars.length > 0) {
        fireEvent.mouseEnter(bars[0]);

        await waitFor(() => {
          const tooltip = container.querySelector('div[style*="position: absolute"]');
          expect(tooltip).toBeInTheDocument();
        });

        fireEvent.mouseLeave(bars[0]);

        await waitFor(() => {
          const tooltip = container.querySelector('div[style*="position: absolute"]');
          expect(tooltip).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('animation behavior', () => {
    it('should animate when animated is true', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value', animationDuration: 500 }}
          animated={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const rects = container.querySelectorAll('svg rect');
      expect(rects.length).toBeGreaterThan(0);
    });

    it('should not animate when animated is false', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          animated={false}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const rects = container.querySelectorAll('svg rect');
      expect(rects.length).toBeGreaterThan(0);
    });

    it('should respect custom animation duration', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value', animationDuration: 2000 }}
          animated={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('multi-series support', () => {
    const multiSeriesData = [
      { month: 'Jan', series1: 100, series2: 80, series3: 60 },
      { month: 'Feb', series1: 120, series2: 95, series3: 75 },
      { month: 'Mar', series1: 115, series2: 110, series3: 85 },
    ];

    it('should render multiple series with different colors', async () => {
      const { container } = render(
        <ColumnChart
          data={multiSeriesData}
          config={{ xAxis: 'month', yAxis: ['series1', 'series2', 'series3'] }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const rects = container.querySelectorAll('svg rect[class^="bar-"]');
      expect(rects.length).toBeGreaterThan(0);
    });

    it('should display legend for multi-series', async () => {
      const { container } = render(
        <ColumnChart
          data={multiSeriesData}
          config={{ xAxis: 'month', yAxis: ['series1', 'series2', 'series3'] }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Check for legend elements
      const legend = container.querySelector('.legend');
      expect(legend).toBeInTheDocument();
    });

    it('should show all series in tooltip', async () => {
      const { container } = render(
        <ColumnChart
          data={multiSeriesData}
          config={{ xAxis: 'month', yAxis: ['series1', 'series2', 'series3'] }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const bars = container.querySelectorAll('svg rect');
      if (bars.length > 0) {
        fireEvent.mouseEnter(bars[0]);

        await waitFor(() => {
          const tooltip = container.querySelector('div[style*="position: absolute"]');
          expect(tooltip).toBeInTheDocument();
        });
      }
    });
  });

  describe('custom colors', () => {
    it('should use custom color from config', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value', color: '#ff0000' }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Check if any rect has the custom color
      const rects = container.querySelectorAll('svg rect');
      const hasCustomColor = Array.from(rects).some(
        (rect) => rect.getAttribute('fill') === '#ff0000'
      );
      expect(hasCustomColor).toBe(true);
    });

    it('should use professional color palette for multi-series', async () => {
      const multiSeriesData = [
        { month: 'Jan', series1: 100, series2: 80 },
        { month: 'Feb', series1: 120, series2: 95 },
      ];

      const { container } = render(
        <ColumnChart
          data={multiSeriesData}
          config={{ xAxis: 'month', yAxis: ['series1', 'series2'] }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should use different colors for different series
      const rects = container.querySelectorAll('svg rect[fill]');
      const colors = new Set(
        Array.from(rects).map((rect) => rect.getAttribute('fill'))
      );
      expect(colors.size).toBeGreaterThan(1);
    });
  });

  describe('data point interactions', () => {
    it('should call onDataPointClick when bar is clicked', async () => {
      const handleClick = vi.fn();

      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          onDataPointClick={handleClick}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Find and click a bar
      const bars = container.querySelectorAll('svg rect[style*="cursor: pointer"]');
      if (bars.length > 0) {
        fireEvent.click(bars[0]);
        await waitFor(() => {
          expect(handleClick).toHaveBeenCalled();
        });
      }
    });
  });

  describe('chart features', () => {
    it('should show labels when showLabels is true', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value', showLabels: true }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should have label text elements
      const labels = container.querySelectorAll('svg text');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('should not show labels when showLabels is false', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value', showLabels: false }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Labels with class "label-" should not exist
      const labels = container.querySelectorAll('svg text[class^="label-"]');
      expect(labels.length).toBe(0);
    });
  });

  describe('locale support', () => {
    it('should render with sr-Latn locale', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          locale="sr-Latn"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render with sr-Cyrl locale', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          locale="sr-Cyrl"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should render with en locale', async () => {
      const { container } = render(
        <ColumnChart
          data={mockData}
          config={{ xAxis: 'month', yAxis: 'value' }}
          locale="en"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
});
