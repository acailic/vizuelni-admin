import { I18nProvider } from "@lingui/react";
import {
  render as rtlRender,
  renderHook as rtlRenderHook,
} from "@testing-library/react";
import * as React from "react";

// Simple mock i18n object for tests - avoid lingui version conflicts
const mockI18n: any = {
  locale: "sr-Latn",
  load: () => {},
  activate: () => {},
};

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <I18nProvider i18n={mockI18n}>{children}</I18nProvider>;
};

export const render = (ui: React.ReactElement, options?: any) =>
  rtlRender(ui, { wrapper: AllTheProviders, ...options });

export const renderHook = (hook: () => any, options?: any) =>
  rtlRenderHook(hook, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
