import { getMapMonuments } from '@/lib/kuhi-api';
import { MapClientComponent } from './MapClientComponent';
import { mapMonumentsToHaikuMonuments } from '@/lib/api-mappers';

async function fetchMonumentsData() {
  return await getMapMonuments();
}

export async function MapServerComponent() {
  try {
    const monuments = await fetchMonumentsData();
    const haikuMonuments = mapMonumentsToHaikuMonuments(monuments);

    return <MapClientComponent initialMonuments={haikuMonuments} />;
  } catch {
    return <MapClientComponent initialMonuments={[]} />;
  }
}
