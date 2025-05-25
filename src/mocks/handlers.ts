import { http, HttpResponse, delay } from 'msw';
import {
  mockHaikuMonuments,
  mockPoets,
  mockLocations,
} from './data/haiku-monuments';

const API_BASE_URL = process.env.KUHI_API_URL || 'https://api.kuhiapi.com';

export const handlers = [
  // 句碑一覧の取得
  http.get(`${API_BASE_URL}/haiku-monuments`, async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);

    // クエリパラメータの取得
    const region = url.searchParams.get('region');
    const prefecture = url.searchParams.get('prefecture');
    const poet_id = url.searchParams.get('poet_id');
    const search = url.searchParams.get('search');

    let filteredMonuments = [...mockHaikuMonuments];

    // 地域でフィルタリング
    if (region) {
      filteredMonuments = filteredMonuments.filter(
        (monument) => monument.locations[0]?.region === region
      );
    }

    // 都道府県でフィルタリング
    if (prefecture) {
      filteredMonuments = filteredMonuments.filter(
        (monument) => monument.locations[0]?.prefecture === prefecture
      );
    }

    // 俳人IDでフィルタリング
    if (poet_id && !isNaN(Number(poet_id))) {
      filteredMonuments = filteredMonuments.filter((monument) =>
        monument.poets.some((poet) => poet.id === Number(poet_id))
      );
    }

    // 検索ワードでフィルタリング
    if (search) {
      const searchLower = search.toLowerCase();
      filteredMonuments = filteredMonuments.filter(
        (monument) =>
          monument.inscription.toLowerCase().includes(searchLower) ||
          (monument.commentary &&
            monument.commentary.toLowerCase().includes(searchLower)) ||
          monument.poets.some((poet) =>
            poet.name.toLowerCase().includes(searchLower)
          ) ||
          monument.locations.some((location) => {
            if (!location.place_name) return false;

            return (
              location.place_name.toLowerCase().includes(searchLower) ||
              (location.prefecture &&
                location.prefecture.toLowerCase().includes(searchLower)) ||
              (location.municipality &&
                location.municipality.toLowerCase().includes(searchLower))
            );
          })
      );
    }

    return HttpResponse.json({
      haiku_monuments: filteredMonuments,
    });
  }),

  // 句碑詳細の取得
  http.get(`${API_BASE_URL}/haiku-monuments/:id`, async ({ params }) => {
    await delay(300);
    const { id } = params;
    const monument = mockHaikuMonuments.find(
      (monument) => monument.id === Number(id)
    );

    if (!monument) {
      return new HttpResponse(
        JSON.stringify({ error: '句碑が見つかりません' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json({
      haiku_monument: monument,
    });
  }),

  // 俳人一覧の取得
  http.get(`${API_BASE_URL}/poets`, async () => {
    await delay(300);
    const poets = Object.values(mockPoets);
    return HttpResponse.json(poets);
  }),

  // 俳人詳細の取得
  http.get(`${API_BASE_URL}/poets/:id`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const poet = mockPoets[id as string];

    if (!poet) {
      return new HttpResponse(
        JSON.stringify({ error: '俳人が見つかりません' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json(poet);
  }),

  // 俳人が詠んだ句碑一覧の取得
  http.get(`${API_BASE_URL}/poets/:id/haiku-monuments`, async ({ params }) => {
    await delay(400);
    const { id } = params;
    const poetId = Number(id);
    const monuments = mockHaikuMonuments.filter((monument) =>
      monument.poets.some((poet) => poet.id === poetId)
    );

    return HttpResponse.json(monuments);
  }),

  // 場所一覧の取得
  http.get(`${API_BASE_URL}/locations`, async () => {
    await delay(300);
    const locations = Object.values(mockLocations);
    return HttpResponse.json(locations);
  }),

  // 場所詳細の取得
  http.get(`${API_BASE_URL}/locations/:id`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const location = mockLocations[id as string];

    if (!location) {
      return new HttpResponse(
        JSON.stringify({ error: '場所が見つかりません' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return HttpResponse.json(location);
  }),

  // 場所に関連する句碑一覧の取得
  http.get(
    `${API_BASE_URL}/locations/:id/haiku-monuments`,
    async ({ params }) => {
      await delay(400);
      const { id } = params;
      const locationId = Number(id);
      const monuments = mockHaikuMonuments.filter((monument) =>
        monument.locations.some((location) => location.id === locationId)
      );

      return HttpResponse.json(monuments);
    }
  ),
];
