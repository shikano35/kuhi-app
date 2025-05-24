'use client';

import { useEffect } from 'react';

export function MswScript() {
  useEffect(() => {
    // 開発環境のみで実行する安全なチェック
    if (typeof window === 'undefined') return;

    const enableMocking = async () => {
      try {
        const { worker } = await import('@/mocks/browser');

        await worker
          .start({
            onUnhandledRequest: 'bypass',
          })
          .catch((e) => {
            console.error('MSW worker start failed:', e);
          });

        console.log('[MSW] Successfully initialized');
      } catch (e) {
        console.error('[MSW] Failed to initialize:', e);
      }
    };

    // 非同期関数を呼び出す
    enableMocking();
  }, []);

  return null;
}
