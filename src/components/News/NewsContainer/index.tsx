import { Suspense } from 'react';
import { NewsServerComponent } from './NewsServerComponent';
import { NewsSkeleton } from './NewsSkeleton';

export function NewsContainer() {
  return (
    <Suspense fallback={<NewsSkeleton />}>
      <NewsServerComponent />
    </Suspense>
  );
}
