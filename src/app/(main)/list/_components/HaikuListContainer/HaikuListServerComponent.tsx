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

const getCachedInitialMonuments = unstable_cache(
  () => getMonumentsPage({ limit: 30 }),
  ['list-initial-monuments'],
  { revalidate: 60 * 60 * 2, tags: ['haiku-monuments'] }
);

async function loadOrEmpty<T>(
  load: () => Promise<T[]>,
  label: string
): Promise<T[]> {
  try {
    return await load();
  } catch (error) {
    console.error(`[list] failed to load ${label} on the server`, error);
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
  const region =
    searchParams?.region === 'すべて' ? undefined : searchParams?.region;
  const prefecture =
    searchParams?.prefecture === 'すべて'
      ? undefined
      : searchParams?.prefecture;
  const poetId = searchParams?.poet_id
    ? Number(searchParams.poet_id)
    : undefined;
  const hasFilters = Boolean(searchParams?.q || region || prefecture || poetId);

  const [monuments, poets, locations] = await Promise.all([
    loadOrEmpty(
      () =>
        hasFilters
          ? getMonumentsPage({
              limit: 30,
              q: searchParams?.q,
              region,
              prefecture,
              poet_id: poetId,
            })
          : getCachedInitialMonuments(),
      'monuments'
    ),
    loadOrEmpty(getCachedPoets, 'poets'),
    loadOrEmpty(getCachedLocations, 'locations'),
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
