import { MapContainer } from '@/components/Map/MapContainer';

export const revalidate = 7200;

export const dynamic = 'force-static';

export default function MapPage() {
  return (
    <main className="w-full h-full">
      <MapContainer />
    </main>
  );
}
