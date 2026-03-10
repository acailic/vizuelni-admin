import { describe, expect, it } from "vitest";

import {
  isSankeyConfig,
  SankeyConfig,
  SankeyNode,
  SankeyLink,
} from "../sankey-types";

describe("Sankey Types", () => {
  describe("SankeyConfig", () => {
    it("should define a valid sankey config", () => {
      const config: SankeyConfig = {
        chartType: "sankey",
        fields: {
          nodes: {
            componentId: "nodeField",
            type: "nominal",
          },
          links: {
            source: {
              componentId: "sourceField",
            },
            target: {
              componentId: "targetField",
            },
            value: {
              componentId: "valueField",
              type: "quantitative",
            },
          },
        },
      };

      expect(config.chartType).toBe("sankey");
      expect(config.fields.nodes.componentId).toBe("nodeField");
      expect(config.fields.links.source.componentId).toBe("sourceField");
      expect(config.fields.links.target.componentId).toBe("targetField");
      expect(config.fields.links.value.componentId).toBe("valueField");
    });

    it("should support optional visual options", () => {
      const config: SankeyConfig = {
        chartType: "sankey",
        fields: {
          nodes: {
            componentId: "nodeField",
            type: "nominal",
          },
          links: {
            source: {
              componentId: "sourceField",
            },
            target: {
              componentId: "targetField",
            },
            value: {
              componentId: "valueField",
              type: "quantitative",
            },
          },
        },
        visualOptions: {
          nodeWidth: 24,
          nodePadding: 16,
          nodeAlignment: "justify",
          enableFlowHighlight: true,
          enableAnimations: true,
        },
      };

      expect(config.visualOptions?.nodeWidth).toBe(24);
      expect(config.visualOptions?.nodePadding).toBe(16);
      expect(config.visualOptions?.nodeAlignment).toBe("justify");
      expect(config.visualOptions?.enableFlowHighlight).toBe(true);
      expect(config.visualOptions?.enableAnimations).toBe(true);
    });
  });

  describe("isSankeyConfig", () => {
    it("should return true for sankey config", () => {
      const config = {
        chartType: "sankey",
        fields: {
          nodes: {
            componentId: "nodeField",
            type: "nominal" as const,
          },
          links: {
            source: {
              componentId: "sourceField",
            },
            target: {
              componentId: "targetField",
            },
            value: {
              componentId: "valueField",
              type: "quantitative" as const,
            },
          },
        },
      };

      expect(isSankeyConfig(config)).toBe(true);
    });

    it("should return false for non-sankey config", () => {
      const config = {
        chartType: "bar",
        fields: {},
      };

      expect(isSankeyConfig(config)).toBe(false);
    });

    it("should return false for pie config", () => {
      const config = {
        chartType: "pie",
        fields: {},
      };

      expect(isSankeyConfig(config)).toBe(false);
    });

    it("should return false for treemap config", () => {
      const config = {
        chartType: "treemap",
        fields: {},
      };

      expect(isSankeyConfig(config)).toBe(false);
    });
  });

  describe("SankeyNode", () => {
    it("should define a valid sankey node", () => {
      const node: SankeyNode = {
        id: "node1",
        name: "Node 1",
        color: "#4e79a7",
        incomingValue: 100,
        outgoingValue: 80,
        depth: 0,
        x0: 0,
        x1: 24,
        y0: 10,
        y1: 50,
      };

      expect(node.id).toBe("node1");
      expect(node.name).toBe("Node 1");
      expect(node.color).toBe("#4e79a7");
      expect(node.incomingValue).toBe(100);
      expect(node.outgoingValue).toBe(80);
    });

    it("should support minimal node definition", () => {
      const node: SankeyNode = {
        id: "node1",
        name: "Node 1",
      };

      expect(node.id).toBe("node1");
      expect(node.name).toBe("Node 1");
      expect(node.color).toBeUndefined();
    });
  });

  describe("SankeyLink", () => {
    it("should define a valid sankey link", () => {
      const sourceNode: SankeyNode = {
        id: "source",
        name: "Source Node",
      };

      const targetNode: SankeyNode = {
        id: "target",
        name: "Target Node",
      };

      const link: SankeyLink = {
        source: sourceNode,
        target: targetNode,
        value: 50,
        color: "#4e79a7",
        width: 10,
        y0: 15,
        y1: 25,
      };

      expect(link.source.id).toBe("source");
      expect(link.target.id).toBe("target");
      expect(link.value).toBe(50);
      expect(link.color).toBe("#4e79a7");
      expect(link.width).toBe(10);
    });

    it("should support minimal link definition", () => {
      const sourceNode: SankeyNode = {
        id: "source",
        name: "Source Node",
      };

      const targetNode: SankeyNode = {
        id: "target",
        name: "Target Node",
      };

      const link: SankeyLink = {
        source: sourceNode,
        target: targetNode,
        value: 25,
      };

      expect(link.source.id).toBe("source");
      expect(link.target.id).toBe("target");
      expect(link.value).toBe(25);
      expect(link.color).toBeUndefined();
    });
  });
});
