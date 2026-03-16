import { NextResponse } from 'next/server';

import { datasets } from '@vizualni/datagov-client';
import {
  emptyStaticParams,
  isStaticExportBuild,
  staticExportApiUnavailable,
} from '@/lib/next/static-export';

export const dynamicParams = false;

export async function generateStaticParams() {
  return emptyStaticParams();
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (isStaticExportBuild) {
    return staticExportApiUnavailable();
  }

  const id = params.id;

  try {
    const dataset = await datasets.get(id);
    const resources = dataset.resources;

    return NextResponse.json({
      dataset,
      resources,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dataset' },
      { status: 500 }
    );
  }
}
