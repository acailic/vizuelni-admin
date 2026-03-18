import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['sr-Cyrl', 'sr-Latn', 'en'],
  defaultLocale: 'sr-Cyrl',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
