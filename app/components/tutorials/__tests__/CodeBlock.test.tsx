import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import CodeBlock from "../CodeBlock";

describe("CodeBlock", () => {
  it("shows visible feedback after copying code", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(
      <CodeBlock
        code="<iframe></iframe>"
        language="html"
        copyLabel="Copy embed code"
        copiedLabel="Embed code copied."
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /copy embed code/i }));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("<iframe></iframe>");
    });

    expect(await screen.findByText("Embed code copied.")).toBeVisible();
  });
});
