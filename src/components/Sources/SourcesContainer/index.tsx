import { Suspense } from 'react';
import { SourcesServerComponent } from './SourcesServerComponent';
import { SourcesSkeleton } from './SourcesSkeleton';

export function SourcesContainer() {
  return (
    <Suspense fallback={<SourcesSkeleton />}>
      <SourcesServerComponent />
    </Suspense>
  );
}
