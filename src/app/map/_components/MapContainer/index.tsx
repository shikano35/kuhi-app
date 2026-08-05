import { Suspense } from 'react';
import { MapServerComponent } from './MapServerComponent';
import { MapSkeleton } from './MapSkeleton';

export function MapContainer() {
  return (
    <Suspense fallback={<MapSkeleton />}>
      <MapServerComponent />
    </Suspense>
  );
}
