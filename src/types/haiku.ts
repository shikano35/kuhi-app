export interface Poet {
  id: number;
  name: string;
  biography: string | null;
  link_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Source {
  id: number;
  title: string;
  author: string | null;
  publisher: string | null;
  source_year: number | null;
  url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: number;
  region: string;
  prefecture: string;
  municipality: string | null;
  address: string | null;
  place_name: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface HaikuMonument {
  id: number;
  inscription: string;
  commentary: string | null;
  kigo: string | null;
  season: string | null;
  is_reliable: boolean | null;
  has_reverse_inscription: boolean | null;
  material: string | null;
  total_height: number | null;
  width: number | null;
  depth: number | null;
  established_date: string | null;
  established_year: string | null;
  founder: string | null;
  monument_type: string | null;
  designation_status: string | null;
  photo_url: string | null;
  photo_date: string | null;
  photographer: string | null;
  model_3d_url: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  poet_id: number;
  source_id: number;
  location_id: number;
  poets: Poet[];
  sources: Source[];
  locations: Location[];
}

export interface HaikuMonumentResponse {
  haiku_monuments: HaikuMonument[];
}

export interface RegionCount {
  region: string;
  count: number;
}

export interface PrefectureCount {
  prefecture: string;
  count: number;
}
