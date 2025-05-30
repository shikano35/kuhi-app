import { Suspense } from 'react';
import { HaikuListServerComponent } from './HaikuListServerComponent';
import { HaikuListSkeleton } from './HaikuListSkeleton';

type HaikuListContainerProps = {
  searchParams?: {
    q?: string;
    region?: string;
    prefecture?: string;
    poet_id?: string;
  };
};

export function HaikuListContainer({ searchParams }: HaikuListContainerProps) {
  return (
    <Suspense fallback={<HaikuListSkeleton />}>
      <HaikuListServerComponent searchParams={searchParams} />
    </Suspense>
  );
}
