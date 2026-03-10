// @vitest-environment jsdom
// app/charts/shared/__tests__/observation-callout.spec.tsx
import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from "vitest";

import "@testing-library/jest-dom/vitest";

import {
  ObservationCallout,
  ObservationCalloutProps,
} from "../observation-callout";

describe("ObservationCallout", () => {
  const defaultProps: ObservationCalloutProps = {
    x: 100,
    y: 50,
    label: "Q1 2024",
    value: "1,234",
    color: "#3B82F6",
  };

  it("should render callout with label", () => {
    const { container } = render(
      <svg>
        <ObservationCallout {...defaultProps} />
      </svg>
    );
    expect(screen.getByText("Q1 2024")).toBeInTheDocument();
  });

  it("should render callout with value", () => {
    render(
      <svg>
        <ObservationCallout {...defaultProps} />
      </svg>
    );
    expect(screen.getByText("1,234")).toBeInTheDocument();
  });

  it("should not render leader line when target not provided", () => {
    const { container } = render(
      <svg>
        <ObservationCallout {...defaultProps} />
      </svg>
    );
    expect(container.querySelector("line")).not.toBeInTheDocument();
  });

  it("should render leader line when target provided", () => {
    const { container } = render(
      <svg>
        <ObservationCallout {...defaultProps} targetX={150} targetY={100} />
      </svg>
    );
    expect(container.querySelector("line")).toBeInTheDocument();
  });

  it("should render segment when provided", () => {
    render(
      <svg>
        <ObservationCallout {...defaultProps} segment="Product A" />
      </svg>
    );
    expect(screen.getByText("Product A")).toBeInTheDocument();
  });
});
