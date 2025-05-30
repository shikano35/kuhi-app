import { getAllHaikuMonuments } from '@/lib/server-api';
import { MapClientComponent } from './MapClientComponent';

export async function MapServerComponent() {
  const monuments = await getAllHaikuMonuments();

  return <MapClientComponent initialMonuments={monuments} />;
}
