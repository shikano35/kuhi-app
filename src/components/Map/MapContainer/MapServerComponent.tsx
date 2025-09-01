import { getMonuments } from '@/lib/kuhi-api';
import { MapClientComponent } from './MapClientComponent';
import { mapMonumentsToHaikuMonuments } from '@/lib/api-mappers';

export async function MapServerComponent() {
  try {
    const monuments = await getMonuments({ limit: 50 });
    const haikuMonuments = mapMonumentsToHaikuMonuments(monuments);

    return <MapClientComponent initialMonuments={haikuMonuments} />;
  } catch (error) {
    console.error('Failed to load monuments:', error);
    return <MapClientComponent initialMonuments={[]} />;
  }
}
