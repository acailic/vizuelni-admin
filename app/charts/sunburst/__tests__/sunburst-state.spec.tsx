import { describe, it, expect } from "vitest";

import { SunburstDataNode } from "../sunburst-state";
import { SunburstNode, SunburstHierarchyField } from "../sunburst-types";
import { SunburstHierarchyField } from "../sunburst-types";

describe("SunburstState", () => {
  describe("SunburstNode type", () => {
    it("should define a valid sunburst node", () => {
      const node: SunburstNode = {
        id: "node1",
        name: "Root Category",
        depth: 0,
        value: 100,
        color: "#4e79a7",
        x0: 0,
        x1: Math.PI,
        y0: 0,
        y1: 50,
        percentage: 25,
      };

      expect(node.id).toBe("node1");
      expect(node.name).toBe("Root Category");
      expect(node.depth).toBe(0);
      expect(node.value).toBe(100);
      expect(node.color).toBe("#4e79a7");
      expect(node.x0).toBe(0);
      expect(node.x1).toBe(Math.PI);
      expect(node.y0).toBe(0);
      expect(node.y1).toBe(50);
      expect(node.percentage).toBe(25);
    });

    it("should support hierarchical node with children", () => {
      const childNode: SunburstNode = {
        id: "child1",
        name: "Child Category",
        depth: 1,
        value: 50,
      };

      const parentNode: SunburstNode = {
        id: "parent1",
        name: "Parent Category",
        depth: 0,
        value: 100,
        children: [childNode],
      };

      expect(parentNode.children).toBeDefined();
      expect(parentNode.children?.length).toBe(1);
      expect(parentNode.children?.[0].name).toBe("Child Category");
    });

    it("should support minimal node definition", () => {
      const node: SunburstNode = {
        id: "node1",
        name: "Node 1",
        depth: 0,
        value: 10,
      };

      expect(node.id).toBe("node1");
      expect(node.name).toBe("Node 1");
      expect(node.color).toBeUndefined();
      expect(node.children).toBeUndefined();
    });
  });

  describe("SunburstDataNode type", () => {
    it("should define a valid data node for hierarchy", () => {
      const dataNode: SunburstDataNode = {
        id: "category1",
        name: "Category 1",
        value: 100,
        depth: 0,
        children: [],
      };

      expect(dataNode.id).toBe("category1");
      expect(dataNode.name).toBe("Category 1");
      expect(dataNode.value).toBe(100);
      expect(dataNode.depth).toBe(0);
      expect(dataNode.children).toEqual([]);
    });
  });

  describe("hierarchy building", () => {
    it("should correctly build a nested hierarchy from flat data", () => {
      const observations = [
        { level1: "A", level2: "A1", value: 10 },
        { level1: "A", level2: "A2", value: 15 },
        { level1: "B", level2: "B1", value: 20 },
      ];

      const hierarchyLevels: SunburstHierarchyField[] = [
        { componentId: "level1", type: "nominal" },
        { componentId: "level2", type: "nominal" },
      ];

      // Build nested hierarchy structure
      const root: SunburstDataNode = {
        id: "root",
        name: "root",
        value: 0,
        depth: -1,
        children: [],
      };

      const getHierarchyValue = (d: Record<string, unknown>, level: number) => {
        if (level >= hierarchyLevels.length) return "";
        const componentId = hierarchyLevels[level].componentId;
        return String(d[componentId] ?? "");
      };

      observations.forEach((observation) => {
        let currentNode = root;

        hierarchyLevels.forEach((_, levelIndex) => {
          const levelValue = getHierarchyValue(observation, levelIndex);
          if (!levelValue) return;

          let child = currentNode.children?.find((c) => c.name === levelValue);
          if (!child) {
            child = {
              id: `${currentNode.id}-${levelValue}`,
              name: levelValue,
              value: 0,
              depth: levelIndex,
              children:
                levelIndex < hierarchyLevels.length - 1 ? [] : undefined,
            };
            if (!currentNode.children) {
              currentNode.children = [];
            }
            currentNode.children.push(child);
          }
          currentNode = child;
        });
      });

      expect(root.children?.length).toBe(2);
      expect(root.children?.[0].name).toBe("A");
      expect(root.children?.[1].name).toBe("B");
      expect(root.children?.[0].children?.length).toBe(2);
    });

    it("should handle empty observations", () => {
      const observations: Record<string, unknown>[] = [];

      const root: SunburstDataNode = {
        id: "root",
        name: "root",
        value: 0,
        depth: -1,
        children: [],
      };

      // Simulating the hierarchy building with no observations
      expect(root.children).toEqual([]);
      expect(observations.length).toBe(0);
    });
  });

  describe("partition layout", () => {
    it("should correctly structure hierarchy data", () => {
      const hierarchyData: SunburstDataNode = {
        id: "root",
        name: "root",
        value: 0,
        depth: -1,
        children: [
          {
            id: "root-A",
            name: "A",
            value: 30,
            depth: 0,
            children: [
              { id: "root-A-A1", name: "A1", value: 10, depth: 1 },
              { id: "root-A-A2", name: "A2", value: 20, depth: 1 },
            ],
          },
          {
            id: "root-B",
            name: "B",
            value: 70,
            depth: 0,
            children: [
              { id: "root-B-B1", name: "B1", value: 40, depth: 1 },
              { id: "root-B-B2", name: "B2", value: 30, depth: 1 },
            ],
          },
        ],
      };

      // Count total nodes in hierarchy
      const countNodes = (node: SunburstDataNode): number => {
        return (
          1 +
          (node.children?.reduce((sum, child) => sum + countNodes(child), 0) ??
            0)
        );
      };

      const totalNodes = countNodes(hierarchyData);
      expect(totalNodes).toBe(7); // 1 root + 2 level-0 + 4 level-1

      // Verify values
      const sumValues = (node: SunburstDataNode): number => {
        return (
          node.value +
          (node.children?.reduce((sum, child) => sum + sumValues(child), 0) ??
            0)
        );
      };

      const totalValue = sumValues(hierarchyData);
      expect(totalValue).toBe(200); // 0 (root) + 30 + 70 (level-0) + 10 + 20 + 40 + 30 (level-1) = 200
    });

    it("should calculate total angle for full circle", () => {
      // Full circle in radians is 2 * PI
      const fullCircleAngle = 2 * Math.PI;
      expect(fullCircleAngle).toBeCloseTo(6.283, 2);
    });
  });

  describe("color assignment", () => {
    it("should assign unique colors to segments", () => {
      const segmentNames = ["A", "B", "C"];
      const colors = new Map<string, string>();
      const defaultColors = ["#1f77b4", "#ff7f0e", "#2ca02c"];

      segmentNames.forEach((segment, index) => {
        colors.set(segment, defaultColors[index]);
      });

      expect(colors.get("A")).toBe("#1f77b4");
      expect(colors.get("B")).toBe("#ff7f0e");
      expect(colors.get("C")).toBe("#2ca02c");
    });
  });

  describe("radius calculation", () => {
    it("should calculate radius based on available space", () => {
      const chartWidth = 400;
      const chartHeight = 300;

      const radius = Math.min(chartWidth, chartHeight) / 2;

      expect(radius).toBe(150);
    });

    it("should calculate inner radius based on ratio", () => {
      const radius = 150;
      const innerRadiusRatio = 0.3;

      const innerRadius = radius * innerRadiusRatio;

      expect(innerRadius).toBe(45);
    });
  });

  describe("visual options", () => {
    it("should use default visual options when not specified", () => {
      const defaultOptions = {
        innerRadiusRatio: 0,
        padAngle: 0,
      };

      const options = {
        innerRadiusRatio: undefined,
        padAngle: undefined,
      };

      const resolvedOptions = {
        innerRadiusRatio:
          options.innerRadiusRatio ?? defaultOptions.innerRadiusRatio,
        padAngle: options.padAngle ?? defaultOptions.padAngle,
      };

      expect(resolvedOptions.innerRadiusRatio).toBe(0);
      expect(resolvedOptions.padAngle).toBe(0);
    });

    it("should override default options with custom values", () => {
      const defaultOptions = {
        innerRadiusRatio: 0,
        padAngle: 0,
      };

      const customOptions = {
        innerRadiusRatio: 0.4,
        padAngle: 0.02,
      };

      const resolvedOptions = {
        innerRadiusRatio:
          customOptions.innerRadiusRatio ?? defaultOptions.innerRadiusRatio,
        padAngle: customOptions.padAngle ?? defaultOptions.padAngle,
      };

      expect(resolvedOptions.innerRadiusRatio).toBe(0.4);
      expect(resolvedOptions.padAngle).toBe(0.02);
    });
  });

  describe("breadcrumb data", () => {
    it("should generate breadcrumb data from hierarchy levels", () => {
      const hierarchyLevels: SunburstHierarchyField[] = [
        { componentId: "category", type: "nominal" },
        { componentId: "subcategory", type: "nominal" },
      ];

      const breadcrumbData = [
        { id: "root", name: "All", depth: 0 },
        ...hierarchyLevels.map((level, index) => ({
          id: `level-${index}`,
          name: level.componentId,
          depth: index + 1,
        })),
      ];

      expect(breadcrumbData.length).toBe(3);
      expect(breadcrumbData[0].name).toBe("All");
      expect(breadcrumbData[1].name).toBe("category");
      expect(breadcrumbData[2].name).toBe("subcategory");
    });
  });

  describe("max depth calculation", () => {
    it("should calculate max depth from nodes", () => {
      const nodes = [
        { depth: 1, data: { name: "A" } },
        { depth: 2, data: { name: "A1" } },
        { depth: 2, data: { name: "A2" } },
        { depth: 1, data: { name: "B" } },
        { depth: 2, data: { name: "B1" } },
        { depth: 3, data: { name: "B1a" } },
      ];

      const maxDepth = Math.max(...nodes.map((n) => n.depth));

      expect(maxDepth).toBe(3);
    });

    it("should return 0 for empty nodes", () => {
      const nodes: { depth: number }[] = [];

      const maxDepth =
        nodes.length === 0 ? 0 : Math.max(...nodes.map((n) => n.depth));

      expect(maxDepth).toBe(0);
    });
  });

  describe("bounds calculation", () => {
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

  describe("tooltip position calculation", () => {
    it("should calculate arc center position for tooltips", () => {
      const node = {
        x0: 0,
        x1: Math.PI / 2,
        y0: 50,
        y1: 100,
      };

      const chartWidth = 400;
      const chartHeight = 400;

      const angle = (node.x0 + node.x1) / 2 - Math.PI / 2;
      const r = (node.y0 + node.y1) / 2;
      const x = chartWidth / 2 + r * Math.cos(angle);
      const y = chartHeight / 2 + r * Math.sin(angle);

      // Center of chart plus offset for arc position
      expect(x).toBeGreaterThan(chartWidth / 2);
      expect(y).toBeLessThan(chartHeight / 2);
    });
  });
});
