'use client';

import Script from 'next/script';

/**
 * Analytics component that loads the appropriate tracking script
 * based on the configured provider.
 *
 * Privacy-focused: no cookies, anonymized IPs, no personal data.
 */
export function Analytics() {
  const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER || 'none';

  // Don't render anything if analytics disabled
  if (!enabled) {
    return null;
  }

  // Plausible Analytics
  if (provider === 'plausible') {
    const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
    if (!domain) {
      console.warn('[Analytics] Plausible domain not configured');
      return null;
    }

    return (
      <Script
        defer
        data-domain={domain}
        src='https://plausible.io/js/script.js'
        strategy='afterInteractive'
      />
    );
  }

  // Umami Analytics
  if (provider === 'umami') {
    const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
    const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;

    if (!websiteId || !umamiUrl) {
      console.warn('[Analytics] Umami configuration missing');
      return null;
    }

    return (
      <Script
        async
        src={`${umamiUrl}/script.js`}
        data-website-id={websiteId}
        strategy='afterInteractive'
      />
    );
  }

  // Vercel Analytics is handled via @vercel/analytics/react
  // This component doesn't need to render anything for Vercel
  if (provider === 'vercel') {
    return null;
  }

  return null;
}

/**
 * Vercel Analytics wrapper component
 * Import this separately if using Vercel Analytics
 */
export async function VercelAnalytics() {
  if (process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER !== 'vercel') {
    return null;
  }

  try {
    const { Analytics } = await import('@vercel/analytics/react');
    return <Analytics />;
  } catch {
    // @vercel/analytics not installed
    console.warn('[Analytics] @vercel/analytics not installed');
    return null;
  }
}
