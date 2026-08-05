import { getAllPoets } from '@/lib/kuhi-api';
import { PoetListClientComponent } from './PoetListClientComponent';
import { Poet as ApiPoet } from '@/types/definitions/api';
import { Poet } from '@/types/definitions/haiku';

function mapApiPoetToPoet(poet: ApiPoet): Poet {
  return {
    id: poet.id,
    name: poet.name,
    biography: poet.biography ?? null,
    link_url: poet.link_url ?? null,
    image_url: poet.image_url ?? null,
    created_at: poet.created_at,
    updated_at: poet.updated_at,
  };
}

export default async function PoetListServerComponent() {
  try {
    const apiPoets = await getAllPoets();
    const poets = apiPoets.map(mapApiPoetToPoet);

    return <PoetListClientComponent poets={poets} />;
  } catch (error) {
    console.error('Failed to fetch poets:', error);
    return <PoetListClientComponent poets={[]} />;
  }
}
