/**
 * MSW サーバーサイド初期化
 * 開発環境でのみ実行される
 */

// 開発環境でのみMSWサーバーを初期化
if (process.env.NODE_ENV === 'development' && typeof window === 'undefined') {
  const useMsw = process.env.NEXT_PUBLIC_USE_MSW === 'true';

  if (useMsw) {
    // 動的にMSWサーバーをインポート
    import('../mocks/server')
      .then(() => {
        console.log('[MSW Init] サーバーモックが初期化されました');
      })
      .catch((error) => {
        console.warn('[MSW Init] サーバーモック初期化に失敗:', error);
      });
  }
}
