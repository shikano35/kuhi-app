import { getAllPoets } from '@/lib/server-api';
import { PoetClientComponent } from './PoetClientComponent';

export async function PoetServerComponent() {
  const poets = await getAllPoets();

  return <PoetClientComponent poets={poets} />;
}
