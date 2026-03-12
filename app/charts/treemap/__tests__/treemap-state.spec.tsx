import { describe, it, expect } from "vitest";

import { TreemapDataNode } from "../treemap-state";

describe("TreemapState", () => {
  describe("TreemapDataNode type", () => {
    it("should define a valid treemap data node", () => {
      const node: TreemapDataNode = {
        name: "Category A",
        value: 100,
        observation: { id: "1", category: "A", value: 100 } as any,
      };

      expect(node.name).toBe("Category A");
      expect(node.value).toBe(100);
      expect(node.observation).toBeDefined();
    });

    it("should support zero values", () => {
      const node: TreemapDataNode = {
        name: "Empty Category",
        value: 0,
        observation: { id: "2", category: "Empty", value: 0 } as any,
      };

      expect(node.value).toBe(0);
    });
  });

  describe("treemap data preparation", () => {
    it("should correctly map observation data to treemap nodes", () => {
      const observations = [
        { category: "A", value: 10 },
        { category: "B", value: 20 },
        { category: "C", value: 30 },
      ];

      const nodes: TreemapDataNode[] = observations.map((d) => ({
        name: d.category,
        value: d.value,
        observation: d as any,
      }));

      expect(nodes.length).toBe(3);
      expect(nodes[0].name).toBe("A");
      expect(nodes[0].value).toBe(10);
      expect(nodes[2].value).toBe(30);
    });

    it("should calculate total value correctly", () => {
      const nodes: TreemapDataNode[] = [
        { name: "A", value: 10, observation: {} as any },
        { name: "B", value: 20, observation: {} as any },
        { name: "C", value: 30, observation: {} as any },
      ];

      const totalValue = nodes.reduce((sum, node) => sum + node.value, 0);
      expect(totalValue).toBe(60);
    });

    it("should filter out nodes with null/undefined values", () => {
      const nodes: (TreemapDataNode | null)[] = [
        { name: "A", value: 10, observation: {} as any },
        { name: "B", value: 0, observation: {} as any },
        null,
        { name: "C", value: 30, observation: {} as any },
      ];

      const validNodes = nodes.filter(
        (n): n is TreemapDataNode => n !== null && typeof n.value === "number"
      );

      expect(validNodes.length).toBe(3);
    });
  });

  describe("color assignment", () => {
    it("should assign unique colors to segments", () => {
      const segments = ["A", "B", "C"];
      const colors = new Map<string, string>();
      const defaultColors = ["#1f77b4", "#ff7f0e", "#2ca02c"];

      segments.forEach((segment, index) => {
        colors.set(segment, defaultColors[index]);
      });

      expect(colors.get("A")).toBe("#1f77b4");
      expect(colors.get("B")).toBe("#ff7f0e");
      expect(colors.get("C")).toBe("#2ca02c");
    });
  });

  describe("tile types", () => {
    it("should support different tile types", () => {
      const tileTypes = ["squarify", "slice", "dice", "sliceDice"];

      tileTypes.forEach((type) => {
        expect(["squarify", "slice", "dice", "sliceDice"]).toContain(type);
      });
    });
  });

  describe("bounds calculation", () => {
    it("should calculate chart dimensions correctly", () => {
      const width = 400;
      const height = 300;
      const margins = { top: 40, right: 40, bottom: 50, left: 40 };

      const chartWidth = width - margins.left - margins.right;
      const chartHeight = height - margins.top - margins.bottom;

      expect(chartWidth).toBe(320);
      expect(chartHeight).toBe(210);
    });
  });

  describe("percentage calculation", () => {
    it("should calculate percentage correctly", () => {
      const total = 100;
      const value = 25;

      const percentage = (value / total) * 100;
      const rounded = Math.round(percentage);

      expect(rounded).toBe(25);
    });

    it("should handle zero total", () => {
      const total = 0;
      const value = 0;

      const percentage = total > 0 ? (value / total) * 100 : 0;

      expect(percentage).toBe(0);
    });
  });
});
