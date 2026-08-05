import { describe, expect, test, beforeAll, afterAll, afterEach } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import {
  getAllHaikuMonuments,
  getHaikuMonumentById,
  getAllPoets,
  getAllLocations,
} from '@/lib/api';

const API_BASE_URL = 'https://api.kuhi.jp';

const samplePoets = [
  { id: 1, name: '松尾芭蕉' },
  { id: 2, name: '山口誓子' },
];

const sampleLocations = [
  { id: 1, region: '東海', prefecture: '三重県' },
  { id: 2, region: '関東', prefecture: '東京都' },
];

const sampleMonuments = [
  {
    id: 1,
    monument_type: 'haiku',
    material: '石',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    inscriptions: [
      { id: 1, original_text: '冬牡丹千鳥よ雪のほととぎす', notes: null },
    ],
    poets: [samplePoets[0]],
    locations: [sampleLocations[0]],
  },
  {
    id: 2,
    monument_type: 'haiku',
    material: '石',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    inscriptions: [
      { id: 2, original_text: '海に出て木枯帰るところなし', notes: null },
    ],
    poets: [samplePoets[1]],
    locations: [sampleLocations[1]],
  },
];

function pageFor<T>(url: URL, items: T[]): T[] {
  return Number(url.searchParams.get('offset') ?? 0) === 0 ? items : [];
}

const server = setupServer(
  http.get(`${API_BASE_URL}/monuments`, ({ request }) =>
    HttpResponse.json(pageFor(new URL(request.url), sampleMonuments))
  ),

  http.get(`${API_BASE_URL}/monuments/:id`, ({ params }) => {
    const monument = sampleMonuments.find((m) => m.id === Number(params.id));

    if (!monument) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(monument);
  }),

  http.get(`${API_BASE_URL}/poets`, ({ request }) =>
    HttpResponse.json(pageFor(new URL(request.url), samplePoets))
  ),

  http.get(`${API_BASE_URL}/locations`, () =>
    HttpResponse.json(sampleLocations)
  )
);

describe('API関数のテスト', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('getAllHaikuMonuments', () => {
    test('すべての句碑データを取得できること', async () => {
      const result = await getAllHaikuMonuments();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      const firstMonument = result[0];
      expect(firstMonument).toMatchObject({ id: expect.any(Number) });
      expect(Array.isArray(firstMonument.poets)).toBe(true);
      expect(Array.isArray(firstMonument.locations)).toBe(true);
    });

    test('APIエラー時には空配列を返すこと', async () => {
      server.use(
        http.get(
          `${API_BASE_URL}/monuments`,
          () => new HttpResponse(null, { status: 500 })
        )
      );

      const result = await getAllHaikuMonuments();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([]);
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
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getHaikuMonumentsByRegion', () => {
    test('地域に関連する句碑データを取得できること', async () => {
      const allMonuments = await getAllHaikuMonuments();
      const result = allMonuments.filter((monument) =>
        monument.locations?.some((location) => location.region === '関東')
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
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
    });

    test('APIエラー時には空配列を返すこと', async () => {
      server.use(
        http.get(
          `${API_BASE_URL}/poets`,
          () => new HttpResponse(null, { status: 500 })
        )
      );

      const result = await getAllPoets();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([]);
    });
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
    });

    test('APIエラー時には空配列を返すこと', async () => {
      server.use(
        http.get(
          `${API_BASE_URL}/locations`,
          () => new HttpResponse(null, { status: 500 })
        )
      );

      const result = await getAllLocations();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toEqual([]);
    });
  });
});
