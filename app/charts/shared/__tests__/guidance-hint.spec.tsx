// @vitest-environment jsdom
// app/charts/shared/__tests__/guidance-hint.spec.tsx
import { render, screen, waitFor, cleanup, act } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import "@testing-library/jest-dom/vitest";

import { GuidanceHint, useGuidance } from "../interaction/guidance-hint";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("GuidanceHint", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render hint on first visit", async () => {
    render(<GuidanceHint message="Hover for details" />);
    await waitFor(() => {
      expect(screen.getByText("Hover for details")).toBeInTheDocument();
    });
  });

  it("should not render hint after dismissal", async () => {
    localStorageMock.getItem.mockReturnValue("true");
    render(<GuidanceHint message="Hover for details" />);
    expect(screen.queryByText("Hover for details")).not.toBeInTheDocument();
  });

  it("should auto-dismiss after timeout", async () => {
    vi.useFakeTimers();
    localStorageMock.getItem.mockReturnValue(null);

    render(<GuidanceHint message="Hover for details" autoDismissMs={1000} />);

    expect(screen.getByText("Hover for details")).toBeInTheDocument();

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText("Hover for details")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});

describe("useGuidance", () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should return true for first visit", () => {
    const { result } = renderHook(() => useGuidance("test-chart"));
    expect(result.current.shouldShow).toBe(true);
  });
});
