import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

if (process.env.NODE_ENV === 'development') {
  worker
    .start({
      onUnhandledRequest: 'bypass',
    })
    .catch(console.error);

  console.log('[MSW] モックサーバーが起動しました');
}
