import type { Locale } from '@/lib/i18n/config';

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const localePattern = /^\/(sr-Cyrl|sr-Latn|en)(?=\/|$)/;

function normalizePath(path: string) {
  if (!path) {
    return '/';
  }

  return path.startsWith('/') ? path : `/${path}`;
}

export function withBasePath(path: string) {
  const normalizedPath = normalizePath(path);

  if (!publicBasePath) {
    return normalizedPath;
  }

  if (normalizedPath === '/') {
    return publicBasePath;
  }

  return `${publicBasePath}${normalizedPath}`;
}

export function stripBasePath(pathname: string) {
  const normalizedPath = normalizePath(pathname);

  if (!publicBasePath || !normalizedPath.startsWith(publicBasePath)) {
    return normalizedPath;
  }

  const strippedPath = normalizedPath.slice(publicBasePath.length);
  return strippedPath || '/';
}

export function getLocalizedPathname(pathname: string, locale: Locale) {
  const pathWithoutBasePath = stripBasePath(pathname);
  const pathWithoutLocale =
    pathWithoutBasePath.replace(localePattern, '') || '/';

  return withBasePath(
    `/${locale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
  );
}
