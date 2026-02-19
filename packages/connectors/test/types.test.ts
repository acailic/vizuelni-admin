import { describe, it, expectTypeOf } from "vitest";
import type {
  DataConnector,
  ConnectorResult,
  DataSchema,
  FieldSchema,
} from "../src/types";

describe("Connector Types", () => {
  it("DataConnector should have required interface", () => {
    const connector: DataConnector<{ url: string }> = {
      type: "test",
      fetch: async (config) => {
        return {
          data: [],
          schema: { fields: [] },
        };
      },
    };
    expectTypeOf(connector).toMatchTypeOf<DataConnector<{ url: string }>>();
  });

  it("ConnectorResult should have data and schema", () => {
    const result: ConnectorResult = {
      data: [{ x: 1, y: 2 }],
      schema: {
        fields: [
          { name: "x", type: "number" },
          { name: "y", type: "number" },
        ],
      },
    };
    expectTypeOf(result).toMatchTypeOf<ConnectorResult>();
  });

  it("FieldSchema should define field structure", () => {
    const field: FieldSchema = {
      name: "date",
      type: "date",
      title: "Date",
      description: "The date of the observation",
    };
    expectTypeOf(field).toMatchTypeOf<FieldSchema>();
  });
});
