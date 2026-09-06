import { unstable_cache } from 'next/cache';
import { fetchAllMonumentsForExport } from '@/lib/monument-export';

export const getFullMonumentDataset = unstable_cache(
  fetchAllMonumentsForExport,
  ['monuments-full-dataset'],
  { revalidate: 60 * 60, tags: ['haiku-monuments'] }
);
