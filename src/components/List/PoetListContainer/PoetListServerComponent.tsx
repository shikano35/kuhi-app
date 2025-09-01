import { getAllPoets } from '@/lib/server-api';
import { PoetListClientComponent } from './PoetListClientComponent';

export default async function PoetListServerComponent() {
  const poets = await getAllPoets();

  return <PoetListClientComponent poets={poets} />;
}
