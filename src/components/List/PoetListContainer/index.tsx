import { Suspense } from 'react';
import { PoetListServerComponent } from './PoetListServerComponent';
import { PoetListSkeleton } from './PoetListSkeleton';

export function PoetListContainer() {
  return (
    <Suspense fallback={<PoetListSkeleton />}>
      <PoetListServerComponent />
    </Suspense>
  );
}
