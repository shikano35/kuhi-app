import { unstable_cache } from 'next/cache';
import { getMonuments, searchMonuments } from './kuhi-api';
import { MONUMENT_PAGE_SIZE } from './monument-search';
import type { MonumentsQueryParams } from '@/types/definitions/api';

const getCachedSearchResults = unstable_cache(
  searchMonuments,
  ['monument-search-results-v1'],
  { revalidate: 300, tags: ['haiku-monuments'] }
);

export async function getListMonumentsPage(params: MonumentsQueryParams = {}) {
  const { q, limit = MONUMENT_PAGE_SIZE, offset = 0, ...filters } = params;
  if (!q) return getMonuments({ ...filters, limit, offset });
  const normalizedFilters: MonumentsQueryParams = Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
  );
  const results = await getCachedSearchResults(q, normalizedFilters);
  return results.slice(offset, offset + limit);
}
