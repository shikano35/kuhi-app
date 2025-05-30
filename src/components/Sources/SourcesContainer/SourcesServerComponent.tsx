import { getAllSources } from '@/lib/server-api';
import { SourcesClientComponent } from './SourcesClientComponent';

export async function SourcesServerComponent() {
  const sources = await getAllSources();

  return <SourcesClientComponent sources={sources} />;
}
