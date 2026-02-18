import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

import DemographicsDemo from "@/pages/demos/demographics";
import { render, screen } from "@/test-utils";

vi.mock("next/router", () => ({
  __esModule: true,
  default: {
    locale: "sr",
    route: "/",
    pathname: "/",
    query: {},
    asPath: "/",
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    isReady: true,
    ready: (cb: () => void) => setTimeout(cb, 0),
    events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
    router: {
      locale: "sr",
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      isReady: true,
      events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
    },
  },
  useRouter: () => ({ locale: "sr" }),
}));

vi.mock("@/components/demos/charts/PopulationPyramid", () => ({
  PopulationPyramid: () => <div data-testid="pyramid" />,
}));

vi.mock("@/components/demos/charts/PopulationTrends", () => ({
  PopulationTrends: () => <div data-testid="trends" />,
}));

describe("DemographicsDemo", () => {
  it("renders key computed metrics and warning", () => {
    render(<DemographicsDemo />);

    expect(screen.getByText(/Demografija Srbije/i)).toBeTruthy();
    expect(screen.getByText(/DEMOGRAFSKO UPOZORENJE/i)).toBeTruthy();
    // Total population number cards (uses calculated totals)
    expect(screen.getByText(/M/)).toBeTruthy();
    expect(screen.getByTestId("pyramid")).toBeTruthy();
    expect(screen.getByTestId("trends")).toBeTruthy();
  });

  it("renders English strings when locale is en", async () => {
    vi.doMock("next/router", () => ({
      useRouter: () => ({ locale: "en" }),
    }));
    const { default: Page } = await import("@/pages/demos/demographics");
    render(<Page />);

    expect(screen.getByText(/Serbia Demographics/i)).toBeTruthy();
    expect(screen.getByText(/DEMOGRAPHIC WARNING/i)).toBeTruthy();
  });
});
