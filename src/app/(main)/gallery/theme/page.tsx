import { Metadata } from 'next';
import ThemeGalleryClient from './ThemeGalleryClient';
import { baseMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'テーマ別ギャラリー | くひめぐり',
  description:
    '季節、地域、俳人、時代別に関連する文化資料、書籍、写真、歴史的文書を探索できます。',
  keywords: '俳句, テーマ別, ギャラリー, 季節, 地域, 俳人, 時代, 文化資料',
};

type ThemeType = 'season' | 'region' | 'poet' | 'era';

type PageProps = {
  searchParams: Promise<{
    theme?: ThemeType;
    query?: string;
    page?: string;
  }>;
};

export default async function ThemeGalleryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const theme = params.theme || 'season';
  const query = params.query || '春';
  const page = parseInt(params.page || '1');

  return (
    <ThemeGalleryClient
      initialPage={page}
      initialQuery={query}
      initialTheme={theme}
    />
  );
}
