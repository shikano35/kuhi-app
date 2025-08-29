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
  mapNewPoetsToPoets,
  mapNewLocationsToLocations,
  mapNewSourcesToSources,
} from '@/lib/api-mappers';

const API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhi.jp';

/**
 * URLパラメータを構築するヘルパー関数
 */
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

/**
 * 句碑一覧を取得
 */
export async function getMonuments(
  params: MonumentsQueryParams = {}
): Promise<MonumentWithRelations[]> {
  try {
    const queryString = buildQueryString(params as Record<string, unknown>);
    const url = `${API_BASE_URL}/monuments${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`句碑データの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('句碑データの取得中にエラーが発生しました:', error);
    throw error;
  }
}

/**
 * 句碑詳細を取得
 */
export async function getMonumentById(
  id: number
): Promise<MonumentWithRelations | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/monuments/${id}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error(`句碑ID:${id}の取得中にエラーが発生しました:`, error);
    return null;
  }
}

/**
 * 俳人に関連する句碑一覧を取得
 */
export async function getPoetMonuments(
  id: number
): Promise<MonumentWithRelations[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/poets/${id}/monuments`);

    if (!response.ok) {
      throw new Error(
        `俳人の句碑データの取得に失敗しました: ${response.status}`
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`俳人ID:${id}の句碑取得中にエラーが発生しました:`, error);
    return [];
  }
}

/**
 * 俳人一覧を取得
 */
export async function getPoets(
  params: PoetsQueryParams = {}
): Promise<ApiPoet[]> {
  try {
    const queryString = buildQueryString(params as Record<string, unknown>);
    const url = `${API_BASE_URL}/poets${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`俳人データの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('俳人データの取得中にエラーが発生しました:', error);
    throw error;
  }
}

/**
 * 俳人詳細を取得
 */
export async function getPoetById(id: number): Promise<ApiPoet | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/poets/${id}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error(`俳人ID:${id}の取得中にエラーが発生しました:`, error);
    return null;
  }
}

/**
 * 設置場所一覧を取得
 */
export async function getLocations(
  params: LocationsQueryParams = {}
): Promise<ApiLocation[]> {
  try {
    const queryString = buildQueryString(params as Record<string, unknown>);
    const url = `${API_BASE_URL}/locations${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`設置場所データの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('設置場所データの取得中にエラーが発生しました:', error);
    throw error;
  }
}

/**
 * 出典一覧を取得
 */
export async function getSources(
  params: SourcesQueryParams = {}
): Promise<ApiSource[]> {
  try {
    const queryString = buildQueryString(params as Record<string, unknown>);
    const url = `${API_BASE_URL}/sources${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`出典データの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('出典データの取得中にエラーが発生しました:', error);
    return [];
  }
}

/**
 * 座標範囲で句碑を取得
 */
export async function getMonumentsByCoordinates(
  lat: number,
  lon: number,
  radius: number
): Promise<MonumentWithRelations[]> {
  try {
    const latDelta = radius / 111000;
    const lonDelta = radius / (111000 * Math.cos((lat * Math.PI) / 180));

    const bbox = `${lon - lonDelta},${lat - latDelta},${lon + lonDelta},${lat + latDelta}`;

    const queryString = buildQueryString({ bbox });
    const url = `${API_BASE_URL}/monuments?${queryString}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `座標周辺の句碑データの取得に失敗しました: ${response.status}`
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('座標周辺の句碑データ取得中にエラーが発生しました:', error);
    return [];
  }
}

/**
 * 句碑の碑文一覧を取得
 */
export async function getMonumentInscriptions(
  id: number
): Promise<Inscription[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/monuments/${id}/inscriptions`
    );

    if (!response.ok) {
      throw new Error(`碑文データの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`句碑ID:${id}の碑文取得中にエラーが発生しました:`, error);
    return [];
  }
}

/**
 * 句碑のイベント一覧を取得
 */
export async function getMonumentEvents(id: number): Promise<Event[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/monuments/${id}/events`);

    if (!response.ok) {
      throw new Error(`イベントデータの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`句碑ID:${id}のイベント取得中にエラーが発生しました:`, error);
    return [];
  }
}

/**
 * 句碑のメディア一覧を取得
 */
export async function getMonumentMedia(id: number): Promise<Media[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/monuments/${id}/media`);

    if (!response.ok) {
      throw new Error(`メディアデータの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`句碑ID:${id}のメディア取得中にエラーが発生しました:`, error);
    return [];
  }
}

/**
 * 碑文一覧を取得
 */
export async function getInscriptions(
  params: InscriptionsQueryParams = {}
): Promise<InscriptionWithMonument[]> {
  try {
    const queryString = buildQueryString(params as Record<string, unknown>);
    const url = `${API_BASE_URL}/inscriptions${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`碑文データの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    return data.inscriptions || [];
  } catch (error) {
    console.error('碑文データの取得中にエラーが発生しました:', error);
    return [];
  }
}

/**
 * 碑文詳細を取得
 */
export async function getInscriptionById(
  id: number
): Promise<InscriptionWithMonument | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/inscriptions/${id}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error(`碑文ID:${id}の取得中にエラーが発生しました:`, error);
    return null;
  }
}

/**
 * 俳句一覧を取得
 */
export async function getPoems(
  params: PoemsQueryParams = {}
): Promise<PoemWithRelations[]> {
  try {
    const queryString = buildQueryString(params as Record<string, unknown>);
    const url = `${API_BASE_URL}/poems${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`俳句データの取得に失敗しました: ${response.status}`);
    }

    const data = await response.json();
    return data.poems || [];
  } catch (error) {
    console.error('俳句データの取得中にエラーが発生しました:', error);
    return [];
  }
}

/**
 * 俳句詳細を取得
 */
export async function getPoemById(
  id: number
): Promise<PoemWithRelations | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/poems/${id}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error(`俳句ID:${id}の取得中にエラーが発生しました:`, error);
    return null;
  }
}

/**
 * 設置場所詳細を取得
 */
export async function getLocationById(id: number): Promise<ApiLocation | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error(`設置場所ID:${id}の取得中にエラーが発生しました:`, error);
    return null;
  }
}

/**
 * 設置場所に関連する句碑一覧を取得
 */
export async function getLocationMonuments(
  id: number
): Promise<MonumentWithRelations[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/${id}/monuments`);

    if (!response.ok) {
      throw new Error(
        `設置場所の句碑データの取得に失敗しました: ${response.status}`
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`設置場所ID:${id}の句碑取得中にエラーが発生しました:`, error);
    return [];
  }
}

/**
 * 出典詳細を取得
 */
export async function getSourceById(id: number): Promise<ApiSource | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/sources/${id}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data || null;
  } catch (error) {
    console.error(`出典ID:${id}の取得中にエラーが発生しました:`, error);
    return null;
  }
}

/**
 * 出典に関連する句碑一覧を取得
 */
export async function getSourceMonuments(
  id: number
): Promise<MonumentWithRelations[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sources/${id}/monuments`);

    if (!response.ok) {
      throw new Error(
        `出典の句碑データの取得に失敗しました: ${response.status}`
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`出典ID:${id}の句碑取得中にエラーが発生しました:`, error);
    return [];
  }
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
  try {
    const params = {
      limit: options?.limit,
      offset: options?.offset,
      q: options?.search,
      region: options?.region,
      prefecture: options?.prefecture,
      poet_id: options?.poet_id,
      inscription_contains: options?.title_contains,
      poet_name_contains: options?.name_contains,
      ordering: options?.ordering?.join(','),
    };

    const monuments = await getMonuments(params);
    return mapMonumentsToHaikuMonuments(monuments);
  } catch (error) {
    console.error('句碑データの取得中にエラーが発生しました:', error);
    return [];
  }
}

export async function getHaikuMonumentById(
  id: number
): Promise<HaikuMonument | null> {
  try {
    const monument = await getMonumentById(id);

    if (!monument) {
      return null;
    }

    return mapMonumentToHaikuMonument(monument);
  } catch (error) {
    console.error(`句碑ID:${id}の取得中にエラーが発生しました:`, error);
    return null;
  }
}

export async function getHaikuMonumentsByPoet(
  poetId: number
): Promise<HaikuMonument[]> {
  try {
    const monuments = await getPoetMonuments(poetId);
    return mapMonumentsToHaikuMonuments(monuments);
  } catch (error) {
    console.error(`俳人ID:${poetId}の句碑取得中にエラーが発生しました:`, error);
    return [];
  }
}

export async function getHaikuMonumentsByRegion(
  region: string
): Promise<HaikuMonument[]> {
  try {
    const monuments = await getMonuments({ region });
    return mapMonumentsToHaikuMonuments(monuments);
  } catch (error) {
    console.error(`地域:${region}の句碑取得中にエラーが発生しました:`, error);
    return [];
  }
}

export async function getAllPoets(): Promise<Poet[]> {
  try {
    const poets = await getPoets();
    return mapNewPoetsToPoets(poets);
  } catch (error) {
    console.error('俳人データの取得中にエラーが発生しました:', error);
    return [];
  }
}

export async function getPoetByIdOld(id: number): Promise<Poet | null> {
  try {
    const poet = await getPoetById(id);

    if (!poet) {
      return null;
    }

    return mapNewPoetToPoet(poet);
  } catch (error) {
    console.error(`俳人ID:${id}の取得中にエラーが発生しました:`, error);
    return null;
  }
}

export async function getAllLocations(): Promise<Location[]> {
  try {
    const locations = await getLocations();
    return mapNewLocationsToLocations(locations);
  } catch (error) {
    console.error('場所データの取得中にエラーが発生しました:', error);
    return [];
  }
}

export async function getAllSources(): Promise<Source[]> {
  try {
    const sources = await getSources();
    return mapNewSourcesToSources(sources);
  } catch (error) {
    console.error('出典データの取得中にエラーが発生しました:', error);
    return [];
  }
}

export async function getAllNews(): Promise<News[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/news`);
    if (!response.ok) {
      throw new Error('お知らせデータの取得に失敗しました');
    }
    const data = (await response.json()) as News[];
    return data;
  } catch (error) {
    console.error('お知らせデータの取得中にエラーが発生しました:', error);
    return [];
  }
}

export async function getHaikuMonumentsByCoordinates(
  lat: number,
  lon: number,
  radius: number
): Promise<HaikuMonument[]> {
  try {
    const monuments = await getMonumentsByCoordinates(lat, lon, radius);
    return mapMonumentsToHaikuMonuments(monuments);
  } catch (error) {
    console.error('座標周辺の句碑データ取得エラー:', error);
    return [];
  }
}
