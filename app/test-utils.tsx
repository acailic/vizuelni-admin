import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import {
  render as rtlRender,
  renderHook as rtlRenderHook,
} from "@testing-library/react";
import * as React from "react";

// Setup I18n for tests - Trans is mocked in vitest.setup.ts
i18n.load("en", {});
i18n.load("sr-Latn", {});
i18n.load("sr-Cyrl", {});
i18n.activate("sr-Latn");

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};

export const render = (ui: React.ReactElement, options?: any) =>
  rtlRender(ui, { wrapper: AllTheProviders, ...options });

export const renderHook = (hook: () => any, options?: any) =>
  rtlRenderHook(hook, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
