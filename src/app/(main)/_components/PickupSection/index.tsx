import { Suspense } from 'react';
import { PickupServerComponent } from './PickupServerComponent';
import { PickupSkeleton } from './PickupSkeleton';

export function PickupSection() {
  return (
    <Suspense fallback={<PickupSkeleton />}>
      <PickupServerComponent />
    </Suspense>
  );
}
