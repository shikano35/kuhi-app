'use client';

import { useRelatedMaterials, useRelatedImages } from '@/lib/japansearch-hooks';
import { RelatedMaterialsGalleryClient } from './RelatedMaterialsGalleryClient';

type RelatedMaterialsGalleryProps = {
  poetName: string;
  className?: string;
};

export function RelatedMaterialsGallery({
  poetName,
  className,
}: RelatedMaterialsGalleryProps) {
  const materialsQuery = useRelatedMaterials(poetName);
  const imagesQuery = useRelatedImages(poetName);

  return (
    <RelatedMaterialsGalleryClient
      className={className}
      imagesQuery={imagesQuery}
      materialsQuery={materialsQuery}
      poetName={poetName}
    />
  );
}
