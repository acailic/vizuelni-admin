import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vizualni - Serbian Data Visualization',
  description: 'Beautiful charts for Serbian government data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
