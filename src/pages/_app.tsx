import type { AppProps } from 'next/app';

export default function LegacyAppShell({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
