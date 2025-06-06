import { notFound } from 'next/navigation';
import { GalleryDetailContainer } from '@/components/Gallery/GalleryDetailContainer';
import { baseMetadata } from '@/lib/metadata';

export function generateMetadata() {
  return {
    ...baseMetadata,
    title: `ギャラリー詳細 | 句碑アプリ`,
    description: `Japan Search APIからの文化資料の詳細情報`,
  };
}

type GalleryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GalleryDetailPage({
  params,
}: GalleryDetailPageProps) {
  const { id } = await params;

  if (!id || typeof id !== 'string') {
    notFound();
  }

  return <GalleryDetailContainer itemId={id} />;
}
