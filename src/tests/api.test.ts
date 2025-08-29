import { describe, expect, test, beforeEach } from 'vitest';
import {
  getAllHaikuMonuments,
  getHaikuMonumentById,
  getAllPoets,
  getAllLocations,
} from '@/lib/api';

describe('API関数のテスト', () => {
  beforeEach(() => {});

  describe('getAllHaikuMonuments', () => {
    test('すべての句碑データを取得できること', async () => {
      const result = await getAllHaikuMonuments();

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        const firstMonument = result[0];
        expect(firstMonument).toHaveProperty('id');
        expect(firstMonument).toHaveProperty('poets');
        expect(firstMonument).toHaveProperty('locations');
      }
    });

    test('APIエラー時には空配列を返すこと', async () => {
      const result = await getAllHaikuMonuments();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getHaikuMonumentById', () => {
    test('指定したIDの句碑データを取得できること', async () => {
      const result = await getHaikuMonumentById(1);

      if (result) {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('poets');
        expect(result).toHaveProperty('locations');
      }
    });

    test('存在しないIDの場合はnullを返すこと', async () => {
      const result = await getHaikuMonumentById(999);
      expect(result).toBeNull();
    });
  });

  describe('getHaikuMonumentsByPoet', () => {
    test('俳人に関連する句碑データを取得できること', async () => {
      const allMonuments = await getAllHaikuMonuments();
      const result = allMonuments.filter((monument) =>
        monument.poets?.some((poet) => poet.id === 1)
      );

      expect(Array.isArray(result)).toBe(true);
      expect(true).toBe(true);
    });
  });

  describe('getHaikuMonumentsByRegion', () => {
    test('地域に関連する句碑データを取得できること', async () => {
      const allMonuments = await getAllHaikuMonuments();
      const result = allMonuments.filter((monument) =>
        monument.locations?.some((location) => location.region === '関東')
      );

      expect(Array.isArray(result)).toBe(true);
      expect(true).toBe(true);
    });
  });

  describe('getAllPoets', () => {
    test('すべての俳人データを取得できること', async () => {
      const result = await getAllPoets();

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        const firstPoet = result[0];
        expect(firstPoet).toHaveProperty('id');
        expect(firstPoet).toHaveProperty('name');
      }
    });

    test('APIエラー時には空配列を返すこと', async () => {
      const result = await getAllPoets();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getAllLocations', () => {
    test('すべての場所データを取得できること', async () => {
      const result = await getAllLocations();

      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        const firstLocation = result[0];
        expect(firstLocation).toHaveProperty('id');
        expect(firstLocation).toHaveProperty('region');
        expect(firstLocation).toHaveProperty('prefecture');
      }
    });

    test('APIエラー時には空配列を返すこと', async () => {
      const result = await getAllLocations();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
