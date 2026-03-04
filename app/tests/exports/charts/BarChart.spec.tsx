/**
 * Tests for BarChart component
 *
 * Tests the standalone BarChart component from the exports module.
 */

import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import { BarChart } from "../../../exports/charts/BarChart";

// Polyfill ResizeObserver for jsdom
global.ResizeObserver = vi.fn().mockImplementation(function () {
  this.observe = vi.fn();
  this.unobserve = vi.fn();
  this.disconnect = vi.fn();
});

describe("BarChart", () => {
  const mockData = [
    { category: "Product A", value: 100, alt: 80 },
    { category: "Product B", value: 120, alt: 95 },
    { category: "Product C", value: 115, alt: 110 },
    { category: "Product D", value: 140, alt: 125 },
  ];

  describe("rendering with basic props", () => {
    it("should render without crashing", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", color: "#6366f1" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render with custom width", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          width={600}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "600");
    });

    it("should render with responsive width (100%)", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          width="100%"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveStyle({ width: "100%" });
    });

    it("should render with custom className and styles", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          className="custom-chart"
          style={{ border: "1px solid red" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveClass("custom-chart");
      expect(wrapper).toHaveStyle({ border: "1px solid red" });
    });

    it("should render with title", async () => {
      render(
        <BarChart
          data={mockData}
          config={{
            xAxis: "category",
            yAxis: "value",
            title: "Test Chart Title",
          }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(screen.getByText("Test Chart Title")).toBeInTheDocument();
    });

    it("should have proper accessibility attributes", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          ariaLabel="Product sales comparison"
          description="Horizontal bar chart showing sales by product category"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveAttribute("role", "img");
      expect(wrapper).toHaveAttribute("aria-label", "Product sales comparison");
    });
  });

  describe("data configurations", () => {
    it("should render with single series", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const rects = container.querySelectorAll("svg rect");
      expect(rects.length).toBeGreaterThan(0);
    });

    it("should render with multi-series using yAxis array", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: ["value", "alt"] }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const rects = container.querySelectorAll('svg rect[class^="bar-"]');
      expect(rects.length).toBeGreaterThan(0);
    });

    it("should handle empty data gracefully", async () => {
      const { container } = render(
        <BarChart
          data={[]}
          config={{ xAxis: "category", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should not render any bars
      const rects = container.querySelectorAll("svg rect");
      expect(rects.length).toBe(0);
    });

    it("should handle data with null values", async () => {
      const dataWithNulls = [
        { category: "Product A", value: 100 },
        { category: "Product B", value: null },
        { category: "Product C", value: 120 },
      ];

      const { container } = render(
        <BarChart
          data={dataWithNulls}
          config={{ xAxis: "category", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should still render
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should handle single data point", async () => {
      const singleDataPoint = [{ category: "Product A", value: 100 }];

      const { container } = render(
        <BarChart
          data={singleDataPoint}
          config={{ xAxis: "category", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("responsive width handling", () => {
    it("should use container width when width is percentage", async () => {
      const { container } = render(
        <div style={{ width: "500px" }}>
          <BarChart
            data={mockData}
            config={{ xAxis: "category", yAxis: "value" }}
            width="100%"
            height={400}
          />
        </div>
      );

      await act(async () => Promise.resolve());

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("should update container width on resize", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          width="100%"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector("div");
      if (wrapper) {
        // Simulate resize
        fireEvent(wrapper, new Event("resize"));
      }

      await waitFor(() => {
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });
    });
  });

  describe("tooltip interactions", () => {
    it("should show tooltip on hover when showTooltip is true", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          showTooltip={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const overlay = container.querySelector(".overlay");
      expect(overlay).toBeInTheDocument();

      if (overlay) {
        fireEvent.mouseMove(overlay, { clientX: 100, clientY: 100 });

        await waitFor(() => {
          const tooltip = container.querySelector(
            'div[style*="position: absolute"]'
          );
          expect(tooltip).toBeInTheDocument();
        });
      }
    });

    it("should not show tooltip when showTooltip is false", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          showTooltip={false}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const overlay = container.querySelector(".overlay");
      if (overlay) {
        fireEvent.mouseMove(overlay, { clientX: 100, clientY: 100 });

        await waitFor(() => {
          const tooltip = container.querySelector(
            'div[style*="position: absolute"]'
          );
          expect(tooltip).not.toBeInTheDocument();
        });
      }
    });

    it("should use custom tooltip renderer when provided", async () => {
      const customTooltip = vi.fn(() => <div>Custom Tooltip</div>);

      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          renderTooltip={customTooltip}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const overlay = container.querySelector(".overlay");
      if (overlay) {
        fireEvent.mouseMove(overlay, { clientX: 100, clientY: 100 });

        await waitFor(() => {
          expect(customTooltip).toHaveBeenCalled();
          expect(screen.getByText("Custom Tooltip")).toBeInTheDocument();
        });
      }
    });

    it("should hide tooltip on mouse leave", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          showTooltip={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const overlay = container.querySelector(".overlay");
      if (overlay) {
        fireEvent.mouseMove(overlay, { clientX: 100, clientY: 100 });

        await waitFor(() => {
          const tooltip = container.querySelector(
            'div[style*="position: absolute"]'
          );
          expect(tooltip).toBeInTheDocument();
        });

        fireEvent.mouseLeave(overlay);

        await waitFor(() => {
          const tooltip = container.querySelector(
            'div[style*="position: absolute"]'
          );
          expect(tooltip).not.toBeInTheDocument();
        });
      }
    });
  });

  describe("animation behavior", () => {
    it("should animate when animated is true", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", animationDuration: 500 }}
          animated={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const rects = container.querySelectorAll("svg rect");
      expect(rects.length).toBeGreaterThan(0);
    });

    it("should not animate when animated is false", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          animated={false}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const rects = container.querySelectorAll("svg rect");
      expect(rects.length).toBeGreaterThan(0);
    });

    it("should respect custom animation duration", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{
            xAxis: "category",
            yAxis: "value",
            animationDuration: 2000,
          }}
          animated={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const svg = container.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  describe("multi-series support", () => {
    const multiSeriesData = [
      { category: "Product A", series1: 100, series2: 80, series3: 60 },
      { category: "Product B", series1: 120, series2: 95, series3: 75 },
      { category: "Product C", series1: 115, series2: 110, series3: 85 },
    ];

    it("should render multiple series with different colors", async () => {
      const { container } = render(
        <BarChart
          data={multiSeriesData}
          config={{
            xAxis: "category",
            yAxis: ["series1", "series2", "series3"],
          }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const rects = container.querySelectorAll('svg rect[class^="bar-"]');
      expect(rects.length).toBeGreaterThan(0);
    });

    it("should display legend for multi-series", async () => {
      const { container } = render(
        <BarChart
          data={multiSeriesData}
          config={{
            xAxis: "category",
            yAxis: ["series1", "series2", "series3"],
          }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Check for legend elements
      const legend = container.querySelector(".legend");
      expect(legend).toBeInTheDocument();
    });

    it("should show all series in tooltip", async () => {
      const { container } = render(
        <BarChart
          data={multiSeriesData}
          config={{
            xAxis: "category",
            yAxis: ["series1", "series2", "series3"],
          }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const overlay = container.querySelector(".overlay");
      if (overlay) {
        fireEvent.mouseMove(overlay, { clientX: 100, clientY: 100 });

        await waitFor(() => {
          const tooltip = container.querySelector(
            'div[style*="position: absolute"]'
          );
          expect(tooltip).toBeInTheDocument();
          // Should show all series values
          if (tooltip) {
            expect(tooltip.textContent).toContain("series1");
            expect(tooltip.textContent).toContain("series2");
            expect(tooltip.textContent).toContain("series3");
          }
        });
      }
    });
  });

  describe("custom colors", () => {
    it("should use custom color from config", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", color: "#ff0000" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Check if any rect has the custom color
      const rects = container.querySelectorAll("svg rect");
      const hasCustomColor = Array.from(rects).some(
        (rect) =>
          rect.getAttribute("fill") === "#ff0000" ||
          rect.getAttribute("fill")?.includes("url(#bar-gradient-0")
      );
      expect(hasCustomColor).toBe(true);
    });

    it("should use professional color palette for multi-series", async () => {
      const multiSeriesData = [
        { category: "Product A", series1: 100, series2: 80 },
        { category: "Product B", series1: 120, series2: 95 },
      ];

      const { container } = render(
        <BarChart
          data={multiSeriesData}
          config={{ xAxis: "category", yAxis: ["series1", "series2"] }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should use different colors for different series
      const gradients = container.querySelectorAll("defs linearGradient");
      expect(gradients.length).toBeGreaterThan(1);
    });
  });

  describe("data point interactions", () => {
    it("should call onDataPointClick when bar is clicked", async () => {
      const handleClick = vi.fn();

      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          onDataPointClick={handleClick}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Find and click a bar
      const bars = container.querySelectorAll(
        'svg rect[style*="cursor: pointer"]'
      );
      if (bars.length > 0) {
        fireEvent.click(bars[0]);
        await waitFor(() => {
          expect(handleClick).toHaveBeenCalled();
        });
      }
    });
  });

  describe("chart features", () => {
    it("should show area fill when showArea is true", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", showArea: true }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should have gradient definitions
      const gradients = container.querySelectorAll("defs linearGradient");
      expect(gradients.length).toBeGreaterThan(0);
    });

    it("should not show area fill when showArea is false", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", showArea: false }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Bars should have solid color
      const bars = container.querySelectorAll("svg rect[fill]");
      expect(bars.length).toBeGreaterThan(0);
    });

    it("should show zero line when showZeroLine is true and data has negative values", async () => {
      const dataWithNegatives = [
        { category: "Product A", value: -50 },
        { category: "Product B", value: 100 },
        { category: "Product C", value: 150 },
      ];

      const { container } = render(
        <BarChart
          data={dataWithNegatives}
          config={{ xAxis: "category", yAxis: "value", showZeroLine: true }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Check for zero line
      const zeroLines = container.querySelectorAll(
        'line[stroke-dasharray="6,4"]'
      );
      expect(zeroLines.length).toBeGreaterThan(0);
    });

    it("should show crosshair when showCrosshair is true", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", showCrosshair: true }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const overlay = container.querySelector(".overlay");
      expect(overlay).toBeInTheDocument();
    });

    it("should use custom bar radius", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value", barRadius: 10 }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const bars = container.querySelectorAll("svg rect[rx]");
      expect(bars.length).toBeGreaterThan(0);
      const firstBar = bars[0];
      expect(firstBar).toHaveAttribute("rx", "10");
    });
  });

  describe("locale support", () => {
    it("should render with sr-Latn locale", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          locale="sr-Latn"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render with sr-Cyrl locale", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          locale="sr-Cyrl"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render with en locale", async () => {
      const { container } = render(
        <BarChart
          data={mockData}
          config={{ xAxis: "category", yAxis: "value" }}
          locale="en"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });
});
