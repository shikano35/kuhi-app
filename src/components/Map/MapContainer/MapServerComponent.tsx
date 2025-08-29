import { getAllHaikuMonuments } from '@/lib/server-api';
import { MapClientComponent } from './MapClientComponent';

export async function MapServerComponent() {
  const monuments = await getAllHaikuMonuments({ limit: 50 });

  return <MapClientComponent initialMonuments={monuments} />;
}
