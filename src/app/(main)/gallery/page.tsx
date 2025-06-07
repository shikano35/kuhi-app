import { Metadata } from 'next';
import { GalleryHomeContainer } from './GalleryHomeContainer';
import { baseMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'ギャラリー | くひめぐり',
  description:
    '季節、地域、俳人、時代別に関連する文化資料、書籍、写真、歴史的文書を探索できます。',
  keywords:
    '俳句, テーマ別, ギャラリー, 季節, 地域, 俳人, 時代, 文化資料, 画像ギャラリー',
};

export default function GalleryPage() {
  return <GalleryHomeContainer />;
}
