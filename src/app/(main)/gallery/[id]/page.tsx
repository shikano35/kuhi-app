import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GalleryDetailContainer } from '@/app/(main)/gallery/_components/GalleryDetailContainer';
import { baseMetadata } from '@/lib/metadata';
import { normalizeJapanSearchItem } from '@/lib/japansearch-types';

type GalleryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getJapanSearchItemTitle(id: string): Promise<string | null> {
  try {
    const decodedId = decodeURIComponent(id);
    const response = await fetch(
      `https://jpsearch.go.jp/api/item/${decodedId}`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Kuhi-App/1.0',
        },
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const normalized = normalizeJapanSearchItem(data);
    return normalized.common?.title || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: GalleryDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  const title = await getJapanSearchItemTitle(id);

  if (title) {
    return {
      ...baseMetadata,
      title: `${title} | くひめぐり`,
      description: `「${title}」の詳細情報 - Japan Search APIから取得した文化資料`,
    };
  }

  return {
    ...baseMetadata,
    title: '文化資料詳細 | くひめぐり',
    description: 'Japan Search APIから取得した文化資料の詳細情報',
  };
}

export default async function GalleryDetailPage({
  params,
}: GalleryDetailPageProps) {
  const { id } = await params;

  if (!id || typeof id !== 'string') {
    notFound();
  }

  return <GalleryDetailContainer itemId={id} />;
}
