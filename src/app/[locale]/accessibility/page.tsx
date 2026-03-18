import type { Metadata } from 'next';
import { resolveLocale } from '@/lib/i18n/messages';
import { AccessibilityContent } from './AccessibilityContent';

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description:
    'Information about accessibility compliance for the Serbian Government Data Visualization Platform',
};

interface AccessibilityPageProps {
  params: { locale: string };
}

export default function AccessibilityPage({ params }: AccessibilityPageProps) {
  const locale = resolveLocale(params.locale);

  return <AccessibilityContent locale={locale} />;
}
