import {
  getAllMonuments,
  getAllMonumentsFromInscriptions,
} from '@/lib/kuhi-api';
import { MapClientComponent } from './MapClientComponent';
import { mapMonumentsToHaikuMonuments } from '@/lib/api-mappers';
import type { MonumentWithRelations } from '@/types/definitions/api';

export async function MapServerComponent() {
  try {
    let monuments: MonumentWithRelations[] = [];

    try {
      monuments = await getAllMonuments();
    } catch {
      try {
        monuments = await getAllMonumentsFromInscriptions();
      } catch {
        monuments = [];
      }
    }

    const haikuMonuments = mapMonumentsToHaikuMonuments(monuments);

    return <MapClientComponent initialMonuments={haikuMonuments} />;
  } catch {
    return <MapClientComponent initialMonuments={[]} />;
  }
}
