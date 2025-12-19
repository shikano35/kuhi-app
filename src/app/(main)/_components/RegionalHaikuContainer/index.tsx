import { Suspense } from 'react';
import { RegionalHaikuServerComponent } from './RegionalHaikuServerComponent';
import { RegionalHaikuSkeleton } from './RegionalHaikuSkeleton';

export function RegionalHaikuContainer() {
  return (
    <Suspense fallback={<RegionalHaikuSkeleton />}>
      <RegionalHaikuServerComponent />
    </Suspense>
  );
}
