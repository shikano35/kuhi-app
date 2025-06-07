import ImageGalleryClient from '@/components/Gallery/ImageGalleryClient';
import { baseMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = {
  ...baseMetadata,
  title: '画像ギャラリー | 句碑アプリ',
  description: 'Japan Search APIから画像を検索し、美しいギャラリー形式で表示',
};

export default function ImageGalleryPage() {
  return <ImageGalleryClient />;
}
