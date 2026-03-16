import { redirect } from 'next/navigation';

export const dynamicParams = false;

export async function generateStaticParams() {
  return [];
}

interface GalleryDetailRedirectProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function GalleryDetailRedirect({
  params,
}: GalleryDetailRedirectProps) {
  const resolvedParams = await params;
  // Redirect to the canonical chart view route
  redirect(`/${resolvedParams.locale}/v/${resolvedParams.id}`);
}
