import ImageGalleryContainer from '@/app/(main)/gallery/_components/ImageGalleryContainer';
import { baseMetadata } from '@/lib/metadata';
import { Metadata } from 'next';

export const metadata: Metadata = {
  ...baseMetadata,
  title: '画像ギャラリー | くひめぐり',
  description: 'Japan Search APIから画像を検索し、美しいギャラリー形式で表示',
};

export default function ImageGalleryPage() {
  return <ImageGalleryContainer />;
}
