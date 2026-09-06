import { Suspense } from 'react';
import { DatabaseStatsServerComponent } from './DatabaseStatsServerComponent';
import { DatabaseStatsSkeleton } from './DatabaseStatsSkeleton';

export function DatabaseStatsContainer() {
  return (
    <Suspense fallback={<DatabaseStatsSkeleton />}>
      <DatabaseStatsServerComponent />
    </Suspense>
  );
}
