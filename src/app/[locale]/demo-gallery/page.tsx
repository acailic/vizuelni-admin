import { getMessages, resolveLocale } from '@/lib/i18n/messages';
import { demoGalleryExamples } from '@/lib/examples/demo-gallery-examples';
import { DemoGalleryClient } from '@/components/demo-gallery';

export default async function DemoGalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const messages = getMessages(locale);

  return (
    <main className='container-custom py-8'>
      <DemoGalleryClient
        examples={demoGalleryExamples}
        locale={locale}
        labels={{
          title: messages.demoGallery?.title ?? 'Serbia Data Gallery',
          subtitle:
            messages.demoGallery?.subtitle ?? 'Interactive visualizations',
          categories: messages.demoGallery?.categories ?? {},
          modal: messages.demoGallery?.modal ?? {
            close: 'Close',
            viewData: 'View Data',
            hideData: 'Hide Data',
          },
        }}
      />
    </main>
  );
}
