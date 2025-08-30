import {
  MonumentWithRelations,
  MonumentsQueryParams,
  Poet,
  Location,
  Source,
  PoetsQueryParams,
  LocationsQueryParams,
  SourcesQueryParams,
} from '@/types/definitions/api';

const KUHI_API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhi.jp';

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
  const url = `${KUHI_API_BASE_URL}/monuments${queryString ? `?${queryString}` : ''}`;
  const response = await fetcher<MonumentWithRelations[]>(url);
  return response;
}

export async function getMonumentById(
  id: number
): Promise<MonumentWithRelations> {
  const url = `${KUHI_API_BASE_URL}/monuments/${id}`;
  return fetcher<MonumentWithRelations>(url);
}

export async function getPoets(params: PoetsQueryParams = {}): Promise<Poet[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const url = `${KUHI_API_BASE_URL}/poets${queryString ? `?${queryString}` : ''}`;
  const response = await fetcher<Poet[]>(url);
  return response;
}

export async function getPoetById(id: number): Promise<Poet> {
  const url = `${KUHI_API_BASE_URL}/poets/${id}`;
  return fetcher<Poet>(url);
}

export async function getMonumentsByPoet(
  poetId: number
): Promise<MonumentWithRelations[]> {
  const url = `${KUHI_API_BASE_URL}/poets/${poetId}/monuments`;
  return fetcher<MonumentWithRelations[]>(url);
}

// Location API
export async function getLocations(
  params: LocationsQueryParams = {}
): Promise<Location[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const url = `${KUHI_API_BASE_URL}/locations${queryString ? `?${queryString}` : ''}`;
  const response = await fetcher<Location[]>(url);
  return response;
}

export async function getLocationById(id: number): Promise<Location> {
  const url = `${KUHI_API_BASE_URL}/locations/${id}`;
  return fetcher<Location>(url);
}

export async function getMonumentsByLocation(
  locationId: number
): Promise<MonumentWithRelations[]> {
  const url = `${KUHI_API_BASE_URL}/locations/${locationId}/monuments`;
  return fetcher<MonumentWithRelations[]>(url);
}

// Source API
export async function getSources(
  params: SourcesQueryParams = {}
): Promise<Source[]> {
  const queryString = buildQueryString(params as Record<string, unknown>);
  const url = `${KUHI_API_BASE_URL}/sources${queryString ? `?${queryString}` : ''}`;
  const response = await fetcher<Source[]>(url);
  return response;
}

export async function getSourceById(id: number): Promise<Source> {
  const url = `${KUHI_API_BASE_URL}/sources/${id}`;
  return fetcher<Source>(url);
}

export async function getMonumentsBySource(
  sourceId: number
): Promise<MonumentWithRelations[]> {
  const url = `${KUHI_API_BASE_URL}/sources/${sourceId}/monuments`;
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
