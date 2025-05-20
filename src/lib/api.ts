import {
  HaikuMonument,
  HaikuMonumentResponse,
  Location,
  Poet,
  Source,
} from '@/types/haiku';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_KUHI_API_URL || 'https://api.kuhiapi.com';

/**
 * 全ての句碑データを取得
 */
export async function getAllHaikuMonuments(): Promise<HaikuMonument[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/haiku-monuments`);

    if (!response.ok) {
      throw new Error('句碑データの取得に失敗しました');
    }

    const data = await response.json();
    return data.haiku_monuments || [];
  } catch (error) {
    console.error('句碑データ取得エラー:', error);
    return [];
  }
}

/**
 * 特定の地域の句碑を取得
 */
export async function getHaikuMonumentsByRegion(
  region: string
): Promise<HaikuMonument[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/haiku-monuments`);

    if (!response.ok) {
      throw new Error('句碑データの取得に失敗しました');
    }

    const data = await response.json();
    const monuments = data.haiku_monuments || [];

    // クライアントサイドでフィルタリング
    return monuments.filter(
      (monument: HaikuMonument) => monument.locations[0]?.region === region
    );
  } catch (error) {
    console.error('句碑データ取得エラー:', error);
    return [];
  }
}

/**
 * 特定の俳人の句碑を取得
 */
export async function getHaikuMonumentsByPoet(
  poetId: number
): Promise<HaikuMonument[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/haiku-monuments`);

    if (!response.ok) {
      throw new Error('句碑データの取得に失敗しました');
    }

    const data = await response.json();
    const monuments = data.haiku_monuments || [];

    // クライアントサイドでフィルタリング
    return monuments.filter((monument: HaikuMonument) =>
      monument.poets.some((poet) => poet.id === poetId)
    );
  } catch (error) {
    console.error('句碑データ取得エラー:', error);
    return [];
  }
}

/**
 * 全ての俳人データを取得
 */
export async function getAllPoets(): Promise<Poet[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/poets`);
    if (!response.ok) {
      throw new Error('俳人データの取得に失敗しました');
    }
    const data = (await response.json()) as Poet[];
    return data;
  } catch (error) {
    console.error('俳人データ取得エラー:', error);
    return [];
  }
}

/**
 * 全ての場所データを取得
 */
export async function getAllLocations(): Promise<Location[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) {
      throw new Error('場所データの取得に失敗しました');
    }
    const data = (await response.json()) as Location[];
    return data;
  } catch (error) {
    console.error('場所データ取得エラー:', error);
    return [];
  }
}

/**
 * 全ての出典データを取得
 */
export async function getAllSources(): Promise<Source[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sources`);
    if (!response.ok) {
      throw new Error('出典データの取得に失敗しました');
    }
    const data = (await response.json()) as Source[];
    return data;
  } catch (error) {
    console.error('出典データ取得エラー:', error);
    return [];
  }
}

/**
 * 座標を中心とした半径内の句碑を取得
 */
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
    const data = (await response.json()) as HaikuMonumentResponse;
    return data.haiku_monuments;
  } catch (error) {
    console.error('座標周辺の句碑データ取得エラー:', error);
    return [];
  }
}

// 句碑IDによる詳細情報の取得
export async function getHaikuMonumentById(
  id: number
): Promise<HaikuMonument | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/haiku-monuments`);

    if (!response.ok) {
      throw new Error('句碑データの取得に失敗しました');
    }

    const data = await response.json();
    const monuments = data.haiku_monuments || [];

    // IDで検索
    return (
      monuments.find((monument: HaikuMonument) => monument.id === id) || null
    );
  } catch (error) {
    console.error('句碑データ取得エラー:', error);
    return null;
  }
}
