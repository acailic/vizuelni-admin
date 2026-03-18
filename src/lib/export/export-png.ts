/**
 * PNG export utilities using html-to-image
 * Captures charts as rendered (SVG or Canvas) with 2x resolution
 */

import { toBlob, toPng } from 'html-to-image';

import { withSourceAttribution } from './attribution';
import { createSafeFilename } from './filename';

// Define options type locally since html-to-image doesn't export it
interface ExportOptions {
  quality?: number;
  pixelRatio?: number;
  backgroundColor?: string;
  width?: number;
  height?: number;
  filter?: (node: Node) => boolean;
}

export interface PNGExportOptions {
  /** Scale factor for resolution (default: 2 for retina) */
  scale?: number;
  /** Background color (default: white) */
  backgroundColor?: string;
  /** Pixel width of output (default: element width) */
  width?: number;
  /** Pixel height of output (default: element height) */
  height?: number;
  /** Chart title for filename */
  title: string;
  /** Source attribution to include */
  source?: string;
}

function buildExportOptions(options: PNGExportOptions): ExportOptions {
  const {
    scale = 2,
    backgroundColor = '#ffffff',
    width,
    height,
  } = options;

  const exportOptions: ExportOptions = {
    quality: 1,
    pixelRatio: scale,
    backgroundColor,
    filter: (node: Node) => {
      if ((node as HTMLElement).classList?.contains('no-export')) {
        return false;
      }
      return true;
    },
  };

  if (width) exportOptions.width = width;
  if (height) exportOptions.height = height;

  return exportOptions;
}

export async function createPNGBlob(
  element: HTMLElement,
  options: PNGExportOptions
): Promise<Blob> {
  return withSourceAttribution(element, options.source, async () => {
    const blob = await toBlob(element, buildExportOptions(options));

    if (!blob) {
      throw new Error('Failed to generate PNG blob');
    }

    return blob;
  });
}

/**
 * Export a DOM element (chart container) as PNG image
 * 
 * @param element - The DOM element to capture
 * @param options - Export options
 * @returns Promise that resolves when download starts
 */
export async function exportChartAsPNG(
  element: HTMLElement,
  options: PNGExportOptions
): Promise<void> {
  const dataUrl = await withSourceAttribution(element, options.source, async () =>
    toPng(element, buildExportOptions(options))
  );

  const link = document.createElement('a');
  link.download = createSafeFilename(options.title, 'png');
  link.href = dataUrl;
  link.click();
}

/**
 * Export a chart by selector with retry logic
 * Sometimes the chart needs a moment to render
 */
export async function exportChartBySelector(
  selector: string,
  options: PNGExportOptions,
  retries = 3
): Promise<void> {
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    const element = document.querySelector<HTMLElement>(selector);
    
    if (!element) {
      lastError = new Error(`Element not found: ${selector}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      continue;
    }

    try {
      await exportChartAsPNG(element, options);
      return;
    } catch (error) {
      lastError = error as Error;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  throw lastError || new Error('Failed to export chart as PNG');
}
