/**
 * 新しいAPI構造に対応したMSWハンドラー
 */

import { http, HttpResponse, delay } from 'msw';
import { MonumentWithRelations, Poet, Location } from '@/types/definitions/api';
import {
  mockMonuments,
  mockPoets,
  mockLocations,
  mockSources,
  mockInscriptions,
  mockPoemsWithRelations,
} from './data/api-data';

const NEW_API_BASE_URL = 'https://api.kuhi.jp';

export const apiHandlers = [
  // 句碑一覧の取得
  http.get(`${NEW_API_BASE_URL}/monuments`, async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);

    // クエリパラメータの取得
    const region = url.searchParams.get('region');
    const prefecture = url.searchParams.get('prefecture');
    const poet_id = url.searchParams.get('poet_id');
    const q = url.searchParams.get('q');
    const inscription_contains = url.searchParams.get('inscription_contains');
    const bbox = url.searchParams.get('bbox');
    const limit = Number(url.searchParams.get('limit')) || 50;
    const offset = Number(url.searchParams.get('offset')) || 0;

    let filteredMonuments = [...mockMonuments];

    // 地域でフィルタリング
    if (region) {
      filteredMonuments = filteredMonuments.filter((monument) =>
        monument.locations.some(
          (location: Location) => location.region === region
        )
      );
    }

    // 都道府県でフィルタリング
    if (prefecture) {
      filteredMonuments = filteredMonuments.filter((monument) =>
        monument.locations.some(
          (location: Location) => location.prefecture === prefecture
        )
      );
    }

    // 境界ボックスでフィルタリング
    if (bbox) {
      const [minLon, minLat, maxLon, maxLat] = bbox.split(',').map(Number);
      if (minLon && minLat && maxLon && maxLat) {
        filteredMonuments = filteredMonuments.filter((monument) =>
          monument.locations.some((location: Location) => {
            return (
              location.latitude !== null &&
              location.longitude !== null &&
              location.latitude >= minLat &&
              location.latitude <= maxLat &&
              location.longitude >= minLon &&
              location.longitude <= maxLon
            );
          })
        );
      }
    }

    // 俳人IDでフィルタリング
    if (poet_id) {
      const poetIdNum = Number(poet_id);
      filteredMonuments = filteredMonuments.filter((monument) =>
        monument.poets.some((poet: Poet) => poet.id === poetIdNum)
      );
    }

    // 検索クエリでフィルタリング
    if (q) {
      filteredMonuments = filteredMonuments.filter(
        (monument) =>
          monument.canonical_name.includes(q) ||
          monument.inscriptions.some((inscription) =>
            inscription.original_text.includes(q)
          )
      );
    }

    // 碑文内容でフィルタリング
    if (inscription_contains) {
      filteredMonuments = filteredMonuments.filter((monument) =>
        monument.inscriptions.some((inscription) =>
          inscription.original_text.includes(inscription_contains)
        )
      );
    }

    // ページネーション適用
    const paginatedMonuments = filteredMonuments.slice(offset, offset + limit);

    return HttpResponse.json(paginatedMonuments);
  }),

  // 句碑詳細の取得
  http.get(`${NEW_API_BASE_URL}/monuments/:id`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const monument = mockMonuments.find(
      (m: MonumentWithRelations) => m.id === Number(id)
    );

    if (!monument) {
      return new HttpResponse(
        JSON.stringify({ error: '句碑が見つかりません' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json(monument);
  }),

  // 句碑の碑文一覧の取得
  http.get(
    `${NEW_API_BASE_URL}/monuments/:id/inscriptions`,
    async ({ params }) => {
      await delay(300);
      const { id } = params;
      const monumentId = Number(id);
      const monument = mockMonuments.find(
        (m: MonumentWithRelations) => m.id === monumentId
      );

      if (!monument) {
        return new HttpResponse(
          JSON.stringify({ error: '句碑が見つかりません' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return HttpResponse.json(monument.inscriptions);
    }
  ),

  // 句碑のイベント一覧の取得
  http.get(`${NEW_API_BASE_URL}/monuments/:id/events`, async ({ params }) => {
    await delay(300);
    const { id } = params;
    const monumentId = Number(id);
    const monument = mockMonuments.find(
      (m: MonumentWithRelations) => m.id === monumentId
    );

    if (!monument) {
      return new HttpResponse(
        JSON.stringify({ error: '句碑が見つかりません' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json(monument.events);
  }),

  // 句碑のメディア一覧の取得
  http.get(`${NEW_API_BASE_URL}/monuments/:id/media`, async ({ params }) => {
    await delay(300);
    const { id } = params;
    const monumentId = Number(id);
    const monument = mockMonuments.find(
      (m: MonumentWithRelations) => m.id === monumentId
    );

    if (!monument) {
      return new HttpResponse(
        JSON.stringify({ error: '句碑が見つかりません' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json(monument.media);
  }),

  // 碑文一覧の取得
  http.get(`${NEW_API_BASE_URL}/inscriptions`, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const monument_id = url.searchParams.get('monument_id');
    const limit = Number(url.searchParams.get('limit')) || 50;
    const offset = Number(url.searchParams.get('offset')) || 0;

    let filteredInscriptions = [...mockInscriptions];

    if (monument_id) {
      const monumentIdNum = Number(monument_id);
      filteredInscriptions = mockInscriptions.filter(
        (inscription) => inscription.monument_id === monumentIdNum
      );
    }

    const paginatedInscriptions = filteredInscriptions.slice(
      offset,
      offset + limit
    );

    // InscriptionWithMonument 形式で返すため、monument情報を追加
    const enrichedInscriptions = paginatedInscriptions.map((inscription) => {
      const monument = mockMonuments.find(
        (m) => m.id === inscription.monument_id
      );
      return {
        ...inscription,
        monument: monument
          ? {
              id: monument.id,
              canonical_name: monument.canonical_name,
              canonical_uri: monument.canonical_uri,
              monument_type: monument.monument_type,
              monument_type_uri: monument.monument_type_uri,
              material: monument.material,
              material_uri: monument.material_uri,
              created_at: monument.created_at,
              updated_at: monument.updated_at,
            }
          : null,
        source: inscription.source,
      };
    });

    return HttpResponse.json({ inscriptions: enrichedInscriptions });
  }),

  // 碑文詳細の取得
  http.get(`${NEW_API_BASE_URL}/inscriptions/:id`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const inscription = mockInscriptions.find((i) => i.id === Number(id));

    if (!inscription) {
      return new HttpResponse(
        JSON.stringify({ error: '碑文が見つかりません' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // InscriptionWithMonument 形式で返すため、monument情報を追加
    const monument = mockMonuments.find(
      (m) => m.id === inscription.monument_id
    );
    const enrichedInscription = {
      ...inscription,
      monument: monument
        ? {
            id: monument.id,
            canonical_name: monument.canonical_name,
            canonical_uri: monument.canonical_uri,
            monument_type: monument.monument_type,
            monument_type_uri: monument.monument_type_uri,
            material: monument.material,
            material_uri: monument.material_uri,
            created_at: monument.created_at,
            updated_at: monument.updated_at,
          }
        : null,
      source: inscription.source,
    };

    return HttpResponse.json(enrichedInscription);
  }),

  // 俳句一覧の取得
  http.get(`${NEW_API_BASE_URL}/poems`, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const poet_id = url.searchParams.get('poet_id');
    const season = url.searchParams.get('season');
    const search = url.searchParams.get('search');
    const limit = Number(url.searchParams.get('limit')) || 50;
    const offset = Number(url.searchParams.get('offset')) || 0;

    let filteredPoems = [...mockPoemsWithRelations];

    if (poet_id) {
      const poetIdNum = Number(poet_id);
      filteredPoems = filteredPoems.filter((poem) =>
        poem.attributions.some((attr) => attr.poet_id === poetIdNum)
      );
    }

    if (season) {
      filteredPoems = filteredPoems.filter((poem) => poem.season === season);
    }

    if (search) {
      filteredPoems = filteredPoems.filter(
        (poem) => poem.text.includes(search) || poem.kigo?.includes(search)
      );
    }

    const paginatedPoems = filteredPoems.slice(offset, offset + limit);
    return HttpResponse.json({ poems: paginatedPoems });
  }),

  // 俳句詳細の取得
  http.get(`${NEW_API_BASE_URL}/poems/:id`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const poem = mockPoemsWithRelations.find((p) => p.id === Number(id));

    if (!poem) {
      return new HttpResponse(
        JSON.stringify({ error: '俳句が見つかりません' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json(poem);
  }),

  // 俳人一覧の取得
  http.get(`${NEW_API_BASE_URL}/poets`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const name_contains = url.searchParams.get('name_contains');
    const limit = Number(url.searchParams.get('limit')) || 50;
    const offset = Number(url.searchParams.get('offset')) || 0;

    let filteredPoets = [...mockPoets];

    if (search) {
      filteredPoets = filteredPoets.filter(
        (poet: Poet) =>
          poet.name.includes(search) || poet.biography?.includes(search)
      );
    }

    if (name_contains) {
      filteredPoets = filteredPoets.filter((poet) =>
        poet.name.includes(name_contains)
      );
    }

    const paginatedPoets = filteredPoets.slice(offset, offset + limit);
    return HttpResponse.json(paginatedPoets);
  }),

  // 俳人詳細の取得
  http.get(`${NEW_API_BASE_URL}/poets/:id`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const poet = mockPoets.find((p: Poet) => p.id === Number(id));

    if (!poet) {
      return new HttpResponse(
        JSON.stringify({ error: '俳人が見つかりません' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json(poet);
  }),

  // 俳人に関連する句碑一覧の取得
  http.get(`${NEW_API_BASE_URL}/poets/:id/monuments`, async ({ params }) => {
    await delay(400);
    const { id } = params;
    const poetId = Number(id);
    const monuments = mockMonuments.filter((monument) =>
      monument.poets.some((poet: Poet) => poet.id === poetId)
    );

    return HttpResponse.json(monuments);
  }),

  // 設置場所一覧の取得
  http.get(`${NEW_API_BASE_URL}/locations`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const prefecture = url.searchParams.get('prefecture');
    const region = url.searchParams.get('region');
    const limit = Number(url.searchParams.get('limit')) || 50;
    const offset = Number(url.searchParams.get('offset')) || 0;

    let filteredLocations = [...mockLocations];

    if (prefecture) {
      filteredLocations = filteredLocations.filter(
        (location: Location) => location.prefecture === prefecture
      );
    }

    if (region) {
      filteredLocations = filteredLocations.filter(
        (location: Location) => location.region === region
      );
    }

    const paginatedLocations = filteredLocations.slice(offset, offset + limit);
    return HttpResponse.json(paginatedLocations);
  }),

  // 設置場所詳細の取得
  http.get(`${NEW_API_BASE_URL}/locations/:id`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const location = mockLocations.find((l) => l.id === Number(id));

    if (!location) {
      return new HttpResponse(
        JSON.stringify({ error: '設置場所が見つかりません' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json(location);
  }),

  // 設置場所に関連する句碑一覧の取得
  http.get(
    `${NEW_API_BASE_URL}/locations/:id/monuments`,
    async ({ params }) => {
      await delay(400);
      const { id } = params;
      const locationId = Number(id);
      const monuments = mockMonuments.filter((monument) =>
        monument.locations.some(
          (location: Location) => location.id === locationId
        )
      );

      return HttpResponse.json(monuments);
    }
  ),

  // 出典一覧の取得
  http.get(`${NEW_API_BASE_URL}/sources`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const title_contains = url.searchParams.get('title_contains');
    const limit = Number(url.searchParams.get('limit')) || 50;
    const offset = Number(url.searchParams.get('offset')) || 0;

    let filteredSources = [...mockSources];

    if (search) {
      filteredSources = filteredSources.filter(
        (source) =>
          source.title?.includes(search) || source.author?.includes(search)
      );
    }

    if (title_contains) {
      filteredSources = filteredSources.filter((source) =>
        source.title?.includes(title_contains)
      );
    }

    const paginatedSources = filteredSources.slice(offset, offset + limit);
    return HttpResponse.json(paginatedSources);
  }),

  // 出典詳細の取得
  http.get(`${NEW_API_BASE_URL}/sources/:id`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const source = mockSources.find((s) => s.id === Number(id));

    if (!source) {
      return new HttpResponse(
        JSON.stringify({ error: '出典が見つかりません' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json(source);
  }),

  // 出典に関連する句碑一覧の取得
  http.get(`${NEW_API_BASE_URL}/sources/:id/monuments`, async ({ params }) => {
    await delay(400);
    const { id } = params;
    const sourceId = Number(id);
    const monuments = mockMonuments.filter((monument) =>
      monument.sources.some((source) => source.id === sourceId)
    );

    return HttpResponse.json(monuments);
  }),
];
