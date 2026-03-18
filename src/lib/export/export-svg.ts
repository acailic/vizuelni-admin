import { toSvg } from 'html-to-image';

import { withSourceAttribution } from './attribution';
import { createSafeFilename } from './filename';
import type { PNGExportOptions } from './export-png';

export interface SVGExportOptions extends PNGExportOptions {}

function buildSvgOptions(options: SVGExportOptions) {
  return {
    backgroundColor: options.backgroundColor ?? '#ffffff',
    width: options.width,
    height: options.height,
    filter: (node: Node) => {
      if ((node as HTMLElement).classList?.contains('no-export')) {
        return false;
      }
      return true;
    },
  };
}

export async function createSVGBlob(
  element: HTMLElement,
  options: SVGExportOptions
): Promise<Blob> {
  const svg = await withSourceAttribution(element, options.source, async () =>
    toSvg(element, buildSvgOptions(options))
  );

  return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
}

export async function exportChartAsSVG(
  element: HTMLElement,
  options: SVGExportOptions
): Promise<void> {
  const blob = await createSVGBlob(element, options);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = createSafeFilename(options.title, 'svg');
  link.href = url;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 100);
}
