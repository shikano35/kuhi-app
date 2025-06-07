import { notFound } from 'next/navigation';
import { GalleryDetailContainer } from '@/components/Gallery/GalleryDetailContainer';
import { baseMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }: GalleryDetailPageProps) {
  const { id } = await params;

  const displayId = id
    ? (id.includes('-') ? id.split('-')[0] : id).substring(0, 20)
    : 'unknown';

  return {
    ...baseMetadata,
    title: `文化資料詳細 (${displayId}) | くひめぐり`,
    description: `Japan Search APIから取得した文化資料の詳細情報を表示しています。ID: ${id}`,
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
