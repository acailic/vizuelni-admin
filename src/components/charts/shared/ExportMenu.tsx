'use client';

import { useCallback, useState } from 'react';

import { exportChart } from '@vizualni/application';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  Download,
  FileCode,
  Image as ImageIcon,
  FileSpreadsheet,
  FileText,
  Loader2,
} from 'lucide-react';

import {
  createCSVBlob,
  createExcelBlob,
  createPNGBlob,
  createSVGBlob,
  createSafeFilename,
} from '@/lib/export';
import { trackChartExported } from '@/lib/analytics';

export interface ExportMenuProps {
  chartRef?: React.RefObject<HTMLDivElement>;
  title: string;
  data: Record<string, unknown>[];
  headers?: string[];
  source?: string;
  locale?: string;
  labels?: {
    download?: string;
    imagePng?: string;
    imageSvg?: string;
    dataCsv?: string;
    spreadsheetExcel?: string;
    exporting?: string;
    source?: string;
  };
  filtersApplied?: string;
  disabledExports?: ('png' | 'svg' | 'csv' | 'excel')[];
  chartType?: string;
  onExportStart?: (type: 'png' | 'svg' | 'csv' | 'excel') => void;
  onExportEnd?: (type: 'png' | 'svg' | 'csv' | 'excel') => void;
  onExportError?: (
    type: 'png' | 'svg' | 'csv' | 'excel',
    error: Error
  ) => void;
}

type ExportState = {
  png: boolean;
  svg: boolean;
  csv: boolean;
  excel: boolean;
};

const defaultLabels = {
  download: 'Download',
  imagePng: 'Image (PNG)',
  imageSvg: 'Vector (SVG)',
  dataCsv: 'Data (CSV)',
  spreadsheetExcel: 'Spreadsheet (Excel)',
  exporting: 'Exporting...',
  source: 'Source',
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export function ExportMenu({
  chartRef,
  title,
  data,
  headers,
  source,
  locale: _locale = 'sr-Cyrl',
  labels = {},
  filtersApplied,
  disabledExports = [],
  chartType,
  onExportStart,
  onExportEnd,
  onExportError,
}: ExportMenuProps) {
  const [exporting, setExporting] = useState<ExportState>({
    png: false,
    svg: false,
    csv: false,
    excel: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const mergedLabels = { ...defaultLabels, ...labels };

  const handleExport = useCallback(async (type: 'png' | 'svg' | 'csv' | 'excel') => {
    setExporting((prev) => ({ ...prev, [type]: true }));
    onExportStart?.(type);

    try {
      const result = await exportChart(
        {
          format: type,
          title,
          data,
          headers,
          source,
          pngSource: source ? `${mergedLabels.source}: ${source}` : undefined,
          filtersApplied,
          chartElement: chartRef?.current ?? null,
        },
        {
          createFilename: createSafeFilename,
          createPngBlob: createPNGBlob,
          createSvgBlob: createSVGBlob,
          createCsvBlob: createCSVBlob,
          createExcelBlob,
        }
      );

      downloadBlob(result.blob, result.filename);
      trackChartExported(type, chartType);
      onExportEnd?.(type);
    } catch (error) {
      console.error(`${type.toUpperCase()} export failed:`, error);
      onExportError?.(type, error as Error);
    } finally {
      setExporting((prev) => ({ ...prev, [type]: false }));
    }
  }, [
    chartRef,
    chartType,
    data,
    filtersApplied,
    headers,
    mergedLabels.source,
    onExportEnd,
    onExportError,
    onExportStart,
    source,
    title,
  ]);

  const isPNGDisabled =
    disabledExports.includes('png') || !chartRef?.current || exporting.png;
  const isSVGDisabled =
    disabledExports.includes('svg') || !chartRef?.current || exporting.svg;
  const isCSVDisabled =
    disabledExports.includes('csv') || data.length === 0 || exporting.csv;
  const isExcelDisabled =
    disabledExports.includes('excel') || data.length === 0 || exporting.excel;

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className='inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          aria-label={mergedLabels.download}
        >
          <Download className='h-4 w-4' />
          <span>{mergedLabels.download}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className='z-50 min-w-[200px] rounded-lg border border-slate-200 bg-white p-1 shadow-lg'
          sideOffset={5}
          align='end'
        >
          <DropdownMenu.Item
            className='flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
            disabled={isPNGDisabled}
            onSelect={(e) => {
              e.preventDefault();
              void handleExport('png');
            }}
          >
            {exporting.png ? (
              <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
            ) : (
              <ImageIcon className='h-4 w-4 text-slate-500' />
            )}
            <span>
              {exporting.png ? mergedLabels.exporting : mergedLabels.imagePng}
            </span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className='flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
            disabled={isSVGDisabled}
            onSelect={(e) => {
              e.preventDefault();
              void handleExport('svg');
            }}
          >
            {exporting.svg ? (
              <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
            ) : (
              <FileCode className='h-4 w-4 text-slate-500' />
            )}
            <span>
              {exporting.svg ? mergedLabels.exporting : mergedLabels.imageSvg}
            </span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className='flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
            disabled={isCSVDisabled}
            onSelect={(e) => {
              e.preventDefault();
              void handleExport('csv');
            }}
          >
            {exporting.csv ? (
              <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
            ) : (
              <FileText className='h-4 w-4 text-slate-500' />
            )}
            <span>
              {exporting.csv ? mergedLabels.exporting : mergedLabels.dataCsv}
            </span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className='flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
            disabled={isExcelDisabled}
            onSelect={(e) => {
              e.preventDefault();
              void handleExport('excel');
            }}
          >
            {exporting.excel ? (
              <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
            ) : (
              <FileSpreadsheet className='h-4 w-4 text-slate-500' />
            )}
            <span>
              {exporting.excel
                ? mergedLabels.exporting
                : mergedLabels.spreadsheetExcel}
            </span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
