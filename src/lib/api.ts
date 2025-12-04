import {
  HaikuMonument,
  Location,
  Poet,
  Source,
  News,
} from '@/types/definitions/haiku';
import {
  MonumentWithRelations,
  MonumentsQueryParams,
  PoetsQueryParams,
  LocationsQueryParams,
  SourcesQueryParams,
  PoemsQueryParams,
  InscriptionsQueryParams,
  Poet as ApiPoet,
  Location as ApiLocation,
  Source as ApiSource,
  Inscription,
  Event,
  Media,
  InscriptionWithMonument,
  PoemWithRelations,
} from '@/types/definitions/api';
import {
  mapMonumentsToHaikuMonuments,
  mapMonumentToHaikuMonument,
  mapNewPoetToPoet,
  mapNewLocationsToLocations,
  mapNewSourcesToSources,
} from '@/lib/api-mappers';

const API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhi.jp';

const API_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'User-Agent': 'kuhi-app/1.0 (https://kuhi.jp)',
};

async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: {
      ...API_HEADERS,
      ...options.headers,
    },
    next: { revalidate: 3600 }, // 1時間キャッシュ
  });
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
  const url = `${API_BASE_URL}/monuments${queryString ? `?${queryString}` : ''}`;

  const response = await apiFetch(url);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getAllMonuments(): Promise<HaikuMonument[]> {
  try {
    const allMonuments: MonumentWithRelations[] = [];
    const batchSize = 6;
    const limit = 100;

    const promises = Array.from({ length: batchSize }, (_, i) => {
      const offset = i * limit;
      const url = `${API_BASE_URL}/monuments?limit=${limit}&offset=${offset}&expand=locations,inscriptions.poems,poets`;

      return apiFetch(url)
        .then(async (response) => {
          if (!response.ok) {
            return [] as MonumentWithRelations[];
          }
          const monuments = await response.json();
          return Array.isArray(monuments) ? monuments : [];
        })
        .catch(() => [] as MonumentWithRelations[]);
    });

    const results = await Promise.allSettled(promises);

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allMonuments.push(...result.value);
      }
    });
    return allMonuments.map(mapMonumentToHaikuMonument);
  } catch (error) {
    console.error('Error fetching all monuments:', error);
    return [];
  }
}

export async function getMonumentById(
  id: number
): Promise<MonumentWithRelations | null> {
  const response = await apiFetch(`${API_BASE_URL}/monuments/${id}`);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data || null;
}

export async function getPoetMonuments(
  id: number
): Promise<MonumentWithRelations[]> {
  const response = await apiFetch(`${API_BASE_URL}/poets/${id}/monuments`);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getPoets(
  params: PoetsQueryParams = {}
): Promise<ApiPoet[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const url = `${API_BASE_URL}/poets${queryString ? `?${queryString}` : ''}`;

  const response = await apiFetch(url);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getAllPoetsFromApi(): Promise<ApiPoet[]> {
  try {
    const allPoets: ApiPoet[] = [];
    let offset = 0;
    const limit = 50;
    let hasMore = true;

    while (hasMore) {
      const url = `${API_BASE_URL}/poets?limit=${limit}&offset=${offset}`;
      const response = await apiFetch(url);

      if (!response.ok) {
        break;
      }

      const poets = await response.json();
      if (!Array.isArray(poets) || poets.length === 0) {
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
  } catch (error) {
    console.error('Error fetching poets from API:', error);
    return [];
  }
}

export async function getPoetById(id: number): Promise<ApiPoet | null> {
  const response = await apiFetch(`${API_BASE_URL}/poets/${id}`);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data || null;
}

export async function getLocations(
  params: LocationsQueryParams = {}
): Promise<ApiLocation[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const url = `${API_BASE_URL}/locations${queryString ? `?${queryString}` : ''}`;

  const response = await apiFetch(url);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getSources(
  params: SourcesQueryParams = {}
): Promise<ApiSource[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const url = `${API_BASE_URL}/sources${queryString ? `?${queryString}` : ''}`;

  const response = await apiFetch(url);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getMonumentsByCoordinates(
  lat: number,
  lon: number,
  radius: number
): Promise<MonumentWithRelations[]> {
  const latDelta = radius / 111000;
  const lonDelta = radius / (111000 * Math.cos((lat * Math.PI) / 180));

  const bbox = `${lon - lonDelta},${lat - latDelta},${lon + lonDelta},${lat + latDelta}`;

  const queryString = buildQueryString({ bbox });
  const url = `${API_BASE_URL}/monuments?${queryString}`;

  const response = await fetch(url);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getMonumentInscriptions(
  id: number
): Promise<Inscription[]> {
  const response = await fetch(`${API_BASE_URL}/monuments/${id}/inscriptions`);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getMonumentEvents(id: number): Promise<Event[]> {
  const response = await fetch(`${API_BASE_URL}/monuments/${id}/events`);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getMonumentMedia(id: number): Promise<Media[]> {
  const response = await fetch(`${API_BASE_URL}/monuments/${id}/media`);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getInscriptions(
  params: InscriptionsQueryParams = {}
): Promise<InscriptionWithMonument[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const url = `${API_BASE_URL}/inscriptions${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.inscriptions || [];
}

export async function getInscriptionById(
  id: number
): Promise<InscriptionWithMonument | null> {
  const response = await fetch(`${API_BASE_URL}/inscriptions/${id}`);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data || null;
}

export async function getPoems(
  params: PoemsQueryParams = {}
): Promise<PoemWithRelations[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const url = `${API_BASE_URL}/poems${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.poems || [];
}

export async function getPoemById(
  id: number
): Promise<PoemWithRelations | null> {
  const response = await fetch(`${API_BASE_URL}/poems/${id}`);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data || null;
}

export async function getLocationById(id: number): Promise<ApiLocation | null> {
  const response = await fetch(`${API_BASE_URL}/locations/${id}`);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data || null;
}

export async function getLocationMonuments(
  id: number
): Promise<MonumentWithRelations[]> {
  const response = await fetch(`${API_BASE_URL}/locations/${id}/monuments`);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function getSourceById(id: number): Promise<ApiSource | null> {
  const response = await fetch(`${API_BASE_URL}/sources/${id}`);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data || null;
}

export async function getSourceMonuments(
  id: number
): Promise<MonumentWithRelations[]> {
  const response = await fetch(`${API_BASE_URL}/sources/${id}/monuments`);

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

type GetHaikuMonumentsOptions = {
  limit?: number;
  offset?: number;
  search?: string;
  region?: string;
  prefecture?: string;
  poet_id?: number;
  title_contains?: string;
  name_contains?: string;
  ordering?: string[];
};

export async function getAllHaikuMonuments(
  options?: GetHaikuMonumentsOptions
): Promise<HaikuMonument[]> {
  if (options && Object.keys(options).length > 0) {
    const params = {
      limit: options.limit || 20,
      offset: options.offset || 0,
      q: options.search,
      region: options.region,
      prefecture: options.prefecture,
      poet_id: options.poet_id,
      inscription_contains: options.title_contains,
      poet_name_contains: options.name_contains,
      ordering: options.ordering?.join(','),
    };

    const monuments = await getMonuments(params);
    const mapped = mapMonumentsToHaikuMonuments(monuments);
    return mapped;
  }

  const monuments = await getAllMonuments();
  return monuments;
}

export async function getHaikuMonumentsPage(
  options: GetHaikuMonumentsOptions & { pageParam?: number }
): Promise<{
  data: HaikuMonument[];
  nextPage: number | undefined;
  hasMore: boolean;
}> {
  const limit = options?.limit || 20;
  const offset = (options.pageParam || 0) * limit;

  const params = {
    limit: limit + 1,
    offset,
    q: options?.search,
    region: options?.region,
    prefecture: options?.prefecture,
    poet_id: options?.poet_id,
    inscription_contains: options?.title_contains,
    poet_name_contains: options?.name_contains,
    ordering: options?.ordering?.join(','),
  };

  const monuments = await getMonuments(params);
  const mapped = mapMonumentsToHaikuMonuments(monuments);

  const hasMore = mapped.length > limit;
  const data = hasMore ? mapped.slice(0, limit) : mapped;
  const nextPage = hasMore ? (options.pageParam || 0) + 1 : undefined;

  return {
    data,
    nextPage,
    hasMore,
  };
}

export async function getHaikuMonumentById(
  id: number
): Promise<HaikuMonument | null> {
  const monument = await getMonumentById(id);

  if (!monument) {
    return null;
  }

  return mapMonumentToHaikuMonument(monument);
}

export async function getHaikuMonumentsByPoet(
  poetId: number
): Promise<HaikuMonument[]> {
  const monuments = await getPoetMonuments(poetId);
  return mapMonumentsToHaikuMonuments(monuments);
}

export async function getHaikuMonumentsByRegion(
  region: string
): Promise<HaikuMonument[]> {
  const monuments = await getMonuments({ region });
  return mapMonumentsToHaikuMonuments(monuments);
}

export async function getAllPoets(): Promise<Poet[]> {
  try {
    const apiPoets = await getAllPoetsFromApi();
    const mappedPoets = apiPoets.map(mapNewPoetToPoet);

    return mappedPoets;
  } catch (error) {
    console.error('Error in getAllPoets:', error);
    return [];
  }
}

export async function getPoetByIdOld(id: number): Promise<Poet | null> {
  const poet = await getPoetById(id);

  if (!poet) {
    return null;
  }

  return mapNewPoetToPoet(poet);
}

export async function getAllLocations(): Promise<Location[]> {
  const locations = await getLocations();
  return mapNewLocationsToLocations(locations);
}

export async function getAllSources(): Promise<Source[]> {
  const sources = await getSources();
  return mapNewSourcesToSources(sources);
}

export async function getAllNews(): Promise<News[]> {
  const mockNews: News[] = [
    {
      id: 1,
      title: 'くひめぐりβ版公開のお知らせ',
      content:
        'くひめぐりのβ版を公開いたしました。現在、全国の句碑データを順次追加中です。',
      published_at: '2025-08-01T00:00:00Z',
      created_at: '2025-08-01T00:00:00Z',
      updated_at: '2025-08-01T00:00:00Z',
      is_important: true,
      category: 'release',
    },
    {
      id: 2,
      title: '全国句碑データベース構築開始',
      content:
        '日本全国の句碑情報を収集・整理し、デジタルアーカイブとして提供開始いたします。',
      published_at: '2025-07-15T00:00:00Z',
      created_at: '2025-07-15T00:00:00Z',
      updated_at: '2025-07-15T00:00:00Z',
      is_important: false,
      category: 'update',
    },
    {
      id: 3,
      title: '句碑位置情報の精度向上について',
      content:
        'GPSデータの精度向上により、より正確な句碑の位置情報を提供できるようになりました。',
      published_at: '2025-07-01T00:00:00Z',
      created_at: '2025-07-01T00:00:00Z',
      updated_at: '2025-07-01T00:00:00Z',
      is_important: false,
      category: 'improvement',
    },
    {
      id: 4,
      title: 'API仕様変更のお知らせ',
      content:
        'より効率的なデータ取得のため、API仕様を一部変更いたしました。ユーザーの皆様への影響はございません。',
      published_at: '2025-06-15T00:00:00Z',
      created_at: '2025-06-15T00:00:00Z',
      updated_at: '2025-06-15T00:00:00Z',
      is_important: false,
      category: 'maintenance',
    },
  ];

  return mockNews;
}

export async function getHaikuMonumentsByCoordinates(
  lat: number,
  lon: number,
  radius: number
): Promise<HaikuMonument[]> {
  const monuments = await getMonumentsByCoordinates(lat, lon, radius);
  return mapMonumentsToHaikuMonuments(monuments);
}
