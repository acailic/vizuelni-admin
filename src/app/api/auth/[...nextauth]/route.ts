import NextAuth from 'next-auth';

import { authOptions } from '@/lib/auth/auth-options';
import {
  emptyStaticParams,
  isStaticExportBuild,
  staticExportApiUnavailable,
} from '@/lib/next/static-export';

export const dynamicParams = false;

export async function generateStaticParams() {
  return emptyStaticParams();
}

const handler = NextAuth(authOptions);

export async function GET(
  request: Request,
  context: { params: { nextauth?: string[] } }
) {
  if (isStaticExportBuild) {
    return staticExportApiUnavailable();
  }

  return handler(request, context);
}

export async function POST(
  request: Request,
  context: { params: { nextauth?: string[] } }
) {
  if (isStaticExportBuild) {
    return staticExportApiUnavailable();
  }

  return handler(request, context);
}
