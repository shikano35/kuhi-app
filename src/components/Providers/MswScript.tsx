'use client';

import { useEffect } from 'react';

let isMswStarted = false;

export function MswScript() {
  useEffect(() => {
    // MSWの有効/無効を制御
    const useMsw = process.env.NEXT_PUBLIC_USE_MSW === 'true';

    if (process.env.NODE_ENV === 'development' && useMsw && !isMswStarted) {
      isMswStarted = true;
      import('@/mocks/browser')
        .then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }))
        .then(() => {
          console.log('[MSW] モックサーバーが起動しました');
        })
        .catch((error) => {
          isMswStarted = false;
          console.error('[MSW] モックサーバーの起動に失敗しました:', error);
        });
    } else if (process.env.NODE_ENV === 'development' && !useMsw) {
      console.log('[MSW] モックサーバーは無効です。実際のAPIを使用します。');
    }
  }, []);

  return null;
}
