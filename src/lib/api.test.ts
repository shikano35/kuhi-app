import { describe, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getAllHaikuMonuments,
  getHaikuMonumentById,
  getHaikuMonumentsByPoet,
  getHaikuMonumentsByRegion,
  getAllPoets,
  getAllLocations,
} from './api';
import { mockHaikuMonuments } from '@/mocks/data/haiku-monuments';
import { HaikuMonument, Location, Poet } from '@/types/haiku';

// テスト用のモックデータ
const mockMonument = mockHaikuMonuments[0];
const relatedMonuments = mockHaikuMonuments.filter(
  (monument) => monument.poets[0]?.id === 1
);
const filteredMonuments = mockHaikuMonuments.filter(
  (monument) => monument.locations[0]?.region === '東海'
);
const mockPoets = mockHaikuMonuments
  .map((monument) => monument.poets[0])
  .filter(
    (poet, index, self) =>
      poet && self.findIndex((p) => p && p.id === poet.id) === index
  );
const mockLocations = mockHaikuMonuments.map(
  (monument) => monument.locations[0]
);

type MockResponse<T> = {
  ok: boolean;
  json: () => Promise<T>;
};

type FetchMock = ReturnType<typeof vi.fn>;

describe('API関数のテスト', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAllHaikuMonuments', () => {
    test('すべての句碑データを取得できること', async () => {
      const mockResponse: MockResponse<{ haiku_monuments: HaikuMonument[] }> = {
        ok: true,
        json: async () => ({ haiku_monuments: mockHaikuMonuments }),
      };

      (global.fetch as unknown as FetchMock).mockResolvedValue(mockResponse);

      const result = await getAllHaikuMonuments();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/haiku-monuments')
      );
      expect(result).toEqual(mockHaikuMonuments);
    });

    test('APIエラー時には空配列を返すこと', async () => {
      const mockResponse: Partial<Response> = {
        ok: false,
      };

      (global.fetch as unknown as FetchMock).mockResolvedValue(mockResponse);

      const result = await getAllHaikuMonuments();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('getHaikuMonumentById', () => {
    test('指定したIDの句碑データを取得できること', async () => {
      const mockResponse: MockResponse<{ haiku_monument: HaikuMonument }> = {
        ok: true,
        json: async () => ({ haiku_monument: mockMonument }),
      };

      (global.fetch as unknown as FetchMock).mockResolvedValue(mockResponse);

      const result = await getHaikuMonumentById(1);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/haiku-monuments/1')
      );
      expect(result).toEqual(mockMonument);
    });

    test('存在しないIDの場合はnullを返すこと', async () => {
      const mockResponse: Partial<Response> = {
        ok: false,
      };

      (global.fetch as unknown as FetchMock).mockResolvedValue(mockResponse);

      const result = await getHaikuMonumentById(999);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe('getHaikuMonumentsByPoet', () => {
    test('俳人に関連する句碑データを取得できること', async () => {
      const mockResponse: MockResponse<{ haiku_monuments: HaikuMonument[] }> = {
        ok: true,
        json: async () => ({ haiku_monuments: relatedMonuments }),
      };

      (global.fetch as unknown as FetchMock).mockResolvedValue(mockResponse);

      const result = await getHaikuMonumentsByPoet(1);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/poets/1/haiku-monuments')
      );
      expect(result).toEqual(relatedMonuments);
    });
  });

  describe('getHaikuMonumentsByRegion', () => {
    test('地域に関連する句碑データを取得できること', async () => {
      const mockResponse: MockResponse<{ haiku_monuments: HaikuMonument[] }> = {
        ok: true,
        json: async () => ({ haiku_monuments: filteredMonuments }),
      };

      (global.fetch as unknown as FetchMock).mockResolvedValue(mockResponse);

      const result = await getHaikuMonumentsByRegion('東海');

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('region=%E6%9D%B1%E6%B5%B7')
      );
      expect(result).toEqual(filteredMonuments);
    });
  });

  describe('getAllPoets', () => {
    test('すべての俳人データを取得できること', async () => {
      const mockResponse: MockResponse<Poet[]> = {
        ok: true,
        json: async () => mockPoets,
      };

      (global.fetch as unknown as FetchMock).mockResolvedValue(mockResponse);

      const result = await getAllPoets();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/poets')
      );
      expect(result).toEqual(mockPoets);
    });

    test('APIエラー時には空配列を返すこと', async () => {
      const mockResponse: Partial<Response> = {
        ok: false,
      };

      (global.fetch as unknown as FetchMock).mockResolvedValue(mockResponse);

      const result = await getAllPoets();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('getAllLocations', () => {
    test('すべての場所データを取得できること', async () => {
      const mockResponse: MockResponse<Location[]> = {
        ok: true,
        json: async () => mockLocations,
      };

      (global.fetch as unknown as FetchMock).mockResolvedValue(mockResponse);

      const result = await getAllLocations();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/locations')
      );
      expect(result).toEqual(mockLocations);
    });

    test('APIエラー時には空配列を返すこと', async () => {
      const mockResponse: Partial<Response> = {
        ok: false,
      };

      (global.fetch as unknown as FetchMock).mockResolvedValue(mockResponse);

      const result = await getAllLocations();

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});
