import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import DemoEmbed from "@/pages/embed/demo";
import { render, screen, waitFor } from "@/test-utils";

vi.mock("next/script", () => ({
  __esModule: true,
  default: () => null,
}));

describe("embed demo chart smoke tests", () => {
  it.each([
    {
      type: "line",
      dataset: "air",
      theme: "light",
      lang: "en",
      extraParams: "",
    },
    {
      type: "bar",
      dataset: "students",
      theme: "dark",
      lang: "sr",
      extraParams: "&removeBorder=true&optimizeSpace=true",
    },
    {
      type: "column",
      dataset: "budget",
      theme: "light",
      lang: "sr",
      extraParams: "&removeFilters=true",
    },
    {
      type: "pie",
      dataset: "vaccination",
      theme: "dark",
      lang: "en",
      extraParams: "&removeFootnotes=true",
    },
  ])(
    "renders $type charts without triggering the error boundary",
    async ({ type, dataset, theme, lang, extraParams }) => {
      window.history.replaceState(
        {},
        "",
        `/embed/demo?type=${type}&dataset=${dataset}&dataSource=Prod&theme=${theme}&lang=${lang}${extraParams}`
      );

      const { container, unmount } = render(<DemoEmbed />);

      await waitFor(() => {
        expect(
          screen.queryByText(/Chart failed to load/i)
        ).not.toBeInTheDocument();
      });

      expect(
        screen.getByText(new RegExp(`Dataset:\\s*${dataset}`, "i"))
      ).toBeVisible();
      expect(screen.getByText(/(Source|Izvor):\s*Prod/i)).toBeVisible();
      expect(container.querySelector("svg")).toBeTruthy();

      unmount();
    }
  );
});
