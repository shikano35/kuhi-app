import { getMapMonuments } from '@/lib/kuhi-api';
import { MapClientComponent } from './MapClientComponent';
import { mapMonumentsToHaikuMonuments } from '@/lib/api-mappers';

export async function MapServerComponent() {
  const monuments = await getMapMonuments();
  const haikuMonuments = mapMonumentsToHaikuMonuments(monuments);

  return <MapClientComponent initialMonuments={haikuMonuments} />;
}
