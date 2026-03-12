import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { LegendIcon } from "../legend-color";

describe("LegendIcon diamond symbol", () => {
  it("should render diamond symbol", () => {
    const { container } = render(
      <LegendIcon symbol="diamond" size={12} fill="#3B82F6" />
    );
    const polygon = container.querySelector("polygon");
    expect(polygon).toBeInTheDocument();
    expect(polygon?.getAttribute("fill")).toBe("#3B82F6");
  });

  it("should have diamond points centered at 0.5, 0.5", () => {
    const { container } = render(
      <LegendIcon symbol="diamond" size={12} fill="#3B82F6" />
    );
    const polygon = container.querySelector("polygon");
    const points = polygon?.getAttribute("points");
    // Diamond should have 4 points forming a diamond shape
    expect(points).toContain("0.5,0");
    expect(points).toContain("1,0.5");
    expect(points).toContain("0.5,1");
    expect(points).toContain("0,0.5");
  });
});
