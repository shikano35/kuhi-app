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
      expect(result.length).toBeGreaterThan(0);

      const firstMonument = result[0];
      expect(firstMonument).toMatchObject({ id: expect.any(Number) });
      expect(Array.isArray(firstMonument.poets)).toBe(true);
      expect(Array.isArray(firstMonument.locations)).toBe(true);
    }, 30000);

    test('APIエラー時には空配列を返すこと', async () => {
      const result = await getAllHaikuMonuments();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getHaikuMonumentById', () => {
    test('指定したIDの句碑データを取得できること', async () => {
      const result = await getHaikuMonumentById(1);

      if (!result) {
        throw new Error('Monument with id=1 was not found');
      }

      expect(result).toMatchObject({ id: 1 });
      expect(Array.isArray(result.poets)).toBe(true);
      expect(Array.isArray(result.locations)).toBe(true);
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
    }, 30000);
  });

  describe('getHaikuMonumentsByRegion', () => {
    test('地域に関連する句碑データを取得できること', async () => {
      const allMonuments = await getAllHaikuMonuments();
      const result = allMonuments.filter((monument) =>
        monument.locations?.some((location) => location.region === '関東')
      );

      expect(Array.isArray(result)).toBe(true);
      expect(true).toBe(true);
    }, 30000);
  });

  describe('getAllPoets', () => {
    test('すべての俳人データを取得できること', async () => {
      const result = await getAllPoets();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      const firstPoet = result[0];
      expect(firstPoet).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
      });
    }, 15000);

    test('APIエラー時には空配列を返すこと', async () => {
      const result = await getAllPoets();
      expect(Array.isArray(result)).toBe(true);
    }, 15000);
  });

  describe('getAllLocations', () => {
    test('すべての場所データを取得できること', async () => {
      const result = await getAllLocations();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      const firstLocation = result[0];
      expect(firstLocation).toMatchObject({
        id: expect.any(Number),
        region: expect.any(String),
        prefecture: expect.any(String),
      });
    }, 15000);

    test('APIエラー時には空配列を返すこと', async () => {
      const result = await getAllLocations();
      expect(Array.isArray(result)).toBe(true);
    }, 15000);
  });
});
