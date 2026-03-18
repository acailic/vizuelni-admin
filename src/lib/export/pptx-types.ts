/**
 * PowerPoint Export Types
 * Feature 42: Export to PDF/PowerPoint
 */

export interface PPTXExportOptions {
  title: string;
  subtitle?: string;
  author?: string;
  company?: string;
  subject?: string;
  locale?: 'en' | 'sr' | 'srLat';
  includeTitleSlide?: boolean;
  includeTableOfContents?: boolean;
}

export interface ChartSlideData {
  title: string;
  subtitle?: string;
  chartImage?: string; // Base64 or URL
  insights?: string[];
  dataSource?: string;
  notes?: string;
}

export interface ComparisonSlideData {
  title: string;
  leftTitle: string;
  rightTitle: string;
  leftImage?: string;
  rightImage?: string;
  comparisonNotes?: string[];
}

export interface ContentSlideData {
  title: string;
  content: string[];
}

export interface ExportResult {
  success: boolean;
  filename?: string;
  blob?: Blob;
  error?: string;
  slideCount?: number;
}

export type SlideType = 'title' | 'chart' | 'comparison' | 'content' | 'toc';
