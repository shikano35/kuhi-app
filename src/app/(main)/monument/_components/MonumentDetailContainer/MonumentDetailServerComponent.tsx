import { getHaikuMonumentById } from '@/lib/server-api';
import { MonumentDetailClientComponent } from './MonumentDetailClientComponent';
import { notFound } from 'next/navigation';

type MonumentDetailServerComponentProps = {
  monumentId: number;
};

export async function MonumentDetailServerComponent({
  monumentId,
}: MonumentDetailServerComponentProps) {
  if (!Number.isSafeInteger(monumentId) || monumentId <= 0) {
    notFound();
  }

  const monument = await getHaikuMonumentById(monumentId);

  if (!monument) {
    notFound();
  }

  return <MonumentDetailClientComponent monument={monument} />;
}
