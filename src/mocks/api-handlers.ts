/**
 * API用のMSWハンドラー
 * 実際のAPIが利用できない場合のみ使用
 */

import { http, HttpResponse } from 'msw';
import {
  mockMonuments,
  mockPoets,
  mockLocations,
  mockSources,
} from './data/api-data';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_KUHI_API_URL || 'https://api.kuhi.jp';

export const apiHandlers = [
  // 句碑一覧API
  http.get(`${API_BASE_URL}/monuments`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 30;
    const offset = Number(url.searchParams.get('offset')) || 0;

    const paginatedMonuments = mockMonuments.slice(offset, offset + limit);

    return HttpResponse.json(paginatedMonuments);
  }),

  // 俳人一覧API
  http.get(`${API_BASE_URL}/poets`, () => {
    return HttpResponse.json(mockPoets);
  }),

  // 場所一覧API
  http.get(`${API_BASE_URL}/locations`, () => {
    return HttpResponse.json(mockLocations);
  }),

  // 出典一覧API
  http.get(`${API_BASE_URL}/sources`, () => {
    return HttpResponse.json(mockSources);
  }),

  // 個別API
  http.get(`${API_BASE_URL}/monuments/:id`, ({ params }) => {
    const monument = mockMonuments.find((m) => m.id === Number(params.id));
    return monument
      ? HttpResponse.json(monument)
      : new HttpResponse(null, { status: 404 });
  }),

  http.get(`${API_BASE_URL}/poets/:id`, ({ params }) => {
    const poet = mockPoets.find((p) => p.id === Number(params.id));
    return poet
      ? HttpResponse.json(poet)
      : new HttpResponse(null, { status: 404 });
  }),

  http.get(`${API_BASE_URL}/locations/:id`, ({ params }) => {
    const location = mockLocations.find((l) => l.id === Number(params.id));
    return location
      ? HttpResponse.json(location)
      : new HttpResponse(null, { status: 404 });
  }),

  http.get(`${API_BASE_URL}/sources/:id`, ({ params }) => {
    const source = mockSources.find((s) => s.id === Number(params.id));
    return source
      ? HttpResponse.json(source)
      : new HttpResponse(null, { status: 404 });
  }),

  // 俳人の句碑一覧API
  http.get(`${API_BASE_URL}/poets/:id/monuments`, ({ params }) => {
    const poetId = Number(params.id);
    const poetMonuments = mockMonuments.filter(
      (monument) =>
        monument.poets && monument.poets.some((poet) => poet.id === poetId)
    );
    return HttpResponse.json(poetMonuments);
  }),
];
