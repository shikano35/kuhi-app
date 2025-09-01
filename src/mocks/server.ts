/**
 * MSW Node.js サーバー設定
 */

import { setupServer } from 'msw/node';
import { apiHandlers } from './api-handlers';

export const server = setupServer(...apiHandlers);

// 環境変数でMSWの有効/無効を制御
const useMsw = process.env.NEXT_PUBLIC_USE_MSW === 'true';

// 開発環境でのサーバー起動
if (process.env.NODE_ENV === 'development' && useMsw) {
  server.listen({
    onUnhandledRequest: 'bypass',
  });

  // リクエストリスナーを追加
  server.events.on('request:start', ({ request }) => {
    console.log('[MSW] リクエスト開始:', request.method, request.url);
  });

  server.events.on('request:match', ({ request }) => {
    console.log('[MSW] リクエストマッチ:', request.method, request.url);
  });

  server.events.on('request:unhandled', ({ request }) => {
    console.log('[MSW] 未処理リクエスト:', request.method, request.url);
  });

  console.log('[MSW] Node.jsサーバーモックが起動しました');
} else if (process.env.NODE_ENV === 'development' && !useMsw) {
  console.log('[MSW] Node.jsサーバーモックは無効です。実際のAPIを使用します。');
}
