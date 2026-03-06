import { describe, it, expect } from "vitest";

import { lightPalette, darkPalette } from "../palette";

describe("palette", () => {
  it("should export lightPalette with mode 'light'", () => {
    expect(lightPalette.mode).toBe("light");
    expect(lightPalette.primary).toBeDefined();
    expect(lightPalette.background).toBeDefined();
  });

  it("should export darkPalette with mode 'dark'", () => {
    expect(darkPalette.mode).toBe("dark");
    expect(darkPalette.primary).toBeDefined();
    expect(darkPalette.background).toBeDefined();
  });
});
