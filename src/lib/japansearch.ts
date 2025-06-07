'use server';

import { cache } from 'react';
import {
  type JapanSearchItem,
  type JapanSearchResponse,
  type SearchParams,
  normalizeJapanSearchItem,
} from './japansearch-types';

const JAPANSEARCH_BASE_URL = 'https://jpsearch.go.jp/api';

/**
 * ジャパンサーチAPIを直接呼び出し
 */
export const searchJapanSearchItems = cache(
  async (params: SearchParams): Promise<JapanSearchResponse> => {
    try {
      const url = new URL(`${JAPANSEARCH_BASE_URL}/item/search/jps-cross`);

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });

      const response = await fetch(url.toString(), {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Kuhi-App/1.0',
        },
        next: {
          revalidate: 3600,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Japan Search API エラー: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      const normalizedItems =
        data.list?.map((item: JapanSearchItem & Record<string, unknown>) =>
          normalizeJapanSearchItem(item)
        ) || [];

      return {
        list: normalizedItems,
        hit: data.hit || 0,
      };
    } catch (error) {
      console.error('ジャパンサーチAPI 検索エラー:', error);
      return {
        list: [],
        hit: 0,
      };
    }
  }
);

/**
 * 俳人名で関連資料を検索
 */
export const searchRelatedMaterials = cache(
  async (
    poetName: string,
    size: number = 60,
    page: number = 1
  ): Promise<JapanSearchItem[]> => {
    try {
      const from = (page - 1) * size;

      const searchTerms = [
        poetName,
        `${poetName} 俳句`,
        `${poetName} 句碑`,
        `${poetName} 文学`,
      ];

      const allResults: JapanSearchItem[] = [];

      const promises = searchTerms.map((term) =>
        searchJapanSearchItems({
          keyword: term,
          size: Math.ceil(size / searchTerms.length),
          from: Math.floor(from / searchTerms.length),
          'f-contents': 'image',
        })
      );

      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        allResults.push(...response.list);
      });

      const uniqueResults = allResults.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );

      return uniqueResults.slice(0, size);
    } catch (error) {
      console.error('関連資料検索エラー:', error);
      return [];
    }
  }
);

/**
 * テーマ別の資料を検索
 */
export const searchByTheme = cache(
  async (
    theme: 'season' | 'region' | 'poet' | 'era',
    query: string,
    size: number = 60,
    page: number = 1
  ): Promise<JapanSearchItem[]> => {
    try {
      const from = (page - 1) * size;
      let searchKeywords: string[] = [];

      switch (theme) {
        case 'season':
          searchKeywords = [
            `${query}`,
            `${query} 俳句`,
            `${query} 季語`,
            `${query} 詩歌`,
            `${query} 書画`,
          ];
          break;
        case 'region':
          searchKeywords = [
            `${query}`,
            `${query} 俳句`,
            `${query} 文学`,
            `${query} 郷土`,
            `${query} 風景`,
          ];
          break;
        case 'poet':
          searchKeywords = [
            `${query}`,
            `${query} 俳句`,
            `${query} 文学`,
            `${query} 作品`,
          ];
          break;
        case 'era':
          searchKeywords = [
            `${query}`,
            `${query} 俳句`,
            `${query} 文学`,
            `${query} 時代`,
            `${query} 文化`,
          ];
          break;
      }

      const promises = searchKeywords.map((keyword) => {
        return searchJapanSearchItems({
          keyword,
          size: Math.ceil(size / searchKeywords.length),
          from: Math.floor(from / searchKeywords.length),
        });
      });

      const responses = await Promise.all(promises);
      const allResults: JapanSearchItem[] = [];

      responses.forEach((response) => {
        allResults.push(...response.list);
      });

      const uniqueResults = allResults.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );

      const finalResults = uniqueResults.slice(0, size);

      return finalResults;
    } catch (error) {
      console.error(`テーマ別検索エラー (${theme}):`, error);
      return [];
    }
  }
);

/**
 * 地域で関連資料を検索
 */
export const searchByRegion = cache(
  async (
    region: string,
    size: number = 60,
    page: number = 1
  ): Promise<JapanSearchItem[]> => {
    return searchByTheme('region', region, size, page);
  }
);

/**
 * 季節で関連資料を検索
 */
export const searchBySeason = cache(
  async (
    season: string,
    size: number = 60,
    page: number = 1
  ): Promise<JapanSearchItem[]> => {
    return searchByTheme('season', season, size, page);
  }
);

/**
 * 年代で関連資料を検索
 */
export const searchByEra = cache(
  async (
    era: string,
    size: number = 60,
    page: number = 1
  ): Promise<JapanSearchItem[]> => {
    return searchByTheme('era', era, size, page);
  }
);

/**
 * 画像検索機能
 */
export const searchImages = cache(
  async (
    keyword: string,
    size: number = 60,
    page: number = 1
  ): Promise<JapanSearchItem[]> => {
    try {
      const from = (page - 1) * size;

      const response = await searchJapanSearchItems({
        keyword,
        size,
        from,
        'f-contents': 'image',
      });

      return response.list.filter((item) => item.common.thumbnailUrl);
    } catch (error) {
      console.error('画像検索エラー:', error);
      return [];
    }
  }
);

/**
 * 個別アイテムの詳細を取得
 */
export const getItemDetail = cache(
  async (itemId: string): Promise<JapanSearchItem | null> => {
    try {
      const decodedId = decodeURIComponent(itemId);

      try {
        const directUrl = `${JAPANSEARCH_BASE_URL}/item/${decodedId}`;
        const directResponse = await fetch(directUrl, {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Kuhi-App/1.0',
          },
          next: {
            revalidate: 3600,
          },
        });

        if (directResponse.ok) {
          const directData = await directResponse.json();
          if (directData && directData.id === decodedId) {
            return normalizeJapanSearchItem(
              directData as JapanSearchItem & Record<string, unknown>
            );
          }
        }
      } catch (error) {
        console.error('直接API取得エラー:', error);
      }

      try {
        const response = await searchJapanSearchItems({
          keyword: `id:"${decodedId}"`,
          size: 50,
          from: 0,
        });

        if (response.list && response.list.length > 0) {
          const exactMatch = response.list.find(
            (item: JapanSearchItem) => item.id === decodedId
          );
          if (exactMatch) {
            return exactMatch;
          }
        }
      } catch (error) {
        console.error('ID完全一致検索エラー:', error);
      }

      if (decodedId.includes('-')) {
        try {
          const prefix = decodedId.split('-')[0];
          const response = await searchJapanSearchItems({
            keyword: prefix,
            size: 200,
            from: 0,
          });

          if (response.list && response.list.length > 0) {
            const exactMatch = response.list.find(
              (item: JapanSearchItem) => item.id === decodedId
            );
            if (exactMatch) {
              return exactMatch;
            }
          }
        } catch (error) {
          console.error('プレフィックス検索エラー:', error);
        }
      }

      return null;
    } catch (error) {
      console.error('詳細取得エラー:', error);
      return null;
    }
  }
);

/**
 * 俳人名で関連画像を検索
 */
export const searchRelatedImages = cache(
  async (
    poetName: string,
    size: number = 60,
    page: number = 1
  ): Promise<JapanSearchItem[]> => {
    try {
      const from = (page - 1) * size;

      const searchTerms = [
        poetName,
        `${poetName} 俳句`,
        `${poetName} 句碑`,
        `${poetName} 写真`,
      ];

      const allResults: JapanSearchItem[] = [];

      const promises = searchTerms.map((term) =>
        searchJapanSearchItems({
          keyword: term,
          size: Math.ceil(size / searchTerms.length),
          from: Math.floor(from / searchTerms.length),
          'f-contents': 'image',
        })
      );

      const responses = await Promise.all(promises);
      responses.forEach((response) => {
        allResults.push(...response.list);
      });

      const imageResults = allResults.filter((item) => {
        const thumbnailUrl = item.common.thumbnailUrl;
        return (
          thumbnailUrl &&
          ((typeof thumbnailUrl === 'string' &&
            thumbnailUrl.startsWith('http')) ||
            (Array.isArray(thumbnailUrl) &&
              thumbnailUrl.length > 0 &&
              thumbnailUrl[0].startsWith('http')))
        );
      });

      const uniqueResults = imageResults.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
      );

      return uniqueResults.slice(0, size);
    } catch (error) {
      console.error('関連画像検索エラー:', error);
      return [];
    }
  }
);

export type {
  JapanSearchItem,
  JapanSearchResponse,
  SearchParams,
} from './japansearch-types';
