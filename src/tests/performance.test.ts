import { performance } from 'perf_hooks';
import { describe, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import {
  getAllHaikuMonuments,
  getHaikuMonumentById,
  getAllPoets,
} from '@/lib/api';
import { mockHaikuMonuments } from '@/mocks/data/haiku-monuments';

// MSWサーバーのセットアップ
const server = setupServer(
  // 句碑一覧のエンドポイントをモック
  http.get('https://api.kuhiapi.com/haiku-monuments', () => {
    return HttpResponse.json({
      haiku_monuments: mockHaikuMonuments,
    });
  }),

  // 句碑詳細のエンドポイントをモック
  http.get('https://api.kuhiapi.com/haiku-monuments/:id', ({ params }) => {
    const { id } = params;
    const monument = mockHaikuMonuments.find((m) => m.id === Number(id));

    if (!monument) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({
      haiku_monument: monument,
    });
  }),

  // 俳人一覧のエンドポイントをモック
  http.get('https://api.kuhi.jp/poets', () => {
    const poets = mockHaikuMonuments
      .flatMap((monument) => monument.poets)
      .filter(
        (poet, index, self) => index === self.findIndex((p) => p.id === poet.id)
      );

    return HttpResponse.json(poets);
  })
);

describe('API関数のパフォーマンステスト', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());

  test('getAllHaikuMonumentsは許容される時間内に実行されること', async () => {
    const startTime = performance.now();
    await getAllHaikuMonuments();
    const endTime = performance.now();

    const executionTime = endTime - startTime;

    // 処理時間が500ms未満であることを期待（閾値は調整可能）
    expect(executionTime).toBeLessThan(500);
    console.log(`getAllHaikuMonuments 実行時間: ${executionTime.toFixed(2)}ms`);
  });

  test('getHaikuMonumentByIdは許容される時間内に実行されること', async () => {
    const startTime = performance.now();
    await getHaikuMonumentById(1);
    const endTime = performance.now();

    const executionTime = endTime - startTime;

    // 処理時間が300ms未満であることを期待（閾値は調整可能）
    expect(executionTime).toBeLessThan(300);
    console.log(`getHaikuMonumentById 実行時間: ${executionTime.toFixed(2)}ms`);
  });

  test('getAllPoetsは許容される時間内に実行されること', async () => {
    const startTime = performance.now();
    await getAllPoets();
    const endTime = performance.now();

    const executionTime = endTime - startTime;

    // 処理時間が300ms未満であることを期待（閾値は調整可能）
    expect(executionTime).toBeLessThan(300);
    console.log(`getAllPoets 実行時間: ${executionTime.toFixed(2)}ms`);
  });

  test('複数回のAPI呼び出しでも安定した応答時間を維持すること', async () => {
    const iterations = 5;
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now();
      await getAllHaikuMonuments();
      const endTime = performance.now();
      times.push(endTime - startTime);
    }

    // 最大実行時間と最小実行時間の差が大きくないことを確認
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);
    const timeDifference = maxTime - minTime;

    // 最大と最小の差が200ms未満であることを期待（閾値は調整可能）
    expect(timeDifference).toBeLessThan(200);

    // 平均実行時間を計算
    const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    console.log(
      `getAllHaikuMonuments 平均実行時間 (${iterations}回): ${avgTime.toFixed(2)}ms`
    );
  });
});
