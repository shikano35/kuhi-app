/**
 * モックデータ
 * 実際のAPIが利用できない場合のみ使用
 */

import {
  MonumentWithRelations,
  Poet,
  Location,
  Source,
} from '@/types/definitions/api';

export const mockPoets: Poet[] = [
  {
    id: 1,
    name: '松尾芭蕉',
    name_kana: 'まつお ばしょう',
    biography: '江戸時代前期の俳諧師。俳聖と呼ばれる。',
    birth_year: 1644,
    death_year: 1694,
    link_url:
      'https://ja.wikipedia.org/wiki/%E6%9D%BE%E5%B0%BE%E8%8A%AD%E8%95%89',
    image_url: null,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  },
];

export const mockLocations: Location[] = [
  {
    id: 1,
    imi_pref_code: '24',
    region: '東海',
    prefecture: '三重県',
    municipality: '桑名市',
    address: '桑名市本町',
    place_name: '本統寺',
    latitude: 35.065502,
    longitude: 136.692193,
    geohash: null,
    geom_geojson: null,
    accuracy_m: null,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  },
];

export const mockSources: Source[] = [
  {
    id: 1,
    citation: 'テストデータ',
    author: 'テスト',
    title: 'テストソース',
    publisher: 'テスト出版',
    source_year: 2024,
    url: null,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
  },
];

export const mockMonuments: MonumentWithRelations[] = [
  {
    id: 1,
    canonical_name: 'テスト句碑（松尾芭蕉）',
    canonical_uri: 'https://api.kuhi.jp/monuments/1',
    monument_type: '句碑',
    monument_type_uri: null,
    material: '石',
    material_uri: null,
    is_reliable: false,
    verification_status: 'unverified',
    verified_at: null,
    verified_by: null,
    reliability_note: null,
    created_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-01-01T00:00:00.000Z',
    original_established_date: null,
    hu_time_normalized: null,
    interval_start: null,
    interval_end: null,
    uncertainty_note: null,
    inscriptions: [
      {
        id: 1,
        side: 'front',
        original_text: '古池や蛙飛び込む水の音',
        transliteration: null,
        reading: null,
        language: 'ja',
        notes: '芭蕉の代表的な句',
        poems: [
          {
            id: 1,
            text: '古池や蛙飛び込む水の音',
            normalized_text: '古池や蛙飛び込む水の音',
            text_hash: 'test123',
            kigo: '蛙',
            season: '春',
            created_at: '2025-01-01T00:00:00.000Z',
            updated_at: '2025-01-01T00:00:00.000Z',
          },
        ],
        source: mockSources[0],
      },
    ],
    events: [],
    media: [],
    locations: mockLocations,
    poets: mockPoets,
    sources: mockSources,
  },
];
