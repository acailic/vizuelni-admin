import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

import { DEMO_CONFIGS } from "@/lib/demos/config";
import DemosIndex from "@/pages/demos/index";
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
  it("renders intro and a card per demo config", () => {
    const { container } = render(<DemosIndex />);

    // The Lingui mock returns English messages, so we check for English text
    expect(screen.getByText(/Demo Visualization Gallery/i)).toBeTruthy();

    const sampleTitles = Object.values(DEMO_CONFIGS)
      .slice(0, 3)
      .map((c) => c.title.en || c.title.sr);
    sampleTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    const cards = container.querySelectorAll(".MuiCard-root");
    expect(cards.length).toBeGreaterThanOrEqual(sampleTitles.length);
  });

  it("shows CTA to open showcase", () => {
    render(<DemosIndex />);
    // The Lingui mock returns English messages, so we check for English text
    expect(screen.getByText(/Open showcase/i)).toBeTruthy();
  });
});
