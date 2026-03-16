import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/api/rate-limit';

import { validateCsrf } from '@/lib/api/csrf';
import {
  isStaticExportBuild,
  staticExportApiUnavailable,
} from '@/lib/next/static-export';

const ALLOWED_HOSTNAMES = new Set(['data.gov.rs', 'stats.data.gov.rs']);

// 10 MB response size limit
const MAX_RESPONSE_SIZE = 10 * 1024 * 1024;

async function readResponseWithLimit(response: Response, maxBytes: number) {
  if (!response.body) {
    return new Uint8Array(0);
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  let done = false;

  try {
    while (!done) {
      const result = await reader.read();
      done = result.done;
      if (done) break;

      const value = result.value;
      if (!value) continue;

      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        throw new Error('RESPONSE_TOO_LARGE');
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const result = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return result;
}

const urlSchema = z.string().url();

export async function GET(request: NextRequest) {
  if (isStaticExportBuild) {
    return staticExportApiUnavailable();
  }

  // Check rate limit (strict for proxy)
  const rateLimitError = checkRateLimit(request, RATE_LIMIT_CONFIGS.proxy);
  if (rateLimitError) return rateLimitError;

  // Validate CSRF for proxy requests to prevent abuse
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  const urlParam = request.nextUrl.searchParams.get('url');

  if (!urlParam) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  // Validate URL and check against hostname whitelist
  const parseResult = urlSchema.safeParse(urlParam);
  if (!parseResult.success) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const url = new URL(parseResult.data);

  if (!ALLOWED_HOSTNAMES.has(url.hostname)) {
    return NextResponse.json(
      { error: 'Only data.gov.rs URLs are allowed' },
      { status: 403 }
    );
  }

  // Only allow HTTPS
  if (url.protocol !== 'https:') {
    return NextResponse.json(
      { error: 'Only HTTPS URLs are allowed' },
      { status: 403 }
    );
  }

  try {
    const response = await fetch(url.toString(), {
      redirect: 'manual',
      headers: {
        'User-Agent': 'VizuelniAdminSrbije/1.0',
        Accept: 'text/csv, application/json, text/plain, */*',
      },
    });

    if (response.status >= 300 && response.status < 400) {
      return NextResponse.json(
        { error: 'Redirect responses are not allowed' },
        { status: 403 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Check content-length header if available
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_SIZE) {
      return NextResponse.json(
        { error: 'Response too large' },
        { status: 413 }
      );
    }

    const contentType = response.headers.get('content-type') || 'text/plain';
    const data = await readResponseWithLimit(response, MAX_RESPONSE_SIZE);

    // Restrict CORS to same origin
    const origin = request.headers.get('origin') || '';
    const allowedOrigin =
      origin === request.nextUrl.origin ? origin : request.nextUrl.origin;

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': allowedOrigin,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'RESPONSE_TOO_LARGE') {
      return NextResponse.json(
        { error: 'Response too large' },
        { status: 413 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
