import { unstable_cache } from 'next/cache';
import { getAllPoets, getAllLocations } from '@/lib/kuhi-api';
import { getListMonumentsPage } from '@/lib/server-monument-search';
import { MONUMENT_PAGE_SIZE } from '@/lib/monument-search';
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
  () => getListMonumentsPage({ limit: MONUMENT_PAGE_SIZE }),
  ['list-initial-monuments-60'],
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
    (hasFilters
      ? getListMonumentsPage({
          limit: MONUMENT_PAGE_SIZE,
          q: searchParams?.q,
          region,
          prefecture,
          poet_id: poetId,
        })
      : getCachedInitialMonuments()
    ).catch((error: unknown) => {
      console.error('[list] failed to load monuments on the server', error);
      return undefined;
    }),
    loadOrEmpty(getCachedPoets, 'poets'),
    loadOrEmpty(getCachedLocations, 'locations'),
  ]);

  return (
    <HaikuListClientComponent
      initialMonuments={monuments}
      initialSearchParams={searchParams}
      locations={locations}
      poets={poets}
    />
  );
}
