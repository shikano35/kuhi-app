import { MapContainer } from '@/components/Map/MapContainer';

export const dynamic = 'force-dynamic';

export default function MapPage() {
  return (
    <main className="w-full h-full">
      <MapContainer />
    </main>
  );
}
