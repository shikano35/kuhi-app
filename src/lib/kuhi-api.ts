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

function getKuhiApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api/kuhi';
  }

  return process.env.KUHI_API_URL ?? 'https://api.kuhi.jp';
}

async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 }, // 1時間キャッシュ
  });

  if (!response.ok) {
    throw new KuhiApiError(
      `API request failed: ${response.status} ${response.statusText}`,
      response.status,
      response
    );
  }

  return response.json();
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
  const base = getKuhiApiBaseUrl();
  const url = `${base}/monuments${queryString ? `?${queryString}` : ''}`;
  return await fetcher<MonumentWithRelations[]>(url);
}

// inscriptionsから全ての句碑データを再構築する関数
export async function getAllMonumentsFromInscriptions(): Promise<
  MonumentWithRelations[]
> {
  const allInscriptions: Inscription[] = [];
  let offset = 0;
  const limit = 50;
  let hasMore = true;

  // 全ての碑文データを取得
  while (hasMore) {
    const base = getKuhiApiBaseUrl();
    const url = `${base}/inscriptions?limit=${limit}&offset=${offset}`;
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
    if (monument && monument.inscriptions) {
      monument.inscriptions.push(inscription);

      if (inscription.poems) {
        const lastIndex = monument.inscriptions.length - 1;
        monument.inscriptions[lastIndex].poems = inscription.poems;
      }
    }
  }

  const monuments = Array.from(monumentsMap.values());
  return monuments;
}

export async function getAllMonuments(): Promise<MonumentWithRelations[]> {
  if (typeof window !== 'undefined') {
    const response = await fetch('/api/kuhi/monuments/all', {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new KuhiApiError(
        `全句碑取得失敗: ${response.status} ${response.statusText}`,
        response.status,
        response
      );
    }

    const result = await response.json();
    return result.monuments ?? result;
  }

  const monuments = await getMonuments({ limit: 10 });
  if (monuments.length > 0) {
    return await getAllMonumentsFromPagination();
  }

  return await getAllMonumentsFromInscriptions();
}

// 通常のページネーション取得
async function getAllMonumentsFromPagination(): Promise<
  MonumentWithRelations[]
> {
  const allMonuments: MonumentWithRelations[] = [];
  let offset = 0;
  const limit = 30;
  let hasMore = true;

  while (hasMore) {
    const monuments = await getMonuments({ limit, offset });

    if (monuments.length === 0) {
      hasMore = false;
    } else {
      allMonuments.push(...monuments);
      offset += limit;

      if (monuments.length < limit) {
        hasMore = false;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  if (allMonuments.length === 0) {
    return await getAllMonumentsFromInscriptions();
  }

  return allMonuments;
}

// 全ての俳人を取得する関数
export async function getAllPoets(): Promise<Poet[]> {
  if (typeof window !== 'undefined') {
    const response = await fetch('/api/kuhi/poets/all', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new KuhiApiError(
        `全俳人取得失敗: ${response.status} ${response.statusText}`,
        response.status,
        response
      );
    }

    return response.json();
  }

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

export async function getMonumentById(
  id: number
): Promise<MonumentWithRelations> {
  const base = getKuhiApiBaseUrl();
  const url = `${base}/monuments/${id}`;
  return fetcher<MonumentWithRelations>(url);
}

export async function getPoets(params: PoetsQueryParams = {}): Promise<Poet[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const base = getKuhiApiBaseUrl();
  const url = `${base}/poets${queryString ? `?${queryString}` : ''}`;
  return fetcher<Poet[]>(url);
}

export async function getPoetById(id: number): Promise<Poet> {
  const base = getKuhiApiBaseUrl();
  const url = `${base}/poets/${id}`;
  return fetcher<Poet>(url);
}

export async function getMonumentsByPoet(
  poetId: number
): Promise<MonumentWithRelations[]> {
  const base = getKuhiApiBaseUrl();
  const url = `${base}/poets/${poetId}/monuments`;
  const simpleMonuments = await fetcher<{ id: number }[]>(url);

  const monumentPromises = simpleMonuments.map((monument) =>
    getMonumentById(monument.id)
  );

  return Promise.all(monumentPromises);
}

// Location API
export async function getLocations(
  params: LocationsQueryParams = {}
): Promise<Location[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const base = getKuhiApiBaseUrl();
  const url = `${base}/locations${queryString ? `?${queryString}` : ''}`;
  return fetcher<Location[]>(url);
}

export async function getLocationById(id: number): Promise<Location> {
  const base = getKuhiApiBaseUrl();
  const url = `${base}/locations/${id}`;
  return fetcher<Location>(url);
}

export async function getMonumentsByLocation(
  locationId: number
): Promise<MonumentWithRelations[]> {
  const base = getKuhiApiBaseUrl();
  const url = `${base}/locations/${locationId}/monuments`;
  return fetcher<MonumentWithRelations[]>(url);
}

// Source API
export async function getSources(
  params: SourcesQueryParams = {}
): Promise<Source[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const base = getKuhiApiBaseUrl();
  const url = `${base}/sources${queryString ? `?${queryString}` : ''}`;
  return fetcher<Source[]>(url);
}

export async function getSourceById(id: number): Promise<Source> {
  const base = getKuhiApiBaseUrl();
  const url = `${base}/sources/${id}`;
  return fetcher<Source>(url);
}

export async function getMonumentsBySource(
  sourceId: number
): Promise<MonumentWithRelations[]> {
  const base = getKuhiApiBaseUrl();
  const url = `${base}/sources/${sourceId}/monuments`;
  return fetcher<MonumentWithRelations[]>(url);
}

// ユーティリティ関数
export function getMonumentImageUrl(
  monument: MonumentWithRelations
): string | null {
  if (monument.media && monument.media.length > 0) {
    const photo = monument.media.find((m) => m.media_type === 'photo');
    return photo?.url || null;
  }
  return null;
}

export function getMonumentInscription(
  monument: MonumentWithRelations
): string | null {
  if (monument.inscriptions && monument.inscriptions.length > 0) {
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

export function getMonumentPoems(monument: MonumentWithRelations): string[] {
  if (monument.inscriptions && monument.inscriptions.length > 0) {
    return monument.inscriptions.flatMap((inscription) =>
      inscription.poems.map((poem) => poem.text)
    );
  }
  return [];
}

export function getMonumentSeasons(monument: MonumentWithRelations): string[] {
  if (monument.inscriptions && monument.inscriptions.length > 0) {
    const seasons = monument.inscriptions.flatMap((inscription) =>
      inscription.poems.map((poem) => poem.season).filter(Boolean)
    );
    return [...new Set(seasons)] as string[];
  }
  return [];
}

export function getMonumentKigo(monument: MonumentWithRelations): string[] {
  if (monument.inscriptions && monument.inscriptions.length > 0) {
    const kigo = monument.inscriptions.flatMap((inscription) =>
      inscription.poems
        .map((poem) => poem.kigo)
        .filter(Boolean)
        .flatMap((k) => (k ? k.split(',') : []))
    );
    return [...new Set(kigo)];
  }
  return [];
}
