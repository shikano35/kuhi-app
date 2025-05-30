import {
  getAllHaikuMonuments,
  getAllPoets,
  getAllLocations,
  preloadPoets,
  preloadLocations,
} from '@/lib/server-api';
import { HaikuListClientComponent } from './HaikuListClientComponent';

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
  preloadPoets();
  preloadLocations();

  const [monuments, poets, locations] = await Promise.all([
    getAllHaikuMonuments({
      search: searchParams?.q,
      region:
        searchParams?.region === 'すべて' ? undefined : searchParams?.region,
      prefecture:
        searchParams?.prefecture === 'すべて'
          ? undefined
          : searchParams?.prefecture,
    }),
    getAllPoets(),
    getAllLocations(),
  ]);

  const filteredMonuments = searchParams?.poet_id
    ? monuments.filter((m) =>
        m.poets.some((p) => p.id === Number(searchParams.poet_id))
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
