import {
  MonumentWithRelations,
  MonumentsQueryParams,
  Poet,
  Location,
  Source,
  Inscription,
  PoetsQueryParams,
  LocationsQueryParams,
  SourcesQueryParams,
} from '@/types/definitions/api';
import { PREFECTURES, REGIONS } from '@/lib/japan';

const KUHI_API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhi.jp';

const API_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'User-Agent': 'kuhi-app/1.0 (https://kuhi.jp)',
};

const CACHE_REVALIDATE = 7200;
const API_MAX_LIMIT = 100;
const MAX_PAGES = 100;

const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build';

class KuhiApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'KuhiApiError';
  }
}

async function fetcher<T>(url: string, retries = 3): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: API_HEADERS,
        next: { revalidate: CACHE_REVALIDATE },
      });

      if (!response.ok) {
        throw new KuhiApiError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          response
        );
      }

      return response.json();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  throw new Error('Failed to fetch after retries');
}

function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
}

export async function getMonuments(
  params: MonumentsQueryParams = {}
): Promise<MonumentWithRelations[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const url = `${KUHI_API_BASE_URL}/monuments${queryString ? `?${queryString}` : ''}`;
  return fetcher<MonumentWithRelations[]>(url);
}

export async function getMonumentById(
  id: number
): Promise<MonumentWithRelations> {
  const url = `${KUHI_API_BASE_URL}/monuments/${id}`;
  return fetcher<MonumentWithRelations>(url);
}

async function fetchAllMonuments(
  params: MonumentsQueryParams
): Promise<MonumentWithRelations[]> {
  const all: MonumentWithRelations[] = [];

  for (let page = 0; page < MAX_PAGES; page++) {
    const monuments = await getMonuments({
      ...params,
      limit: API_MAX_LIMIT,
      offset: page * API_MAX_LIMIT,
    });

    if (monuments.length === 0) {
      break;
    }

    all.push(...monuments);

    if (monuments.length < API_MAX_LIMIT) {
      break;
    }
  }

  return all;
}

function placeQueriesFor(search: string): MonumentsQueryParams[] {
  const queries: MonumentsQueryParams[] = [];

  const prefecture = PREFECTURES.find(
    (name) => name === search || name.startsWith(search)
  );
  if (prefecture) {
    queries.push({ prefecture });
  }

  const region = REGIONS.find(
    (name) => name === search || name.startsWith(search)
  );
  if (region) {
    queries.push({ region });
  }

  return queries;
}

export async function searchMonuments(
  search: string,
  filters: MonumentsQueryParams = {}
): Promise<MonumentWithRelations[]> {
  const variants: MonumentsQueryParams[] = [
    { q: search },
    { inscription_contains: search },
    ...placeQueriesFor(search).filter(
      (place) =>
        (!place.prefecture || !filters.prefecture) &&
        (!place.region || !filters.region)
    ),
  ];

  const results = await Promise.all(
    variants.map((variant) => fetchAllMonuments({ ...filters, ...variant }))
  );

  const merged = new Map<number, MonumentWithRelations>();
  for (const monument of results.flat()) {
    if (!merged.has(monument.id)) {
      merged.set(monument.id, monument);
    }
  }

  return [...merged.values()];
}

export async function getMonumentsPage(
  params: MonumentsQueryParams = {}
): Promise<MonumentWithRelations[]> {
  const { q, limit = 20, offset = 0, ...filters } = params;

  if (!q) {
    return getMonuments({ ...filters, limit, offset });
  }

  const matched = await searchMonuments(q, filters);
  return matched.slice(offset, offset + limit);
}

export async function getAllMonuments(): Promise<MonumentWithRelations[]> {
  return getMapMonuments();
}

export async function getMapMonuments(): Promise<MonumentWithRelations[]> {
  const allMonuments: MonumentWithRelations[] = [];

  for (let page = 0; page < MAX_PAGES; page++) {
    const offset = page * API_MAX_LIMIT;

    try {
      const monuments = await getMonuments({
        limit: API_MAX_LIMIT,
        offset,
        expand: 'locations,inscriptions.poems,poets',
      });

      if (monuments.length === 0) {
        break;
      }

      allMonuments.push(...monuments);

      if (monuments.length < API_MAX_LIMIT) {
        break;
      }
    } catch (error) {
      if (isBuildPhase()) {
        console.error(
          `[kuhi-api] /monuments failed at offset ${offset} during build; continuing with ${allMonuments.length} items`,
          error
        );
        return allMonuments;
      }
      throw error;
    }
  }

  return allMonuments;
}

export async function getAllMonumentsFromInscriptions(): Promise<
  MonumentWithRelations[]
> {
  const allInscriptions: Inscription[] = [];
  let offset = 0;
  const limit = 50;
  let hasMore = true;

  while (hasMore) {
    const url = `${KUHI_API_BASE_URL}/inscriptions?limit=${limit}&offset=${offset}`;
    const response = (await fetcher(url)) as { inscriptions?: Inscription[] };

    if (response.inscriptions && response.inscriptions.length > 0) {
      allInscriptions.push(...response.inscriptions);
      offset += limit;

      if (response.inscriptions.length < limit) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  const monumentsMap = new Map<number, MonumentWithRelations>();

  for (const inscription of allInscriptions) {
    const monumentId = inscription.monument_id;

    if (typeof monumentId !== 'number') {
      continue;
    }

    if (!monumentsMap.has(monumentId)) {
      monumentsMap.set(monumentId, {
        id: monumentId,
        canonical_name: `句碑 ${monumentId}`,
        canonical_uri: `https://api.kuhi.jp/monuments/${monumentId}`,
        monument_type: '句碑',
        monument_type_uri: null,
        material: null,
        material_uri: null,
        is_reliable: false,
        verification_status: 'unverified' as const,
        verified_at: null,
        verified_by: null,
        reliability_note: null,
        created_at: inscription.created_at || new Date().toISOString(),
        updated_at: inscription.updated_at || new Date().toISOString(),
        inscriptions: [],
        events: [],
        media: [],
        locations: [],
        poets: [],
        sources: [],
        original_established_date: null,
        hu_time_normalized: null,
        interval_start: null,
        interval_end: null,
        uncertainty_note: null,
      });
    }

    const monument = monumentsMap.get(monumentId);
    if (monument?.inscriptions) {
      monument.inscriptions.push(inscription);

      if (inscription.poems) {
        const lastIndex = monument.inscriptions.length - 1;
        monument.inscriptions[lastIndex].poems = inscription.poems;
      }
    }
  }

  return Array.from(monumentsMap.values());
}

export async function getPoets(params: PoetsQueryParams = {}): Promise<Poet[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const url = `${KUHI_API_BASE_URL}/poets${queryString ? `?${queryString}` : ''}`;
  return fetcher<Poet[]>(url);
}

export async function getPoetById(id: number): Promise<Poet> {
  const url = `${KUHI_API_BASE_URL}/poets/${id}`;
  return fetcher<Poet>(url);
}

export async function getAllPoets(): Promise<Poet[]> {
  const allPoets: Poet[] = [];

  for (let page = 0; page < MAX_PAGES; page++) {
    const offset = page * API_MAX_LIMIT;

    try {
      const poets = await getPoets({ limit: API_MAX_LIMIT, offset });

      if (poets.length === 0) {
        break;
      }

      allPoets.push(...poets);

      if (poets.length < API_MAX_LIMIT) {
        break;
      }
    } catch (error) {
      if (isBuildPhase()) {
        console.error(
          `[kuhi-api] /poets failed at offset ${offset} during build; continuing with ${allPoets.length} items`,
          error
        );
        return allPoets;
      }
      throw error;
    }
  }

  return allPoets;
}

export async function getMonumentsByPoet(
  poetId: number
): Promise<MonumentWithRelations[]> {
  const url = `${KUHI_API_BASE_URL}/poets/${poetId}/monuments`;
  const simpleMonuments = await fetcher<{ id: number }[]>(url);

  const monumentPromises = simpleMonuments.map((monument) =>
    getMonumentById(monument.id)
  );

  return Promise.all(monumentPromises);
}

export async function getLocations(
  params: LocationsQueryParams = {}
): Promise<Location[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const url = `${KUHI_API_BASE_URL}/locations${queryString ? `?${queryString}` : ''}`;
  return fetcher<Location[]>(url);
}

export async function getAllLocations(): Promise<Location[]> {
  const allLocations: Location[] = [];
  let offset = 0;
  const limit = API_MAX_LIMIT;
  let hasMore = true;

  while (hasMore) {
    const locations = await getLocations({ limit, offset });

    if (locations.length === 0) {
      hasMore = false;
    } else {
      allLocations.push(...locations);
      offset += limit;

      if (locations.length < limit) {
        hasMore = false;
      }
    }
  }

  return allLocations;
}

export async function getSources(
  params: SourcesQueryParams = {}
): Promise<Source[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const url = `${KUHI_API_BASE_URL}/sources${queryString ? `?${queryString}` : ''}`;
  return fetcher<Source[]>(url);
}

export function getMonumentInscription(
  monument: MonumentWithRelations
): string | null {
  if (monument.inscriptions?.length > 0) {
    const frontInscription = monument.inscriptions.find(
      (i) => i.side === 'front'
    );
    return (
      frontInscription?.original_text ||
      monument.inscriptions[0]?.original_text ||
      null
    );
  }
  return null;
}
