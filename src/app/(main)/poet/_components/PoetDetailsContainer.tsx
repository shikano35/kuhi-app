import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getPoetById, getMonumentsByPoet } from '@/lib/kuhi-api';
import { PoetProfile } from './PoetProfile';
import { PoetMonuments } from './PoetMonuments';
import { RelatedMaterialsGallery } from '@/components/shared/RelatedMaterialsGallery';

type PoetDetailsContainerProps = {
  poetId: number;
};

async function PoetData({ poetId }: { poetId: number }) {
  const [poet, monuments] = await Promise.all([
    getPoetById(poetId),
    getMonumentsByPoet(poetId),
  ]);

  if (!poet) {
    notFound();
  }

  return (
    <>
      <PoetProfile poet={poet} />
      <PoetMonuments monuments={monuments} poetName={poet.name} />
      <RelatedMaterialsGallery className="my-8" poetName={poet.name} />
    </>
  );
}

export function PoetDetailsContainer({ poetId }: PoetDetailsContainerProps) {
  return (
    <Suspense fallback={<PoetDetailsSkeleton />}>
      <PoetData poetId={poetId} />
    </Suspense>
  );
}

function PoetDetailsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="bg-background rounded-lg shadow-md overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-48 h-80 bg-muted rounded-2xl animate-pulse" />
            <div className="grow space-y-4">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div className="bg-background rounded-lg p-4 space-y-4" key={i}>
              <div className="h-32 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="h-8 bg-muted rounded animate-pulse w-64 mb-6" />
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="h-10 bg-muted rounded animate-pulse w-32" />
              <div className="h-10 bg-muted rounded animate-pulse w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  className="bg-muted rounded-lg h-64 animate-pulse"
                  key={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
