import { http, HttpResponse, delay } from 'msw';
import { apiHandlers } from './api-handlers';

const API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhi.jp';

export const handlers = [
  ...apiHandlers,

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
