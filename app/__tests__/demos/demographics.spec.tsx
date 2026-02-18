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

vi.mock("@/components/demos/charts", () => ({
  PopulationPyramid: () => <div data-testid="pyramid" />,
  PopulationTrends: () => <div data-testid="trends" />,
}));

describe("DemographicsDemo", () => {
  it("renders key components", () => {
    render(<DemographicsDemo />);

    // Check that mocked components are rendered
    expect(screen.getByTestId("pyramid")).toBeTruthy();
    expect(screen.getByTestId("trends")).toBeTruthy();
  });

  it("renders without errors", () => {
    const { container } = render(<DemographicsDemo />);
    expect(container.innerHTML).toBeTruthy();
  });
});
