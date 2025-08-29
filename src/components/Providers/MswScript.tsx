'use client';

import { useEffect } from 'react';

let isMswStarted = false;

export function MswScript() {
  useEffect(() => {
    // 実際の処理は開発環境かどうかを中で判定
    if (process.env.NODE_ENV === 'development' && !isMswStarted) {
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
    }
  }, []);

  return null;
}
