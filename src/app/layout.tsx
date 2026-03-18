import type { Metadata } from 'next';

import './globals.css';
import { Providers } from './providers';
import { Analytics } from '@/components/Analytics';

export const metadata: Metadata = {
  title: 'Визуелни Административни Подаци Србије | Visual Admin Serbia',
  description:
    'Create and embed visualizations from Serbian open government data - направите и уметните визуализације из отворених података владе Србије',
  keywords:
    'open data, visualization, Serbia, отворени подаци, визуализација, Србија, Србија, data.gov.rs',
  authors: [{ name: 'Vizuelni Admin Srbije Team' }],
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'Визуелни Административни Подаци Србије',
    description: 'Explore and visualize Serbian government open data',
    locale: 'sr_RS',
    alternateLocale: ['en_US'],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='sr' suppressHydrationWarning>
      <body className='font-sans'>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
