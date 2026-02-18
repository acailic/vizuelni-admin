import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

import DemoShowcasePage from "@/pages/demos/showcase";
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
  ColumnChart: (props: any) => (
    <div data-testid="column-chart">{JSON.stringify(props)}</div>
  ),
  LineChart: (props: any) => (
    <div data-testid="line-chart">{JSON.stringify(props)}</div>
  ),
  PieChart: (props: any) => (
    <div data-testid="pie-chart">{JSON.stringify(props)}</div>
  ),
}));

vi.mock("@/lib/demos/config", () => ({
  FEATURED_CHARTS: [
    {
      id: "chart1",
      title: { sr: "Grafikon 1", en: "Chart 1" },
      description: { sr: "Opis 1", en: "Description 1" },
      demoId: "demo1",
      type: "column",
    },
    {
      id: "chart2",
      title: { sr: "Grafikon 2", en: "Chart 2" },
      description: { sr: "Opis 2", en: "Description 2" },
      demoId: "demo2",
      type: "line",
    },
    {
      id: "chart3",
      title: { sr: "Grafikon 3", en: "Chart 3" },
      description: { sr: "Opis 3", en: "Description 3" },
      demoId: "demo3",
      type: "pie",
    },
  ],
}));

describe("DemoShowcasePage", () => {
  it("renders hero content and charts", () => {
    render(<DemoShowcasePage />);

    // Check that the page renders the mocked charts (getAllByTestId since there may be multiple)
    expect(screen.getAllByTestId("column-chart").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("line-chart").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("pie-chart").length).toBeGreaterThan(0);
  });

  it("renders the page without errors", () => {
    const { container } = render(<DemoShowcasePage />);
    // Check that the page renders something
    expect(container.innerHTML).toContain("column-chart");
    expect(container.innerHTML).toContain("line-chart");
    expect(container.innerHTML).toContain("pie-chart");
  });
});
