declare module 'plotly.js-dist-min' {
  export interface Data extends Record<string, unknown> {}

  export interface Layout extends Record<string, unknown> {
    margin?: {
      l?: number
      r?: number
      t?: number
      b?: number
      pad?: number
    }
    font?: Record<string, unknown>
  }

  export interface Config extends Record<string, unknown> {}

  export function newPlot(
    root: HTMLDivElement,
    data: Data[],
    layout?: Partial<Layout>,
    config?: Partial<Config>
  ): Promise<void>

  export function purge(root: HTMLDivElement): void

  export const Plots: {
    resize(root: HTMLDivElement): Promise<void>
  }
}
