'use client';

import { useDefaultImages } from '@/lib/japansearch-hooks';
import { GalleryHomeClient } from './GalleryHomeClient';

export function GalleryHomeContainer() {
  const defaultImagesQuery = useDefaultImages();

  return <GalleryHomeClient defaultImagesQuery={defaultImagesQuery} />;
}
