/**
 * MSW Node.js サーバー設定
 *
 * テスト環境でのみ使用されるモックサーバー
 */

import { setupServer } from 'msw/node';
import { apiHandlers } from './api-handlers';

export const server = setupServer(...apiHandlers);
