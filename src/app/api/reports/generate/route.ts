import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { ChartReportDocument } from '@/components/pdf';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { validateCsrf } from '@/lib/api/csrf';
import {
  isStaticExportBuild,
  staticExportApiUnavailable,
} from '@/lib/next/static-export';

interface ReportRequest {
  title: string;
  description?: string;
  chartImage?: string; // Base64 encoded image
  chartType: string;
  datasets: string[];
  organization?: string;
  license?: string;
  locale: string;
}

export async function POST(request: NextRequest) {
  if (isStaticExportBuild) {
    return staticExportApiUnavailable();
  }

  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  try {
    // Optional: Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ReportRequest = await request.json();
    const {
      title,
      description,
      chartImage,
      chartType,
      datasets,
      organization,
      license,
      locale,
    } = body;

    // Validate required fields
    if (!title || !chartType || !datasets || !locale) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get locale-specific labels
    const labels = getLabels(locale);

    // Create the PDF document
    const document = ChartReportDocument({
      title,
      description,
      chartImage,
      metadata: {
        createdAt: new Date().toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        chartType,
        datasets,
        organization,
        license,
      },
      locale,
      labels,
    });

    // Render PDF to stream
    const stream = await renderToStream(document);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(
        typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk)
      );
    }
    const buffer = Buffer.concat(chunks);

    // Return PDF as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${sanitizeFilename(title)}-report.pdf"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

function getLabels(locale: string) {
  const labels: Record<string, typeof defaultLabels> = {
    'sr-Cyrl': {
      reportTitle: 'Извештај графика',
      generatedOn: 'Генерисано',
      chartType: 'Тип графика',
      datasets: 'Скупови података',
      organization: 'Организација',
      license: 'Лиценца',
      watermark: 'Визуелни Админ Србије',
    },
    'sr-Latn': {
      reportTitle: 'Izveštaj grafika',
      generatedOn: 'Generisano',
      chartType: 'Tip grafika',
      datasets: 'Skupovi podataka',
      organization: 'Organizacija',
      license: 'Licenca',
      watermark: 'Vizuelni Admin Srbije',
    },
  };

  const defaultLabels = {
    reportTitle: 'Chart Report',
    generatedOn: 'Generated on',
    chartType: 'Chart Type',
    datasets: 'Datasets',
    organization: 'Organization',
    license: 'License',
    watermark: 'Vizuelni Admin Srbije',
  };

  return labels[locale] || defaultLabels;
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\u0400-\u04FF\u0100-\u017F\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 100);
}
