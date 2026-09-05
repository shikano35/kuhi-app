import { beforeEach, describe, expect, test, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { getListMonumentsPage } from '@/lib/server-monument-search';
import { GET } from '@/app/api/kuhi/monuments/search/route';
import { getMonuments, searchMonuments } from '@/lib/kuhi-api';
import type {
  MonumentWithRelations,
  MonumentsQueryParams,
} from '@/types/definitions/api';
import { mockHaikuMonuments } from './monument-fixture';

const { cache } = vi.hoisted(() => ({
  cache: new Map<string, MonumentWithRelations[]>(),
}));

vi.mock('next/cache', () => ({
  unstable_cache:
    (
      fn: (
        q: string,
        filters: MonumentsQueryParams
      ) => Promise<MonumentWithRelations[]>
    ) =>
    async (q: string, filters: MonumentsQueryParams) => {
      const key = JSON.stringify([q, filters]);
      const cached = cache.get(key);
      if (cached) return cached;
      const result = await fn(q, filters);
      cache.set(key, result);
      return result;
    },
}));
vi.mock('@/lib/kuhi-api', () => ({
  getMonuments: vi.fn(),
  searchMonuments: vi.fn(),
}));

describe('検索結果のページング', () => {
  beforeEach(() => {
    cache.clear();
    vi.clearAllMocks();
  });

  test('SSRの初期60件とAPIの追加ページで検索結果を共有する', async () => {
    const monuments = Array.from({ length: 61 }, (_, id) => ({
      ...mockHaikuMonuments[0],
      id,
    }));
    vi.mocked(searchMonuments).mockResolvedValue(monuments);
    const first = await getListMonumentsPage({
      q: '芭蕉',
      region: '東海',
      prefecture: '三重県',
      poet_id: undefined,
    });
    const response = await GET(
      new NextRequest(
        'http://localhost/api/kuhi/monuments/search?q=芭蕉&prefecture=三重県&region=東海&limit=60&offset=60'
      )
    );
    expect(first).toHaveLength(60);
    expect(await response.json()).toEqual([monuments[60]]);
    expect(searchMonuments).toHaveBeenCalledTimes(1);
  });

  test('検索語と絞り込みが変わった場合は別の検索を実行する', async () => {
    vi.mocked(searchMonuments).mockResolvedValue([]);
    await getListMonumentsPage({ q: '芭蕉', prefecture: '三重県' });
    await getListMonumentsPage({ q: '芭蕉', prefecture: '岐阜県' });
    await getListMonumentsPage({ q: '蕪村', prefecture: '岐阜県' });
    expect(searchMonuments).toHaveBeenCalledTimes(3);
  });

  test('検索語なしは上流APIのページングを利用する', async () => {
    vi.mocked(getMonuments).mockResolvedValue([]);
    await getListMonumentsPage({ offset: 60 });
    expect(getMonuments).toHaveBeenCalledWith({ limit: 60, offset: 60 });
    expect(searchMonuments).not.toHaveBeenCalled();
  });

  test('不正なページ指定では検索を実行しない', async () => {
    const response = await GET(
      new NextRequest(
        'http://localhost/api/kuhi/monuments/search?q=芭蕉&offset=-1'
      )
    );
    expect(response.status).toBe(400);
    expect(searchMonuments).not.toHaveBeenCalled();
  });
});
