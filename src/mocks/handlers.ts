import { http, HttpResponse, delay } from 'msw';
import { apiHandlers } from './api-handlers';
import { mockMonuments, mockPoets } from './data/api-data';

const API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhi.jp';

export const handlers = [
  ...apiHandlers,

  http.get(`${API_BASE_URL}/monuments/all`, async () => {
    await delay(500);
    const extendedMonuments = [];
    for (let i = 0; i < 400; i++) {
      const monument = {
        ...mockMonuments[0],
        id: i + 1,
        canonical_name: `テスト句碑${i + 1}（松尾芭蕉）`,
        canonical_uri: `https://api.kuhi.jp/monuments/${i + 1}`,
        locations: [
          {
            id: i + 1,
            imi_pref_code: null,
            region: ['東海', '関東', '関西', '九州', '東北'][i % 5],
            prefecture: ['三重県', '東京都', '大阪府', '福岡県', '宮城県'][
              i % 5
            ],
            municipality: `市区町村${i + 1}`,
            place_name: `テスト場所${i + 1}`,
            latitude: 35.0 + (i % 10) * 0.1,
            longitude: 136.0 + (i % 10) * 0.1,
            geojson: null,
          },
        ],
        events: [
          {
            id: i + 1,
            event_type: 'erected',
            hu_time_normalized: `HT:interval/${1900 + (i % 50)}-01-01/${1900 + (i % 50)}-12-31`,
            interval_start: `${1900 + (i % 50)}-01-01`,
            interval_end: `${1900 + (i % 50)}-12-31`,
            uncertainty_note: null,
            actor: `建立者${i + 1}`,
            source: mockMonuments[0].sources[0],
          },
        ],
      };
      extendedMonuments.push(monument);
    }
    return HttpResponse.json(extendedMonuments);
  }),

  http.get(`${API_BASE_URL}/poets/all`, async () => {
    await delay(300);
    return HttpResponse.json(mockPoets);
  }),

  // ニュース一覧の取得
  http.get(`${API_BASE_URL}/news`, async () => {
    await delay(300);
    const news = [
      {
        id: 1,
        title: 'プラットフォームの大幅アップデートが完了しました',
        content: '句碑データベースを大幅に拡充し、新しい機能を追加しました。',
        date: '2025-01-15',
        author: 'システム管理者',
      },
      {
        id: 2,
        title: '新規句碑情報を100件追加',
        content: '今月は全国各地から100件の新しい句碑情報を追加しました。',
        date: '2025-01-10',
        author: 'データ管理チーム',
      },
    ];
    return HttpResponse.json(news);
  }),

  // 全句碑取得エンドポイント
  http.get('/api/kuhi/monuments/all', async () => {
    await delay(500);
    const extendedMonuments = [];
    for (let i = 0; i < 400; i++) {
      const monument = {
        ...mockMonuments[0],
        id: i + 1,
        canonical_name: `テスト句碑${i + 1}（松尾芭蕉）`,
        canonical_uri: `https://api.kuhi.jp/monuments/${i + 1}`,
        locations: [
          {
            id: i + 1,
            imi_pref_code: null,
            region: ['東海', '関東', '関西', '九州', '東北'][i % 5],
            prefecture: ['三重県', '東京都', '大阪府', '福岡県', '宮城県'][
              i % 5
            ],
            municipality: `市区町村${i + 1}`,
            place_name: `テスト場所${i + 1}`,
            latitude: 35.0 + (i % 10) * 0.1,
            longitude: 136.0 + (i % 10) * 0.1,
            geojson: null,
          },
        ],
        events: [
          {
            id: i + 1,
            event_type: 'erected',
            hu_time_normalized: `HT:interval/${1900 + i * 2}-01-01/${1900 + i * 2}-12-31`,
            interval_start: `${1900 + (i % 50)}-01-01`,
            interval_end: `${1900 + (i % 50)}-12-31`,
            uncertainty_note: null,
            actor: `建立者${i + 1}`,
            source: mockMonuments[0].sources[0],
          },
        ],
      };
      extendedMonuments.push(monument);
    }
    return HttpResponse.json({
      monuments: extendedMonuments,
      total: extendedMonuments.length,
      isPartial: false,
      message: `Mock data for testing (${extendedMonuments.length} total)`,
    });
  }),

  // 全俳人取得エンドポイント
  http.get('/api/kuhi/poets/all', async () => {
    await delay(300);
    return HttpResponse.json(mockPoets);
  }),

  // プロフィール関連のAPIハンドラー
  http.put('/api/profile', async ({ request }) => {
    await delay(200);
    try {
      await request.json();
      return new Response();
    } catch {
      return new Response('プロフィールの更新に失敗しました', { status: 500 });
    }
  }),

  http.post('/api/profile/avatar', async ({ request }) => {
    await delay(1000);
    try {
      await request.formData();
      const imageUrl = '/uploads/avatars/test.jpg';
      return HttpResponse.json({ imageUrl });
    } catch {
      return new Response('画像のアップロードに失敗しました', { status: 500 });
    }
  }),

  http.delete('/api/profile/avatar', async () => {
    await delay(200);
    return new Response();
  }),

  // ユーザー関連のAPIハンドラー
  http.get('/api/user/favorites', async () => {
    await delay(200);
    return HttpResponse.json([]);
  }),

  http.get('/api/user/visits', async () => {
    await delay(200);
    return HttpResponse.json([]);
  }),
];
