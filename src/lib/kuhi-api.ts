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

const KUHI_API_BASE_URL = 'https://api.kuhi.jp';

const API_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'User-Agent': 'kuhi-app/1.0 (https://kuhi.jp)',
};

const CACHE_REVALIDATE = 7200;
const API_MAX_LIMIT = 100;

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

export async function getAllMonuments(): Promise<MonumentWithRelations[]> {
  return getMapMonuments();
}

export async function getMapMonuments(): Promise<MonumentWithRelations[]> {
  try {
    const allMonuments: MonumentWithRelations[] = [];
    let offset = 0;
    let hasMore = true;

    const firstBatch = await getMonuments({
      limit: API_MAX_LIMIT,
      offset: 0,
      expand: 'locations,inscriptions.poems,poets',
    });

    if (firstBatch.length === 0) {
      return [];
    }

    allMonuments.push(...firstBatch);
    offset = API_MAX_LIMIT;

    if (firstBatch.length < API_MAX_LIMIT) {
      return allMonuments;
    }

    while (hasMore) {
      const batchPromises: Promise<MonumentWithRelations[]>[] = [];
      const batchCount = 10;

      for (let i = 0; i < batchCount; i++) {
        const currentOffset = offset + i * API_MAX_LIMIT;
        batchPromises.push(
          getMonuments({
            limit: API_MAX_LIMIT,
            offset: currentOffset,
            expand: 'locations,inscriptions.poems,poets',
          }).catch(() => [] as MonumentWithRelations[])
        );
      }

      const results = await Promise.allSettled(batchPromises);
      let totalInBatch = 0;
      let lastBatchSize = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.length > 0) {
          allMonuments.push(...result.value);
          totalInBatch += result.value.length;
          if (index === results.length - 1 || result.value.length > 0) {
            lastBatchSize = result.value.length;
          }
        }
      });

      offset += batchCount * API_MAX_LIMIT;

      if (totalInBatch === 0 || lastBatchSize < API_MAX_LIMIT) {
        hasMore = false;
      }

      if (allMonuments.length >= 3000) {
        hasMore = false;
      }
    }

    return allMonuments;
  } catch {
    try {
      const monuments = await getMonuments({
        limit: API_MAX_LIMIT,
        expand: 'locations,inscriptions.poems,poets',
      });
      return monuments.filter(
        (m) =>
          m.locations?.length > 0 &&
          m.locations.some((loc) => loc.latitude && loc.longitude)
      );
    } catch {
      return [];
    }
  }
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
  let offset = 0;
  const limit = 50;
  let hasMore = true;

  while (hasMore) {
    const poets = await getPoets({ limit, offset });

    if (poets.length === 0) {
      hasMore = false;
    } else {
      allPoets.push(...poets);
      offset += limit;

      if (poets.length < limit) {
        hasMore = false;
      }
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
