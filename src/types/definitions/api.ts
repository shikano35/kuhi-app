/**
 * API（https://api.kuhi.jp）の型定義
 */

// 基本エンティティ
export interface Monument {
  id: number;
  canonical_name: string;
  canonical_uri: string;
  monument_type: string | null;
  monument_type_uri: string | null;
  material: string | null;
  material_uri: string | null;
  is_reliable: boolean;
  verification_status: 'verified' | 'unverified' | 'pending';
  verified_at: string | null;
  verified_by: string | null;
  reliability_note: string | null;
  created_at: string;
  updated_at: string;
  original_established_date: string | null;
  hu_time_normalized: string | null;
  interval_start: string | null;
  interval_end: string | null;
  uncertainty_note: string | null;
}

export interface Inscription {
  id: number;
  monument_id?: number;
  side: string;
  original_text: string;
  transliteration: string | null;
  reading: string | null;
  language: string;
  notes: string | null;
  source_id?: number;
  created_at?: string;
  updated_at?: string;
  poems: Poem[];
  source?: Source;
}

export interface Poem {
  id: number;
  text: string;
  normalized_text: string;
  text_hash: string;
  kigo: string | null;
  season: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  event_type: string;
  hu_time_normalized: string | null;
  interval_start: string | null;
  interval_end: string | null;
  uncertainty_note: string | null;
  actor: string | null;
  source: Source;
}

export interface Media {
  id: number;
  media_type: string;
  url: string;
  iiif_manifest_url: string | null;
  captured_at: string | null;
  photographer: string | null;
  license: string | null;
}

export interface Location {
  id: number;
  imi_pref_code: string | null;
  region: string;
  prefecture: string;
  municipality: string;
  address: string | null;
  place_name: string;
  latitude: number;
  longitude: number;
  geohash: string | null;
  geom_geojson: string | null;
  accuracy_m: number | null;
  created_at: string;
  updated_at: string;
}

export interface Poet {
  id: number;
  name: string;
  name_kana: string | null;
  biography: string | null;
  birth_year: number | null;
  death_year: number | null;
  link_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Source {
  id: number;
  citation: string;
  author: string | null;
  title: string | null;
  publisher: string | null;
  source_year: number | null;
  url: string | null;
  created_at: string;
  updated_at: string;
}

// 複合エンティティ（レスポンス用）
export interface MonumentWithRelations extends Monument {
  inscriptions: Inscription[];
  events: Event[];
  media: Media[];
  locations: Location[];
  poets: Poet[];
  sources: Source[];
}

export interface PoemWithRelations extends Poem {
  attributions: PoemAttribution[];
  inscriptions: Inscription[];
}

export interface PoemAttribution {
  id: number;
  poem_id: number;
  poet_id: number;
  confidence: string;
  confidence_score: number;
  source_id: number | null;
  created_at: string;
  poet: Poet;
  source: Source | null;
}

export interface InscriptionWithRelations extends Inscription {
  monument: Monument;
  source: Source;
}

// API レスポンス型
export interface MonumentsResponse {
  monuments?: MonumentWithRelations[];
}

export interface MonumentResponse {
  monument?: MonumentWithRelations;
}

export interface InscriptionsResponse {
  inscriptions: InscriptionWithRelations[];
}

export interface InscriptionWithMonument extends Omit<Inscription, 'source'> {
  monument_id: number;
  source_id: number;
  created_at: string;
  updated_at: string;
  monument: Monument;
  source: Source;
}

export interface PoemsResponse {
  poems: PoemWithRelations[];
}

export interface PoetsResponse {
  poets?: Poet[];
}

export interface LocationsResponse {
  locations?: Location[];
}

export interface SourcesResponse {
  sources?: Source[];
}

// クエリパラメータ
export interface MonumentsQueryParams {
  limit?: number;
  offset?: number;
  ordering?: string;
  q?: string;
  inscription_contains?: string;
  commentary_contains?: string;
  poet_name_contains?: string;
  poet_id?: number;
  kigo?: string;
  season?: string;
  material?: string;
  monument_type?: string;
  prefecture?: string;
  region?: string;
  location_id?: number;
  bbox?: string;
  established_start?: string;
  established_end?: string;
  has_media?: boolean;
  uncertain?: boolean;
  expand?: string;
}

export interface InscriptionsQueryParams {
  limit?: number;
  offset?: number;
  monument_id?: number;
  language?: string;
  text_contains?: string;
}

export interface PoemsQueryParams {
  limit?: number;
  offset?: number;
  ordering?: string;
  search?: string;
  text_contains?: string;
  poet_id?: number;
  season?: string;
  kigo?: string;
}

export interface PoetsQueryParams {
  limit?: number;
  offset?: number;
  ordering?: string[];
  search?: string;
  name_contains?: string;
  biography_contains?: string;
}

export interface LocationsQueryParams {
  limit?: number;
  offset?: number;
  ordering?: string[];
  prefecture?: string;
  region?: string;
}

export interface SourcesQueryParams {
  limit?: number;
  offset?: number;
  ordering?: string;
  search?: string;
  title_contains?: string;
  author_contains?: string;
  created_at_gt?: string;
  created_at_lt?: string;
  updated_at_gt?: string;
  updated_at_lt?: string;
}
