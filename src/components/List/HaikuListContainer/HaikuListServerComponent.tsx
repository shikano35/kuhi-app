import { getMonuments, getPoets, getLocations } from '@/lib/kuhi-api';
import { HaikuListClientComponent } from './HaikuListClientComponent';
import { MonumentWithRelations, Poet } from '@/types/definitions/api';

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
    getMonuments({
      limit: 30,
      q: searchParams?.q,
      region:
        searchParams?.region === 'すべて' ? undefined : searchParams?.region,
      prefecture:
        searchParams?.prefecture === 'すべて'
          ? undefined
          : searchParams?.prefecture,
    }),
    getPoets(),
    getLocations(),
  ]);

  const filteredMonuments = searchParams?.poet_id
    ? monuments.filter((m: MonumentWithRelations) =>
        m.poets.some((p: Poet) => p.id === Number(searchParams.poet_id))
      )
    : monuments;

  return (
    <HaikuListClientComponent
      _initialSearchParams={searchParams}
      initialMonuments={filteredMonuments}
      locations={locations}
      poets={poets}
    />
  );
}
