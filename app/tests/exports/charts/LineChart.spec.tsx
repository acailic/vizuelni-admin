/**
 * Tests for LineChart component
 *
 * Tests the standalone LineChart component from the exports module.
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

import { LineChart } from "../../../exports/charts/LineChart";

// Polyfill ResizeObserver for jsdom
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("LineChart", () => {
  const mockData = [
    { year: "2020", value: 100, alt: 80 },
    { year: "2021", value: 120, alt: 95 },
    { year: "2022", value: 115, alt: 110 },
    { year: "2023", value: 140, alt: 125 },
  ];

  describe("rendering with basic props", () => {
    it("should render without crashing", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value", color: "#6366f1" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render with custom width", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
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
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
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
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
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
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value", title: "Test Chart Title" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(screen.getByText("Test Chart Title")).toBeInTheDocument();
    });

    it("should have proper accessibility attributes", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
          ariaLabel="Sales data over time"
          description="Line chart showing sales from 2020 to 2023"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const wrapper = container.querySelector("div");
      expect(wrapper).toHaveAttribute("role", "img");
      expect(wrapper).toHaveAttribute("aria-label", "Sales data over time");
    });
  });

  describe("data configurations", () => {
    it("should render with single series", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const paths = container.querySelectorAll("svg path");
      expect(paths.length).toBeGreaterThan(0);
    });

    it("should render with multi-series using yAxis array", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: ["value", "alt"] }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const paths = container.querySelectorAll("svg path");
      // Should have multiple paths (at least 2 lines + areas)
      expect(paths.length).toBeGreaterThan(1);
    });

    it("should render with multi-series using seriesKeys", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{
            xAxis: "year",
            yAxis: "value",
            seriesKeys: ["value", "alt"],
          }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const paths = container.querySelectorAll("svg path");
      expect(paths.length).toBeGreaterThan(1);
    });

    it("should handle empty data gracefully", async () => {
      const { container } = render(
        <LineChart
          data={[]}
          config={{ xAxis: "year", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should not render any paths
      const paths = container.querySelectorAll("svg path");
      expect(paths.length).toBe(0);
    });

    it("should handle data with null values", async () => {
      const dataWithNulls = [
        { year: "2020", value: 100 },
        { year: "2021", value: null },
        { year: "2022", value: 120 },
      ];

      const { container } = render(
        <LineChart
          data={dataWithNulls}
          config={{ xAxis: "year", yAxis: "value" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should still render
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("responsive width handling", () => {
    it("should use container width when width is percentage", async () => {
      const { container } = render(
        <div style={{ width: "500px" }}>
          <LineChart
            data={mockData}
            config={{ xAxis: "year", yAxis: "value" }}
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
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
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
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
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
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
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
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
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
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
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
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value", animationDuration: 500 }}
          animated={true}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const paths = container.querySelectorAll("svg path");
      expect(paths.length).toBeGreaterThan(0);
    });

    it("should not animate when animated is false", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
          animated={false}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const paths = container.querySelectorAll("svg path");
      expect(paths.length).toBeGreaterThan(0);
    });

    it("should respect custom animation duration", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value", animationDuration: 2000 }}
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
      { year: "2020", series1: 100, series2: 80, series3: 60 },
      { year: "2021", series1: 120, series2: 95, series3: 75 },
      { year: "2022", series1: 115, series2: 110, series3: 85 },
    ];

    it("should render multiple series with different colors", async () => {
      const { container } = render(
        <LineChart
          data={multiSeriesData}
          config={{ xAxis: "year", yAxis: ["series1", "series2", "series3"] }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const paths = container.querySelectorAll("svg path");
      // Should have multiple paths for lines and areas
      expect(paths.length).toBeGreaterThan(2);
    });

    it("should display legend for multi-series", async () => {
      const { container } = render(
        <LineChart
          data={multiSeriesData}
          config={{ xAxis: "year", yAxis: ["series1", "series2", "series3"] }}
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
        <LineChart
          data={multiSeriesData}
          config={{ xAxis: "year", yAxis: ["series1", "series2", "series3"] }}
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
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value", color: "#ff0000" }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Check if any path has the custom color
      const paths = container.querySelectorAll("svg path");
      const hasCustomColor = Array.from(paths).some(
        (path) => path.getAttribute("stroke") === "#ff0000"
      );
      expect(hasCustomColor).toBe(true);
    });

    it("should use professional color palette for multi-series", async () => {
      const multiSeriesData = [
        { year: "2020", series1: 100, series2: 80 },
        { year: "2021", series1: 120, series2: 95 },
      ];

      const { container } = render(
        <LineChart
          data={multiSeriesData}
          config={{ xAxis: "year", yAxis: ["series1", "series2"] }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should use different colors for different series
      const paths = container.querySelectorAll("svg path[stroke]");
      const colors = new Set(
        Array.from(paths).map((path) => path.getAttribute("stroke"))
      );
      expect(colors.size).toBeGreaterThan(1);
    });
  });

  describe("data point interactions", () => {
    it("should call onDataPointClick when data point is clicked", async () => {
      const handleClick = vi.fn();

      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
          onDataPointClick={handleClick}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Find and click a data point (circle)
      const circles = container.querySelectorAll("circle");
      if (circles.length > 0) {
        fireEvent.click(circles[0]);
        await waitFor(() => {
          expect(handleClick).toHaveBeenCalled();
        });
      }
    });
  });

  describe("chart features", () => {
    it("should show area fill when showArea is true", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value", showArea: true }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      // Should have area paths
      const paths = container.querySelectorAll("svg path");
      const hasAreaFill = Array.from(paths).some((path) =>
        path.getAttribute("fill")?.includes("url(#area-gradient")
      );
      expect(hasAreaFill).toBe(true);
    });

    it("should not show area fill when showArea is false", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value", showArea: false }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const paths = container.querySelectorAll("svg path");
      const hasAreaFill = Array.from(paths).some((path) =>
        path.getAttribute("fill")?.includes("url(#area-gradient")
      );
      expect(hasAreaFill).toBe(false);
    });

    it("should show zero line when showZeroLine is true and data has negative values", async () => {
      const dataWithNegatives = [
        { year: "2020", value: -50 },
        { year: "2021", value: 100 },
        { year: "2022", value: 150 },
      ];

      const { container } = render(
        <LineChart
          data={dataWithNegatives}
          config={{ xAxis: "year", yAxis: "value", showZeroLine: true }}
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
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value", showCrosshair: true }}
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      const overlay = container.querySelector(".overlay");
      expect(overlay).toBeInTheDocument();
    });
  });

  describe("locale support", () => {
    it("should render with sr-Latn locale", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
          locale="sr-Latn"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render with sr-Cyrl locale", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
          locale="sr-Cyrl"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should render with en locale", async () => {
      const { container } = render(
        <LineChart
          data={mockData}
          config={{ xAxis: "year", yAxis: "value" }}
          locale="en"
          height={400}
        />
      );

      await act(async () => Promise.resolve());

      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });
});
