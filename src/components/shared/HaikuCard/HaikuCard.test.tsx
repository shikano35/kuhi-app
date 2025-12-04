import { render, screen } from '@testing-library/react';
import { HaikuCard } from './index';
import { describe, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { MonumentWithRelations } from '@/types/definitions/api';

// 適切なMonumentWithRelations型のモックデータを作成
const mockHaikuMonuments: MonumentWithRelations[] = [
  {
    id: 1,
    canonical_name: '本統寺 句碑（松尾芭蕉）',
    canonical_uri: 'https://api.kuhi.jp/monuments/1',
    monument_type: '句碑',
    monument_type_uri: null,
    material: null,
    material_uri: null,
    is_reliable: false,
    verification_status: 'unverified',
    verified_at: null,
    verified_by: null,
    reliability_note: null,
    created_at: '2025-05-11T16:02:33.000Z',
    updated_at: '2025-05-11T16:02:33.000Z',
    original_established_date: null,
    hu_time_normalized: null,
    interval_start: null,
    interval_end: null,
    uncertainty_note: null,
    inscriptions: [
      {
        id: 1,
        side: 'front',
        original_text: '冬牡丹千鳥よ雪のほととぎす',
        transliteration: null,
        reading: null,
        language: 'ja',
        notes:
          'この句は、「野ざらし紀行」の旅の折、貞亨元年の晩秋に大垣の俳人木因と共に本統寺第三世大谷琢恵（俳号古益）に招かれた際、一夜を過ごして詠んだといわれている',
        poems: [
          {
            id: 1,
            text: '冬牡丹千鳥よ雪のほととぎす',
            normalized_text: '冬牡丹千鳥よ雪のほととぎす',
            text_hash: '4c5f9260',
            kigo: '冬牡丹,千鳥,雪,ほととぎす',
            season: '冬',
            created_at: '2025-05-11T16:02:33.000Z',
            updated_at: '2025-05-11T16:02:33.000Z',
          },
        ],
      },
    ],
    poets: [
      {
        id: 1,
        name: '松尾芭蕉',
        name_kana: null,
        biography: '日本最高の俳諧師',
        birth_year: null,
        death_year: null,
        link_url: 'https://ja.wikipedia.org/wiki/松尾芭蕉',
        image_url: null,
        created_at: '2025-05-11T15:56:40.000Z',
        updated_at: '2025-05-11T15:56:40.000Z',
      },
    ],
    locations: [
      {
        id: 1,
        imi_pref_code: null,
        region: '東海',
        prefecture: '三重県',
        municipality: '桑名市',
        address: '桑名市北寺町47',
        place_name: '本統寺',
        latitude: 35.065502,
        longitude: 136.692193,
        geohash: null,
        geom_geojson: null,
        accuracy_m: null,
        created_at: '2025-08-25T18:05:44.000Z',
        updated_at: '2025-08-25T18:05:44.000Z',
      },
    ],
    media: [
      {
        id: 125,
        media_type: 'photo',
        url: 'https://example.com/image1.jpg',
        iiif_manifest_url: null,
        captured_at: null,
        photographer: null,
        license: null,
      },
    ],
    events: [],
    sources: [],
  },
];

// api-hooksのモック
vi.mock('@/lib/api-hooks', () => ({
  useUserFavorites: () => ({ data: { favorites: [] }, isLoading: false }),
  useAddFavorite: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useRemoveFavorite: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img alt={alt} data-testid="next-image" src={src} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a data-testid="next-link" href={href}>
      {children}
    </a>
  ),
}));

describe('HaikuCard', () => {
  const testMonument = mockHaikuMonuments[0];
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          {component}
        </QueryClientProvider>
      </SessionProvider>
    );
  };

  test('句碑情報を正しく表示すること', () => {
    renderWithProvider(<HaikuCard monument={testMonument} />);

    // 俳句が表示されることを確認
    expect(
      screen.getByText(testMonument.inscriptions[0].original_text)
    ).toBeInTheDocument();

    // 俳人名が表示されることを確認
    expect(screen.getByText(testMonument.poets[0].name)).toBeInTheDocument();

    // 場所情報が表示されることを確認
    const location = testMonument.locations[0];
    expect(
      screen.getByText(`${location.prefecture} ${location.municipality}`)
    ).toBeInTheDocument();

    // 画像が正しく表示されることを確認
    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('src', testMonument.media[0].url);

    // リンクが正しいURLを指していることを確認
    const link = screen.getByTestId('next-link');
    expect(link).toHaveAttribute('href', `/monument/${testMonument.id}`);
  });

  test('写真URLがない場合はプレースホルダー画像を使用すること', () => {
    const monumentWithoutPhoto: MonumentWithRelations = {
      ...testMonument,
      media: [],
    };

    renderWithProvider(<HaikuCard monument={monumentWithoutPhoto} />);

    const placeholderText = screen.getByText('写真はありません');
    expect(placeholderText).toBeInTheDocument();
  });

  test('長い俳句は省略されて表示されること', () => {
    const longInscriptionMonument: MonumentWithRelations = {
      ...testMonument,
      inscriptions: [
        {
          id: 1,
          side: 'front',
          original_text:
            '古池や蛙飛び込む水の音春の海終日のたりのたりかな閑さや岩にしみ入る蝉の声これは非常に長い俳句の例です',
          transliteration: null,
          reading: null,
          language: 'ja',
          notes: null,
          poems: [],
        },
      ],
    };

    renderWithProvider(<HaikuCard monument={longInscriptionMonument} />);

    // 省略されたテキストが含まれているか確認
    const displayedText =
      screen.getByText(/古池や蛙飛び込む水の音春の海終日のたり/);
    expect(displayedText).toBeInTheDocument();
    expect(displayedText).toHaveTextContent(/\.\.\.$/); // 省略記号で終わることを確認
  });
});
