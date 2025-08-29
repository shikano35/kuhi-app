import { performance } from 'perf_hooks';
import { describe, expect, beforeAll, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import {
  getAllHaikuMonuments,
  getHaikuMonumentById,
  getAllPoets,
} from '@/lib/api';

interface SampleMonument {
  id: number;
  canonical_name: string;
  poets: Array<{ id: number; name: string }>;
  locations: Array<{ id: number; region: string; prefecture: string }>;
}

const sampleMonuments: SampleMonument[] = [
  {
    id: 1,
    canonical_name: '本統寺 句碑（松尾芭蕉）',
    poets: [{ id: 1, name: '松尾芭蕉' }],
    locations: [{ id: 1, region: '東海', prefecture: '三重県' }],
  },
  {
    id: 2,
    canonical_name: '春日神社 句碑（山口誓子）',
    poets: [{ id: 2, name: '山口誓子' }],
    locations: [{ id: 2, region: '東海', prefecture: '三重県' }],
  },
];

// MSWサーバーのセットアップ
const server = setupServer(
  // 句碑一覧のエンドポイントをモック
  http.get('https://api.kuhi.jp/monuments', () => {
    return HttpResponse.json(sampleMonuments);
  }),

  // 句碑詳細のエンドポイントをモック
  http.get('https://api.kuhi.jp/monuments/:id', ({ params }) => {
    const { id } = params;
    const monument = sampleMonuments.find((m) => m.id === Number(id));

    if (!monument) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(monument);
  }),

  // 俳人一覧のエンドポイントをモック
  http.get('https://api.kuhi.jp/poets', () => {
    const poets = sampleMonuments
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

    // 処理時間が600ms未満であることを期待
    expect(executionTime).toBeLessThan(600);
    console.log(`getAllHaikuMonuments 実行時間: ${executionTime.toFixed(2)}ms`);
  });

  test('getHaikuMonumentByIdは許容される時間内に実行されること', async () => {
    const startTime = performance.now();
    await getHaikuMonumentById(1);
    const endTime = performance.now();

    const executionTime = endTime - startTime;

    // 処理時間が250ms未満であることを期待
    expect(executionTime).toBeLessThan(250);
    console.log(`getHaikuMonumentById 実行時間: ${executionTime.toFixed(2)}ms`);
  });

  test('getAllPoetsは許容される時間内に実行されること', async () => {
    const startTime = performance.now();
    await getAllPoets();
    const endTime = performance.now();

    const executionTime = endTime - startTime;

    // 処理時間が350ms未満であることを期待
    expect(executionTime).toBeLessThan(350);
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

    // 最大と最小の差が200ms未満であることを期待
    expect(timeDifference).toBeLessThan(200);

    // 平均実行時間を計算
    const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    console.log(
      `getAllHaikuMonuments 平均実行時間 (${iterations}回): ${avgTime.toFixed(2)}ms`
    );
  });
});
