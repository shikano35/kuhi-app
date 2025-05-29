export interface Poet {
  id: number;
  name: string;
  biography: string | null;
  link_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  image_url?: string | null;
  is_important?: boolean;
  category?: string;
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

export interface UserHaikuMonument {
  id: number;
  inscription: string;
  commentary?: string;
  kigo?: string;
  season?: string;
  isReliable?: boolean;
  hasReverseInscription?: boolean;
  material?: string;
  totalHeight?: string;
  width?: string;
  depth?: string;
  establishedDate?: string;
  establishedYear?: string;
  founder?: string;
  monumentType?: string;
  designationStatus?: string;
  photoUrl?: string;
  photoDate?: string;
  photographer?: string;
  model3dUrl?: string;
  remarks?: string;
  poetId?: number;
  sourceId?: number;
  locationId?: number;
  createdAt: Date;
  updatedAt: Date;
  poet?: Poet;
  source?: Source;
  location?: Location;
}

export interface UserFavorite {
  id: string;
  userId: string;
  monumentId: number;
  createdAt: Date;
}

export interface UserVisit {
  id: string;
  userId: string;
  monumentId: number;
  visitedAt: Date;
  notes?: string;
  rating?: number;
  visitPhotoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddFavoriteRequest {
  monumentId: number;
}

export interface RemoveFavoriteRequest {
  monumentId: number;
}

export interface AddVisitRequest {
  monumentId: number;
  visitedAt?: Date;
  notes?: string;
  rating?: number;
  visitPhotoUrl?: string;
}

export interface UpdateVisitRequest {
  visitId: string;
  notes?: string;
  rating?: number;
  visitPhotoUrl?: string;
}

export interface GetUserFavoritesResponse {
  favorites: (UserFavorite & { monument: UserHaikuMonument })[];
}

export interface GetUserVisitsResponse {
  visits: (UserVisit & { monument: UserHaikuMonument })[];
}

export interface SearchUserHaikuMonumentsRequest {
  prefecture?: string;
  city?: string;
  author?: string;
  keyword?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit?: number;
  offset?: number;
}

export interface SearchUserHaikuMonumentsResponse {
  monuments: UserHaikuMonument[];
  total: number;
  hasMore: boolean;
}
