import { Suspense } from 'react';
import { PoetServerComponent } from './PoetServerComponent';
import { PoetSkeleton } from './PoetSkeleton';

export function PoetContainer() {
  return (
    <Suspense fallback={<PoetSkeleton />}>
      <PoetServerComponent />
    </Suspense>
  );
}
