import { Suspense } from 'react';
import { MonumentDetailServerComponent } from './MonumentDetailServerComponent';
import { MonumentDetailSkeleton } from './MonumentDetailSkeleton';

type MonumentDetailContainerProps = {
  monumentId: number;
};

export function MonumentDetailContainer({
  monumentId,
}: MonumentDetailContainerProps) {
  return (
    <Suspense fallback={<MonumentDetailSkeleton />}>
      <MonumentDetailServerComponent monumentId={monumentId} />
    </Suspense>
  );
}
