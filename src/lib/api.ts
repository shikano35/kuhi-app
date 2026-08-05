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
  Poet as ApiPoet,
  Location as ApiLocation,
  Source as ApiSource,
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

const CACHE_TTL = {
  SHORT: 60 * 30, // 30分
  MEDIUM: 60 * 60, // 1時間
  LONG: 60 * 60 * 24, // 24時間
} as const;

const API_MAX_LIMIT = 100;

const MAX_PAGES = 100;

export class KuhiApiError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = 'KuhiApiError';
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function apiFetch(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...API_HEADERS,
          ...options.headers,
        },
        next: { revalidate: CACHE_TTL.MEDIUM },
      });

      const isRetryable = response.status >= 500 || response.status === 429;
      if (isRetryable && attempt < retries) {
        await sleep(2 ** attempt * 500);
        continue;
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(2 ** attempt * 500);
        continue;
      }
    }
  }

  throw new KuhiApiError(
    `API request failed after ${retries} attempts: ${url} (${String(lastError)})`
  );
}

async function fetchAllPages<T>(
  path: string,
  params: Record<string, unknown> = {}
): Promise<T[]> {
  const all: T[] = [];

  for (let page = 0; page < MAX_PAGES; page++) {
    const queryString = buildQueryString({
      ...params,
      limit: API_MAX_LIMIT,
      offset: page * API_MAX_LIMIT,
    });
    const response = await apiFetch(`${API_BASE_URL}${path}?${queryString}`);

    if (!response.ok) {
      throw new KuhiApiError(
        `Failed to fetch ${path} at offset ${page * API_MAX_LIMIT}`,
        response.status
      );
    }

    const items = await response.json();
    if (!Array.isArray(items) || items.length === 0) {
      break;
    }

    all.push(...items);

    if (items.length < API_MAX_LIMIT) {
      break;
    }
  }

  return all;
}

async function fetchList<T>(path: string, queryString = ''): Promise<T[]> {
  const url = `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ''}`;
  const response = await apiFetch(url);

  if (!response.ok) {
    throw new KuhiApiError(`Failed to fetch ${path}`, response.status);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
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
  return fetchList<MonumentWithRelations>('/monuments', queryString);
}

export async function getAllMonuments(): Promise<HaikuMonument[]> {
  const monuments = await fetchAllPages<MonumentWithRelations>('/monuments', {
    expand: 'locations,inscriptions.poems,poets',
  });

  return monuments.map(mapMonumentToHaikuMonument);
}

export async function getMonumentById(
  id: number
): Promise<MonumentWithRelations | null> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new KuhiApiError('Invalid monument id');
  }

  const response = await apiFetch(
    `${API_BASE_URL}/monuments/${encodeURIComponent(String(id))}`
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data || null;
}

export async function getPoetMonuments(
  id: number
): Promise<MonumentWithRelations[]> {
  return fetchList<MonumentWithRelations>(`/poets/${id}/monuments`);
}

export async function getPoets(
  params: PoetsQueryParams = {}
): Promise<ApiPoet[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  return fetchList<ApiPoet>('/poets', queryString);
}

export async function getAllPoetsFromApi(): Promise<ApiPoet[]> {
  return fetchAllPages<ApiPoet>('/poets');
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
  return fetchList<ApiLocation>('/locations', queryString);
}

export async function getSources(
  params: SourcesQueryParams = {}
): Promise<ApiSource[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  return fetchList<ApiSource>('/sources', queryString);
}

async function searchMonuments(
  search: string,
  filters: Record<string, unknown>
): Promise<MonumentWithRelations[]> {
  const [byName, byInscription] = await Promise.all([
    fetchAllPages<MonumentWithRelations>('/monuments', {
      ...filters,
      q: search,
    }),
    fetchAllPages<MonumentWithRelations>('/monuments', {
      ...filters,
      inscription_contains: search,
    }),
  ]);

  const merged = new Map<number, MonumentWithRelations>();
  for (const monument of [...byName, ...byInscription]) {
    if (!merged.has(monument.id)) {
      merged.set(monument.id, monument);
    }
  }

  return [...merged.values()];
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
    const filters = {
      region: options.region,
      prefecture: options.prefecture,
      poet_id: options.poet_id,
      ordering: options.ordering?.join(','),
    };

    if (options.search) {
      const matched = await searchMonuments(options.search, filters);
      const mapped = mapMonumentsToHaikuMonuments(matched);
      const offset = options.offset || 0;
      return mapped.slice(offset, offset + (options.limit || 20));
    }

    const monuments = await getMonuments({
      ...filters,
      limit: options.limit || 20,
      offset: options.offset || 0,
      inscription_contains: options.title_contains,
    });
    return mapMonumentsToHaikuMonuments(monuments);
  }

  return getAllMonuments();
}

export async function getHaikuMonumentsPage(
  options: GetHaikuMonumentsOptions & { pageParam?: number }
): Promise<{
  data: HaikuMonument[];
  nextPage: number | undefined;
  hasMore: boolean;
}> {
  const limit = options?.limit || 20;
  const pageParam = options.pageParam || 0;
  const offset = pageParam * limit;

  const filters = {
    region: options?.region,
    prefecture: options?.prefecture,
    poet_id: options?.poet_id,
    ordering: options?.ordering?.join(','),
  };

  if (options?.search) {
    const matched = await searchMonuments(options.search, filters);
    const mapped = mapMonumentsToHaikuMonuments(matched);
    const data = mapped.slice(offset, offset + limit);
    const hasMore = mapped.length > offset + limit;

    return { data, nextPage: hasMore ? pageParam + 1 : undefined, hasMore };
  }

  const monuments = await getMonuments({
    ...filters,
    limit: limit + 1,
    offset,
    inscription_contains: options?.title_contains,
  });
  const mapped = mapMonumentsToHaikuMonuments(monuments);

  const hasMore = mapped.length > limit;
  const data = hasMore ? mapped.slice(0, limit) : mapped;
  const nextPage = hasMore ? pageParam + 1 : undefined;

  return { data, nextPage, hasMore };
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

export async function getAllPoets(): Promise<Poet[]> {
  const apiPoets = await getAllPoetsFromApi();
  return apiPoets.map(mapNewPoetToPoet);
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
