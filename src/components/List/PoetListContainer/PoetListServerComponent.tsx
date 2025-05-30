import { getAllPoets } from '@/lib/server-api';
import { PoetListClientComponent } from './PoetListClientComponent';

export async function PoetListServerComponent() {
  const poets = await getAllPoets();

  return <PoetListClientComponent poets={poets} />;
}
