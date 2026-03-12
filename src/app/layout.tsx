import type { Metadata } from 'next'

import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Визуелни Администратор Србије | Visual Admin Serbia',
  description: 'Create and embed visualizations from Serbian open government data - Креирајте и уградите визуализације из отворених података владе Србије',
  keywords: 'open data, visualization, Serbia, отворени подаци, визуелизација, Србија, data.gov.rs',
  authors: [{ name: 'Vizuelni Admin Srbije Team' }],
  openGraph: {
    title: 'Визуелни Администратор Србије',
    description: 'Explore and visualize Serbian government open data',
    locale: 'sr_RS',
    alternateLocale: ['en_US'],
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif:wght@400;600;700;900&display=swap&subset=cyrillic" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
