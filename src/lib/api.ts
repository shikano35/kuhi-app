import { HaikuMonument, Location, Poet, Source } from '@/types/haiku';

const API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhiapi.com';

interface HaikuMonumentsResponse {
  haiku_monuments: HaikuMonument[];
}

interface SingleHaikuMonumentResponse {
  haiku_monument: HaikuMonument;
}

interface HaikuMonumentsByCoordinatesResponse {
  haiku_monuments: HaikuMonument[];
}

interface GetHaikuMonumentsOptions {
  limit?: number;
  offset?: number;
  search?: string;
  region?: string;
  prefecture?: string;
  poet_id?: number;
  title_contains?: string;
  name_contains?: string;
  ordering?: string[];
}

export async function getAllHaikuMonuments(
  options?: GetHaikuMonumentsOptions
): Promise<HaikuMonument[]> {
  try {
    let url = `${API_BASE_URL}/haiku-monuments`;

    if (options?.poet_id) {
      return getHaikuMonumentsByPoet(options.poet_id);
    }

    const params = new URLSearchParams();

    if (options?.limit) {
      params.append('limit', String(options.limit));
    }

    if (options?.offset) {
      params.append('offset', String(options.offset));
    }

    if (options?.region) {
      params.append('region', options.region);
    }

    if (options?.prefecture) {
      params.append('prefecture', options.prefecture);
    }

    if (options?.search) {
      params.append('search', options.search);
    }

    if (options?.title_contains) {
      params.append('title_contains', options.title_contains);
    }

    if (options?.name_contains) {
      params.append('name_contains', options.name_contains);
    }

    if (options?.ordering && options.ordering.length > 0) {
      options.ordering.forEach((order) => {
        params.append('ordering', order);
      });
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('句碑データの取得に失敗しました');
    }

    const data = (await response.json()) as HaikuMonumentsResponse;
    return data.haiku_monuments || [];
  } catch (error) {
    console.error('句碑データの取得中にエラーが発生しました:', error);
    return [];
  }
}

export async function getHaikuMonumentById(
  id: number
): Promise<HaikuMonument | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/haiku-monuments/${id}`);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as SingleHaikuMonumentResponse;
    return data.haiku_monument || null;
  } catch (error) {
    console.error(`句碑ID:${id}の取得中にエラーが発生しました:`, error);
    return null;
  }
}

export async function getHaikuMonumentsByPoet(
  poetId: number
): Promise<HaikuMonument[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/poets/${poetId}/haiku-monuments`
    );

    if (!response.ok) {
      throw new Error('俳人に関連する句碑の取得に失敗しました');
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object' && 'haiku_monuments' in data) {
      return (data as HaikuMonumentsResponse).haiku_monuments;
    }

    return [];
  } catch (error) {
    console.error(`俳人ID:${poetId}の句碑取得中にエラーが発生しました:`, error);
    return [];
  }
}

export async function getHaikuMonumentsByRegion(
  region: string
): Promise<HaikuMonument[]> {
  try {
    return getAllHaikuMonuments({ region });
  } catch (error) {
    console.error(`地域:${region}の句碑取得中にエラーが発生しました:`, error);
    return [];
  }
}

export async function getAllPoets(): Promise<Poet[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/poets`);
    if (!response.ok) {
      throw new Error('俳人データの取得に失敗しました');
    }
    const data = (await response.json()) as Poet[];
    return data;
  } catch (error) {
    console.error('俳人データの取得中にエラーが発生しました:', error);
    return [];
  }
}

export async function getAllLocations(): Promise<Location[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) {
      throw new Error('場所データの取得に失敗しました');
    }
    const data = (await response.json()) as Location[];
    return data;
  } catch (error) {
    console.error('場所データの取得中にエラーが発生しました:', error);
    return [];
  }
}

export async function getAllSources(): Promise<Source[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sources`);
    if (!response.ok) {
      throw new Error('出典データの取得に失敗しました');
    }
    const data = (await response.json()) as Source[];
    return data;
  } catch (error) {
    console.error('出典データの取得中にエラーが発生しました:', error);
    return [];
  }
}

// export async function getAllNews(): Promise<News[]> {
//   try {
//     const response = await fetch(`${API_BASE_URL}/news`);
//     if (!response.ok) {
//       throw new Error('お知らせデータの取得に失敗しました');
//     }
//     const data = (await response.json()) as News[];
//     return data;
//   } catch (error) {
//     console.error('お知らせデータの取得中にエラーが発生しました:', error);
//     return [];
//   }
// }

export async function getHaikuMonumentsByCoordinates(
  lat: number,
  lon: number,
  radius: number
): Promise<HaikuMonument[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/haiku-monuments?lat=${lat}&lon=${lon}&radius=${radius}`
    );
    if (!response.ok) {
      throw new Error('座標周辺の句碑データの取得に失敗しました');
    }
    const data = (await response.json()) as HaikuMonumentsByCoordinatesResponse;
    return data.haiku_monuments || [];
  } catch (error) {
    console.error('座標周辺の句碑データ取得エラー:', error);
    return [];
  }
}
