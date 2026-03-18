import { NextResponse } from 'next/server';

export const isStaticExportBuild = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);

export function staticExportApiUnavailable() {
  return NextResponse.json(
    {
      error:
        'This endpoint is unavailable in the static GitHub Pages build.',
    },
    { status: 501 }
  );
}

export function emptyStaticParams() {
  return [];
}
