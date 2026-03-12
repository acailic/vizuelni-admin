// @vitest-environment jsdom
// app/charts/shared/__tests__/guidance-hints-manager.spec.tsx
import { screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { createElement } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import "@testing-library/jest-dom/vitest";

import { render } from "../../../vitest.setup";
import {
  GuidanceHintsManager,
  useGuidanceHints,
} from "../interaction/guidance-hints-manager";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("GuidanceHintsManager", () => {
  const hints = [
    { id: "hint1", content: "First hint", target: "#element1" },
    { id: "hint2", content: "Second hint", target: "#element2" },
    { id: "hint3", content: "Third hint", target: "#element3" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    cleanup();
  });

  it("should show first hint initially", () => {
    render(
      createElement(GuidanceHintsManager, { hints, chartId: "test-chart" })
    );
    expect(screen.getByText("First hint")).toBeInTheDocument();
    expect(screen.queryByText("Second hint")).not.toBeInTheDocument();
  });

  it("should show progress indicator", () => {
    render(
      createElement(GuidanceHintsManager, { hints, chartId: "test-chart" })
    );
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("should advance to next hint on Next button click", async () => {
    render(
      createElement(GuidanceHintsManager, { hints, chartId: "test-chart" })
    );
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByText("Second hint")).toBeInTheDocument();
      expect(screen.getByText("2 / 3")).toBeInTheDocument();
    });
  });

  it("should show 'Got it' on last hint", () => {
    render(
      createElement(GuidanceHintsManager, { hints, chartId: "test-chart" })
    );
    // Click next twice to get to last hint
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByRole("button", { name: /got it/i })).toBeInTheDocument();
  });

  it("should hide all hints after skip all", () => {
    render(
      createElement(GuidanceHintsManager, { hints, chartId: "test-chart" })
    );
    fireEvent.click(screen.getByRole("button", { name: /skip all/i }));
    expect(screen.queryByText("First hint")).not.toBeInTheDocument();
  });

  it("should persist dismissed hints to localStorage", () => {
    render(
      createElement(GuidanceHintsManager, { hints, chartId: "test-chart" })
    );
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it("should resume at first undismissed hint on reload", () => {
    // Simulate hint1 already dismissed
    localStorageMock.getItem.mockReturnValue(JSON.stringify(["hint1"]));

    render(
      createElement(GuidanceHintsManager, { hints, chartId: "test-chart" })
    );

    // Should show hint2 (second hint) since hint1 is dismissed
    expect(screen.getByText("Second hint")).toBeInTheDocument();
    expect(screen.queryByText("First hint")).not.toBeInTheDocument();
  });

  it("should show nothing if all hints are dismissed", () => {
    // Simulate all hints already dismissed
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify(["hint1", "hint2", "hint3"])
    );

    render(
      createElement(GuidanceHintsManager, { hints, chartId: "test-chart" })
    );

    expect(screen.queryByText("First hint")).not.toBeInTheDocument();
    expect(screen.queryByText("Second hint")).not.toBeInTheDocument();
    expect(screen.queryByText("Third hint")).not.toBeInTheDocument();
  });

  it("should go back to previous hint on Back button click", async () => {
    render(
      createElement(GuidanceHintsManager, { hints, chartId: "test-chart" })
    );

    // Advance to second hint
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByText("Second hint")).toBeInTheDocument();
    });

    // Go back to first hint
    fireEvent.click(screen.getByRole("button", { name: /back/i }));
    await waitFor(() => {
      expect(screen.getByText("First hint")).toBeInTheDocument();
      expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });
  });

  it("should not show Back button on first hint", () => {
    render(
      createElement(GuidanceHintsManager, { hints, chartId: "test-chart" })
    );
    expect(
      screen.queryByRole("button", { name: /back/i })
    ).not.toBeInTheDocument();
  });
});

describe("useGuidanceHints", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should throw error when used outside GuidanceHintsManager", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useGuidanceHints());
    }).toThrow("useGuidanceHints must be used within GuidanceHintsManager");

    consoleSpy.mockRestore();
  });

  it("should return correct values when used inside GuidanceHintsManager", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(
        GuidanceHintsManager,
        {
          hints: [{ id: "h1", content: "Test", target: "#t1" }],
          chartId: "test",
        },
        children
      );

    const { result } = renderHook(() => useGuidanceHints(), { wrapper });

    expect(result.current.currentHintIndex).toBe(0);
    expect(result.current.totalHints).toBe(1);
    expect(typeof result.current.dismissHint).toBe("function");
    expect(typeof result.current.skipAll).toBe("function");
  });
});
