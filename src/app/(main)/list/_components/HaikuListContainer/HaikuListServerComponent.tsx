import { unstable_cache } from 'next/cache';
import { getMonumentsPage, getAllPoets, getAllLocations } from '@/lib/kuhi-api';
import { HaikuListClientComponent } from './HaikuListClientComponent';

const getCachedPoets = unstable_cache(getAllPoets, ['list-filter-poets'], {
  revalidate: 60 * 60 * 2,
  tags: ['poets'],
});

const getCachedLocations = unstable_cache(
  getAllLocations,
  ['list-filter-locations'],
  { revalidate: 60 * 60 * 2, tags: ['locations'] }
);

async function loadFilterOptions<T>(
  load: () => Promise<T[]>,
  label: string
): Promise<T[]> {
  try {
    return await load();
  } catch (error) {
    console.error(`[list] failed to load ${label} for filters`, error);
    return [];
  }
}

type HaikuListServerComponentProps = {
  searchParams?: {
    q?: string;
    region?: string;
    prefecture?: string;
    poet_id?: string;
  };
};

export async function HaikuListServerComponent({
  searchParams,
}: HaikuListServerComponentProps) {
  const [monuments, poets, locations] = await Promise.all([
    getMonumentsPage({
      limit: 30,
      q: searchParams?.q,
      region:
        searchParams?.region === 'すべて' ? undefined : searchParams?.region,
      prefecture:
        searchParams?.prefecture === 'すべて'
          ? undefined
          : searchParams?.prefecture,
      poet_id: searchParams?.poet_id ? Number(searchParams.poet_id) : undefined,
    }),
    loadFilterOptions(getCachedPoets, 'poets'),
    loadFilterOptions(getCachedLocations, 'locations'),
  ]);

  return (
    <HaikuListClientComponent
      _initialSearchParams={searchParams}
      initialMonuments={monuments}
      locations={locations}
      poets={poets}
    />
  );
}
