/**
 * PowerPoint Builder
 * Feature 42: Export to PDF/PowerPoint
 */

import PptxGenJS from 'pptxgenjs';
import {
  PPTXExportOptions,
  ChartSlideData,
  ComparisonSlideData,
  ContentSlideData,
  ExportResult,
  SlideType,
} from './pptx-types';

interface SlideData {
  type: SlideType;
  title?: string;
  subtitle?: string;
  content?: string[];
  chartImage?: string;
  insights?: string[];
  dataSource?: string;
  leftTitle?: string;
  rightTitle?: string;
  leftImage?: string;
  rightImage?: string;
  comparisonNotes?: string[];
}

/**
 * PowerPoint Generator Class
 */
export class PPTXBuilder {
  private slides: SlideData[] = [];
  private options: PPTXExportOptions;

  constructor(options: PPTXExportOptions) {
    this.options = {
      locale: 'srLat',
      includeTitleSlide: true,
      ...options,
    };
  }

  addTitleSlide(title: string, subtitle?: string): void {
    this.slides.push({ type: 'title', title, subtitle });
  }

  addChartSlide(data: ChartSlideData): void {
    this.slides.push({
      type: 'chart',
      title: data.title,
      subtitle: data.subtitle,
      chartImage: data.chartImage,
      insights: data.insights,
      dataSource: data.dataSource,
    });
  }

  addComparisonSlide(data: ComparisonSlideData): void {
    this.slides.push({
      type: 'comparison',
      ...data,
    });
  }

  addContentSlide(data: ContentSlideData): void {
    this.slides.push({
      type: 'content',
      ...data,
    });
  }

  async generate(): Promise<ExportResult> {
    try {
      const pptx = new PptxGenJS();

      // Set properties
      pptx.author = this.options.author || 'Visual Admin Serbia';
      pptx.company = this.options.company || 'Vizuelni Admin Srbije';
      pptx.subject = this.options.subject || this.options.title;
      pptx.title = this.options.title;
      pptx.layout = 'LAYOUT_16x9';

      // Add title slide
      if (this.options.includeTitleSlide) {
        this.addPresentationTitleSlide(pptx);
      }

      // Add TOC
      if (this.options.includeTableOfContents && this.slides.length > 2) {
        this.addTOCSlide(pptx);
      }

      // Process slides
      for (const slideData of this.slides) {
        this.processSlide(pptx, slideData);
      }

      const blob = (await pptx.write({ outputType: 'blob' })) as Blob;

      return {
        success: true,
        blob,
        filename: this.generateFilename(),
        slideCount:
          this.slides.length + (this.options.includeTitleSlide ? 1 : 0),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private addPresentationTitleSlide(pptx: any): void {
    const slide = pptx.addSlide();
    slide.background = { color: '1e40af' };

    slide.addText(this.options.title, {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 1.5,
      fontSize: 44,
      fontFace: 'Arial',
      color: 'FFFFFF',
      bold: true,
      align: 'center',
    });

    if (this.options.subtitle) {
      slide.addText(this.options.subtitle, {
        x: 0.5,
        y: 4,
        w: 9,
        h: 0.75,
        fontSize: 24,
        fontFace: 'Arial',
        color: 'FFFFFF',
        align: 'center',
      });
    }

    slide.addText(new Date().toLocaleDateString('sr-RS'), {
      x: 0.5,
      y: 6.5,
      w: 9,
      h: 0.5,
      fontSize: 14,
      fontFace: 'Arial',
      color: 'FFFFFF',
      align: 'center',
    });
  }

  private addTOCSlide(pptx: any): void {
    const slide = pptx.addSlide();
    const tocTitle =
      this.options.locale === 'sr'
        ? 'Садржај'
        : this.options.locale === 'en'
          ? 'Contents'
          : 'Sadržaj';

    slide.addText(tocTitle, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.75,
      fontSize: 32,
      fontFace: 'Arial',
      color: '1e40af',
      bold: true,
    });

    const items = this.slides
      .filter((s) => s.title)
      .map((s, i) => `${i + 1}. ${s.title}`);
    slide.addText(items.join('\n'), {
      x: 0.75,
      y: 1.5,
      w: 8.5,
      h: 5,
      fontSize: 18,
      fontFace: 'Arial',
      color: '374151',
      paraSpaceAfter: 10,
    });
  }

  private processSlide(pptx: any, data: SlideData): void {
    switch (data.type) {
      case 'chart':
        this.processChartSlide(pptx, data);
        break;
      case 'comparison':
        this.processComparisonSlide(pptx, data);
        break;
      case 'content':
        this.processContentSlide(pptx, data);
        break;
    }
  }

  private processChartSlide(pptx: any, data: SlideData): void {
    const slide = pptx.addSlide();

    slide.addText(data.title || '', {
      x: 0.5,
      y: 0.25,
      w: 9,
      h: 0.5,
      fontSize: 24,
      fontFace: 'Arial',
      color: '1e40af',
      bold: true,
    });

    if (data.subtitle) {
      slide.addText(data.subtitle, {
        x: 0.5,
        y: 0.75,
        w: 9,
        h: 0.3,
        fontSize: 14,
        fontFace: 'Arial',
        color: '6b7280',
      });
    }

    // Chart image or placeholder
    if (data.chartImage) {
      slide.addImage({ data: data.chartImage, x: 0.5, y: 1.2, w: 6, h: 4.5 });
    } else {
      slide.addText('[Графикон]', {
        x: 0.5,
        y: 1.2,
        w: 6,
        h: 4.5,
        fontSize: 16,
        fontFace: 'Arial',
        color: '9ca3af',
        align: 'center',
        valign: 'middle',
        fill: { color: 'f3f4f6' },
      });
    }

    // Insights
    if (data.insights?.length) {
      slide.addText(data.insights.map((i) => `• ${i}`).join('\n'), {
        x: 6.75,
        y: 1.2,
        w: 2.75,
        h: 4.5,
        fontSize: 12,
        fontFace: 'Arial',
        color: '374151',
        valign: 'top',
      });
    }

    // Source
    if (data.dataSource) {
      const src =
        this.options.locale === 'sr'
          ? 'Извор:'
          : this.options.locale === 'en'
            ? 'Source:'
            : 'Izvor:';
      slide.addText(`${src} ${data.dataSource}`, {
        x: 0.5,
        y: 6.75,
        w: 9,
        h: 0.25,
        fontSize: 10,
        fontFace: 'Arial',
        color: '9ca3af',
      });
    }
  }

  private processComparisonSlide(pptx: any, data: SlideData): void {
    const slide = pptx.addSlide();

    slide.addText(data.title || '', {
      x: 0.5,
      y: 0.25,
      w: 9,
      h: 0.5,
      fontSize: 24,
      fontFace: 'Arial',
      color: '1e40af',
      bold: true,
    });

    // Left
    slide.addText(data.leftTitle || '', {
      x: 0.5,
      y: 0.9,
      w: 4.25,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Arial',
      color: '374151',
      bold: true,
      align: 'center',
    });
    if (data.leftImage) {
      slide.addImage({ data: data.leftImage, x: 0.5, y: 1.3, w: 4.25, h: 4.5 });
    } else {
      slide.addText('[Графикон]', {
        x: 0.5,
        y: 1.3,
        w: 4.25,
        h: 4.5,
        fontSize: 14,
        color: '9ca3af',
        align: 'center',
        valign: 'middle',
        fill: { color: 'f3f4f6' },
      });
    }

    // Right
    slide.addText(data.rightTitle || '', {
      x: 5.25,
      y: 0.9,
      w: 4.25,
      h: 0.3,
      fontSize: 14,
      fontFace: 'Arial',
      color: '374151',
      bold: true,
      align: 'center',
    });
    if (data.rightImage) {
      slide.addImage({
        data: data.rightImage,
        x: 5.25,
        y: 1.3,
        w: 4.25,
        h: 4.5,
      });
    } else {
      slide.addText('[Графикон]', {
        x: 5.25,
        y: 1.3,
        w: 4.25,
        h: 4.5,
        fontSize: 14,
        color: '9ca3af',
        align: 'center',
        valign: 'middle',
        fill: { color: 'f3f4f6' },
      });
    }

    if (data.comparisonNotes?.length) {
      slide.addText(data.comparisonNotes.map((n) => `• ${n}`).join('\n'), {
        x: 0.5,
        y: 6,
        w: 9,
        h: 1,
        fontSize: 11,
        fontFace: 'Arial',
        color: '6b7280',
      });
    }
  }

  private processContentSlide(pptx: any, data: SlideData): void {
    const slide = pptx.addSlide();

    slide.addText(data.title || '', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.75,
      fontSize: 28,
      fontFace: 'Arial',
      color: '1e40af',
      bold: true,
    });

    if (data.content?.length) {
      slide.addText(data.content.map((c) => `• ${c}`).join('\n\n'), {
        x: 0.75,
        y: 1.5,
        w: 8.5,
        h: 5,
        fontSize: 18,
        fontFace: 'Arial',
        color: '374151',
        paraSpaceAfter: 12,
      });
    }
  }

  private generateFilename(): string {
    const date = new Date().toISOString().split('T')[0];
    const slug = this.options.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${slug}-${date}.pptx`;
  }
}

/**
 * Download helper
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
