'use client';

import { useEffect } from 'react';

export function MswScript() {
  useEffect(() => {
    // 実際の処理は開発環境かどうかを中で判定
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks/browser')
        .then(({ worker }) => worker.start({ onUnhandledRequest: 'bypass' }))
        .catch(console.error);
      console.log('[MSW] モックサーバーが起動しました');
    }
  }, []);

  return null;
}
