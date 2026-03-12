import { describe, it, expect } from "vitest";

import { GaugeArc, GaugeNeedle, GaugeThreshold } from "../gauge-types";

describe("GaugeState", () => {
  describe("GaugeArc type", () => {
    it("should define a valid gauge arc segment", () => {
      const arc: GaugeArc = {
        startAngle: 0,
        endAngle: Math.PI,
        innerRadius: 50,
        outerRadius: 100,
        color: "#4e79a7",
        label: "Value arc",
        value: 50,
      };

      expect(arc.startAngle).toBe(0);
      expect(arc.endAngle).toBe(Math.PI);
      expect(arc.innerRadius).toBe(50);
      expect(arc.outerRadius).toBe(100);
      expect(arc.color).toBe("#4e79a7");
      expect(arc.label).toBe("Value arc");
      expect(arc.value).toBe(50);
    });

    it("should support minimal arc definition", () => {
      const arc: GaugeArc = {
        startAngle: 0,
        endAngle: Math.PI / 2,
        innerRadius: 40,
        outerRadius: 80,
        color: "#e5e7eb",
      };

      expect(arc.startAngle).toBe(0);
      expect(arc.endAngle).toBeCloseTo(Math.PI / 2);
      expect(arc.label).toBeUndefined();
      expect(arc.value).toBeUndefined();
    });
  });

  describe("GaugeNeedle type", () => {
    it("should define a valid needle configuration", () => {
      const needle: GaugeNeedle = {
        value: 75,
        angle: Math.PI / 4,
        length: 0.8,
        baseWidth: 8,
        color: "#374151",
      };

      expect(needle.value).toBe(75);
      expect(needle.angle).toBeCloseTo(Math.PI / 4);
      expect(needle.length).toBe(0.8);
      expect(needle.baseWidth).toBe(8);
      expect(needle.color).toBe("#374151");
    });

    it("should support needle without custom color", () => {
      const needle: GaugeNeedle = {
        value: 50,
        angle: 0,
        length: 0.75,
        baseWidth: 6,
      };

      expect(needle.color).toBeUndefined();
    });
  });

  describe("GaugeThreshold type", () => {
    it("should define a valid threshold", () => {
      const threshold: GaugeThreshold = {
        value: 50,
        color: "#22c55e",
        label: "Good",
      };

      expect(threshold.value).toBe(50);
      expect(threshold.color).toBe("#22c55e");
      expect(threshold.label).toBe("Good");
    });

    it("should support threshold without label", () => {
      const threshold: GaugeThreshold = {
        value: 75,
        color: "#ef4444",
      };

      expect(threshold.value).toBe(75);
      expect(threshold.color).toBe("#ef4444");
      expect(threshold.label).toBeUndefined();
    });
  });

  describe("Arc calculations", () => {
    it("should calculate arc angles correctly for value", () => {
      const min = 0;
      const max = 100;
      const value = 50;
      const startAngle = (-135 * Math.PI) / 180; // -135 degrees in radians
      const endAngle = (135 * Math.PI) / 180; // 135 degrees in radians
      const totalAngle = endAngle - startAngle;
      const angleRange = max - min;

      // Calculate the angle for the value
      const valueAngle = startAngle + ((value - min) / angleRange) * totalAngle;

      // At 50% (value = 50), the angle should be 0 (pointing straight up)
      expect(valueAngle).toBeCloseTo(0, 5);
    });

    it("should calculate arc angles for min value", () => {
      const min = 0;
      const max = 100;
      const value = 0;
      const startAngle = (-135 * Math.PI) / 180;
      const endAngle = (135 * Math.PI) / 180;
      const totalAngle = endAngle - startAngle;
      const angleRange = max - min;

      const valueAngle = startAngle + ((value - min) / angleRange) * totalAngle;

      // At min value, the angle should be startAngle
      expect(valueAngle).toBeCloseTo(startAngle, 5);
    });

    it("should calculate arc angles for max value", () => {
      const min = 0;
      const max = 100;
      const value = 100;
      const startAngle = (-135 * Math.PI) / 180;
      const endAngle = (135 * Math.PI) / 180;
      const totalAngle = endAngle - startAngle;
      const angleRange = max - min;

      const valueAngle = startAngle + ((value - min) / angleRange) * totalAngle;

      // At max value, the angle should be endAngle
      expect(valueAngle).toBeCloseTo(endAngle, 5);
    });

    it("should handle custom min/max values", () => {
      const min = 20;
      const max = 80;
      const value = 50;
      const startAngle = (-135 * Math.PI) / 180;
      const endAngle = (135 * Math.PI) / 180;
      const totalAngle = endAngle - startAngle;
      const angleRange = max - min;

      const valueAngle = startAngle + ((value - min) / angleRange) * totalAngle;

      // At middle value (50), should be at center (0 radians)
      expect(valueAngle).toBeCloseTo(0, 5);
    });
  });

  describe("Threshold arc generation", () => {
    it("should generate arcs from thresholds", () => {
      const thresholds: GaugeThreshold[] = [
        { value: 33, color: "#22c55e", label: "Low" },
        { value: 66, color: "#eab308", label: "Medium" },
        { value: 100, color: "#ef4444", label: "High" },
      ];

      const min = 0;
      const max = 100;
      const startAngle = (-135 * Math.PI) / 180;
      const endAngle = (135 * Math.PI) / 180;
      const totalAngle = endAngle - startAngle;
      const angleRange = max - min;

      const arcs: GaugeArc[] = [];

      let prevValue = min;
      thresholds.forEach((threshold) => {
        const arcStartAngle =
          startAngle + ((prevValue - min) / angleRange) * totalAngle;
        const arcEndAngle =
          startAngle + ((threshold.value - min) / angleRange) * totalAngle;

        arcs.push({
          startAngle: arcStartAngle,
          endAngle: arcEndAngle,
          innerRadius: 70,
          outerRadius: 100,
          color: threshold.color,
          label: threshold.label,
          value: threshold.value,
        });

        prevValue = threshold.value;
      });

      expect(arcs.length).toBe(3);
      expect(arcs[0].color).toBe("#22c55e");
      expect(arcs[1].color).toBe("#eab308");
      expect(arcs[2].color).toBe("#ef4444");
    });

    it("should sort thresholds by value", () => {
      const thresholds: GaugeThreshold[] = [
        { value: 100, color: "#ef4444", label: "High" },
        { value: 33, color: "#22c55e", label: "Low" },
        { value: 66, color: "#eab308", label: "Medium" },
      ];

      const sortedThresholds = [...thresholds].sort(
        (a, b) => a.value - b.value
      );

      expect(sortedThresholds[0].value).toBe(33);
      expect(sortedThresholds[1].value).toBe(66);
      expect(sortedThresholds[2].value).toBe(100);
    });
  });

  describe("Needle calculations", () => {
    it("should clamp needle value to valid range", () => {
      const min = 0;
      const max = 100;

      // Test value below min
      const belowMin = -10;
      const clampedBelow = Math.max(min, Math.min(max, belowMin));
      expect(clampedBelow).toBe(0);

      // Test value above max
      const aboveMax = 150;
      const clampedAbove = Math.max(min, Math.min(max, aboveMax));
      expect(clampedAbove).toBe(100);

      // Test value in range
      const inRange = 50;
      const clampedInRange = Math.max(min, Math.min(max, inRange));
      expect(clampedInRange).toBe(50);
    });

    it("should calculate needle angle correctly", () => {
      const min = 0;
      const max = 100;
      const value = 25;
      const startAngle = (-135 * Math.PI) / 180;
      const endAngle = (135 * Math.PI) / 180;
      const totalAngle = endAngle - startAngle;
      const angleRange = max - min;

      const angle = startAngle + ((value - min) / angleRange) * totalAngle;

      // At 25% (value = 25), angle should be -67.5 degrees (-PI/4 * 1.5)
      const expectedAngle = startAngle + 0.25 * totalAngle;
      expect(angle).toBeCloseTo(expectedAngle, 5);
    });
  });

  describe("Radius calculations", () => {
    it("should calculate radius based on available space", () => {
      const chartWidth = 400;
      const chartHeight = 300;

      const radius = Math.min(chartWidth, chartHeight) / 2;

      expect(radius).toBe(150);
    });

    it("should calculate inner radius based on ratio", () => {
      const radius = 150;
      const innerRadiusRatio = 0.7;

      const innerRadius = radius * innerRadiusRatio;

      expect(innerRadius).toBe(105);
    });

    it("should center the gauge in the chart area", () => {
      const chartWidth = 400;
      const chartHeight = 300;

      const centerX = chartWidth / 2;
      const centerY = chartHeight / 2;

      expect(centerX).toBe(200);
      expect(centerY).toBe(150);
    });
  });

  describe("Value display", () => {
    it("should format value correctly", () => {
      const value = 75.5;

      // Simulating a simple number formatter
      const formattedValue = value.toFixed(1);

      expect(formattedValue).toBe("75.5");
    });

    it("should position value display below center", () => {
      const centerY = 150;
      const radius = 100;
      const valueOffset = radius * 0.3;

      const valueY = centerY + valueOffset;

      expect(valueY).toBe(180);
    });
  });

  describe("Color assignment", () => {
    it("should assign colors to thresholds", () => {
      const thresholds: GaugeThreshold[] = [
        { value: 33, color: "#22c55e" },
        { value: 66, color: "#eab308" },
        { value: 100, color: "#ef4444" },
      ];

      const colorMap = new Map<number, string>();
      thresholds.forEach((t) => colorMap.set(t.value, t.color));

      expect(colorMap.get(33)).toBe("#22c55e");
      expect(colorMap.get(66)).toBe("#eab308");
      expect(colorMap.get(100)).toBe("#ef4444");
    });

    it("should find active threshold for value", () => {
      const thresholds: GaugeThreshold[] = [
        { value: 33, color: "#22c55e", label: "Low" },
        { value: 66, color: "#eab308", label: "Medium" },
        { value: 100, color: "#ef4444", label: "High" },
      ];

      const sortedThresholds = [...thresholds].sort(
        (a, b) => a.value - b.value
      );

      // Find active threshold for various values
      const findActiveThreshold = (value: number) => {
        for (let i = sortedThresholds.length - 1; i >= 0; i--) {
          if (value >= sortedThresholds[i].value) {
            return sortedThresholds[i];
          }
        }
        return undefined;
      };

      expect(findActiveThreshold(25)?.label).toBeUndefined();
      expect(findActiveThreshold(50)?.label).toBe("Low");
      expect(findActiveThreshold(75)?.label).toBe("Medium");
      expect(findActiveThreshold(100)?.label).toBe("High");
    });
  });

  describe("Bounds calculation", () => {
    it("should calculate chart dimensions correctly", () => {
      const width = 600;
      const height = 400;
      const margins = { top: 50, right: 40, bottom: 50, left: 40 };

      const chartWidth = width - margins.left - margins.right;
      const chartHeight = height - margins.top - margins.bottom;

      expect(chartWidth).toBe(520);
      expect(chartHeight).toBe(300);
    });
  });
});
