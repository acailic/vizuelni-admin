import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

import DemosIndex from "@/pages/demos/index";
import { render } from "@/test-utils";

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
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
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
      events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
      },
    },
  },
  useRouter: () => ({ locale: "sr" }),
}));

describe("DemosIndex", () => {
  it("renders demo cards", () => {
    const { container } = render(<DemosIndex />);

    // Check that cards are rendered
    const cards = container.querySelectorAll(".MuiCard-root");
    expect(cards.length).toBeGreaterThan(0);
  });

  it("renders without errors", () => {
    const { container } = render(<DemosIndex />);
    expect(container.innerHTML).toBeTruthy();
  });
});
