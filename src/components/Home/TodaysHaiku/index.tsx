import { Suspense } from 'react';
import { TodaysHaikuServerComponent } from './TodaysHaikuServerComponent';
import { TodaysHaikuSkeleton } from './TodaysHaikuSkeleton';

export function TodaysHaikuSection() {
  return (
    <Suspense fallback={<TodaysHaikuSkeleton />}>
      <TodaysHaikuServerComponent />
    </Suspense>
  );
}
