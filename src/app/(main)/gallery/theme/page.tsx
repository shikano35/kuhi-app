import { Metadata } from 'next';
import { Suspense } from 'react';
import { baseMetadata } from '@/lib/metadata';
import ThemeGalleryContainer from './ThemeGalleryContainer';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'テーマ別ギャラリー | くひめぐり',
  description:
    '季節、地域、俳人、時代別に関連する文化資料、書籍、写真、歴史的文書を探索できます。',
  keywords: '俳句, テーマ別, ギャラリー, 季節, 地域, 俳人, 時代, 文化資料',
};

function LoadingFallback() {
  return (
    <div className="flex flex-col justify-center items-center h-96">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4">読み込み中...</p>
    </div>
  );
}

export default function ThemeGalleryPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ThemeGalleryContainer />
    </Suspense>
  );
}
