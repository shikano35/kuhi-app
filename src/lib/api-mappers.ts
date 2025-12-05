/**
 * API型変換ユーティリティ
 */

import {
  MonumentWithRelations,
  Poet as ApiPoet,
  Location as ApiLocation,
  Source as ApiSource,
} from '@/types/definitions/api';
import {
  HaikuMonument,
  UserHaikuMonument,
  Poet,
  Location,
  Source,
} from '@/types/definitions/haiku';

function safeParseNumber(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
}

function safeToISOString(date: Date | string): string {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return date;
}

/**
 * API形式のPoetを内部Poet形式に変換
 */
export function mapApiPoetToPoet(poet: ApiPoet): Poet {
  return {
    id: poet.id,
    name: poet.name,
    biography: poet.biography,
    link_url: poet.link_url,
    image_url: poet.image_url,
    created_at: poet.created_at,
    updated_at: poet.updated_at,
  };
}

/**
 * API形式のLocationを内部Location形式に変換
 */
export function mapApiLocationToLocation(location: ApiLocation): Location {
  return {
    id: location.id,
    region: location.region,
    prefecture: location.prefecture,
    municipality: location.municipality,
    address: location.address,
    place_name: location.place_name,
    latitude: location.latitude,
    longitude: location.longitude,
  };
}

/**
 * API形式のSourceを内部Source形式に変換
 */
export function mapApiSourceToSource(source: ApiSource): Source {
  return {
    id: source.id,
    title: source.title || '',
    author: source.author,
    publisher: source.publisher,
    source_year: source.source_year,
    url: source.url,
    created_at: source.created_at,
    updated_at: source.updated_at,
  };
}

/**
 * MonumentWithRelationsをHaikuMonument形式に変換
 */
export function mapMonumentToHaikuMonument(
  monument: MonumentWithRelations
): HaikuMonument {
  const firstInscription = monument.inscriptions?.[0];
  const firstPoem = firstInscription?.poems?.[0];
  const establishedEvent = monument.events?.find(
    (event) => event.event_type === 'erected'
  );

  return {
    id: monument.id,
    inscription: firstInscription?.original_text || '',
    commentary: firstInscription?.notes || null,
    kigo: firstPoem?.kigo || null,
    season: firstPoem?.season || null,
    is_reliable: true,
    has_reverse_inscription: (monument.inscriptions?.length || 0) > 1,
    material: monument.material,
    total_height: null,
    width: null,
    depth: null,
    established_date: establishedEvent?.interval_start || null,
    established_year: establishedEvent?.interval_start
      ? new Date(establishedEvent.interval_start).getFullYear().toString()
      : null,
    founder: establishedEvent?.actor || null,
    monument_type: monument.monument_type,
    designation_status: null,
    photo_url:
      monument.media?.find((m) => m.media_type === 'photo')?.url || null,
    photo_date:
      monument.media?.find((m) => m.media_type === 'photo')?.captured_at ||
      null,
    photographer:
      monument.media?.find((m) => m.media_type === 'photo')?.photographer ||
      null,
    model_3d_url:
      monument.media?.find((m) => m.media_type === '3d_model')?.url || null,
    remarks: null,
    created_at: monument.created_at,
    updated_at: monument.updated_at,
    poet_id: monument.poets?.[0]?.id || 0,
    source_id: monument.sources?.[0]?.id || 0,
    location_id: monument.locations?.[0]?.id || 0,
    poets: monument.poets?.map(mapApiPoetToPoet) || [],
    sources: monument.sources?.map(mapApiSourceToSource) || [],
    locations: monument.locations?.map(mapApiLocationToLocation) || [],
  };
}

/**
 * UserHaikuMonumentをMonumentWithRelationsに変換
 */
export function mapUserMonumentToApiMonument(
  userMonument: UserHaikuMonument
): MonumentWithRelations {
  return {
    id: userMonument.id,
    canonical_name: userMonument.inscription,
    canonical_uri: `https://api.kuhi.jp/monuments/${userMonument.id}`,
    monument_type: userMonument.monumentType || null,
    monument_type_uri: null,
    material: userMonument.material || null,
    material_uri: null,
    is_reliable: false,
    verification_status: 'unverified' as const,
    verified_at: null,
    verified_by: null,
    reliability_note: null,
    created_at: safeToISOString(userMonument.createdAt),
    updated_at: safeToISOString(userMonument.updatedAt),
    original_established_date: userMonument.establishedDate || null,
    hu_time_normalized: userMonument.establishedYear || null,
    interval_start: null,
    interval_end: null,
    uncertainty_note: null,
    inscriptions: [
      {
        id: 1,
        side: 'front',
        original_text: userMonument.inscription,
        transliteration: null,
        reading: null,
        language: 'ja',
        notes: userMonument.commentary || null,
        poems: [
          {
            id: 1,
            text: userMonument.inscription,
            normalized_text: userMonument.inscription,
            text_hash: `hash_${userMonument.id}`,
            kigo: userMonument.kigo || null,
            season: userMonument.season || null,
            created_at: safeToISOString(userMonument.createdAt),
            updated_at: safeToISOString(userMonument.updatedAt),
          },
        ],
      },
    ],
    events: [],
    media: userMonument.photoUrl
      ? [
          {
            id: 1,
            media_type: 'photo',
            url: userMonument.photoUrl,
            iiif_manifest_url: null,
            captured_at: userMonument.photoDate || null,
            photographer: userMonument.photographer || null,
            license: null,
          },
        ]
      : [],
    locations: [
      {
        id: userMonument.locationId || 0,
        imi_pref_code: null,
        region: userMonument.locationRegion || '',
        prefecture: userMonument.locationPrefecture || '',
        municipality: userMonument.locationMunicipality || '',
        address: userMonument.locationAddress || null,
        place_name: userMonument.locationPlaceName || '',
        latitude: safeParseNumber(userMonument.locationLatitude) || 0,
        longitude: safeParseNumber(userMonument.locationLongitude) || 0,
        geohash: null,
        geom_geojson: null,
        accuracy_m: null,
        created_at: safeToISOString(userMonument.createdAt),
        updated_at: safeToISOString(userMonument.updatedAt),
      },
    ],
    poets: [
      {
        id: userMonument.poetId || 0,
        name: userMonument.poetName || '',
        name_kana: null,
        biography: userMonument.poetBiography || null,
        birth_year: null,
        death_year: null,
        link_url: userMonument.poetLinkUrl || null,
        image_url: userMonument.poetImageUrl || null,
        created_at: safeToISOString(userMonument.createdAt),
        updated_at: safeToISOString(userMonument.updatedAt),
      },
    ],
    sources: [
      {
        id: userMonument.sourceId || 0,
        citation: userMonument.sourceTitle || '',
        author: userMonument.sourceAuthor || null,
        title: userMonument.sourceTitle || null,
        publisher: userMonument.sourcePublisher || null,
        source_year: userMonument.sourceYear || null,
        url: userMonument.sourceUrl || null,
        created_at: safeToISOString(userMonument.createdAt),
        updated_at: safeToISOString(userMonument.updatedAt),
      },
    ],
  };
}

/**
 * UserHaikuMonumentをHaikuMonumentに変換
 */
export function mapUserMonumentToHaikuMonument(
  userMonument: UserHaikuMonument
): HaikuMonument {
  return {
    id: userMonument.id,
    inscription: userMonument.inscription,
    commentary: userMonument.commentary || null,
    kigo: userMonument.kigo || null,
    season: userMonument.season || null,
    is_reliable: userMonument.isReliable || null,
    has_reverse_inscription: userMonument.hasReverseInscription || null,
    material: userMonument.material || null,
    total_height: safeParseNumber(userMonument.totalHeight),
    width: safeParseNumber(userMonument.width),
    depth: safeParseNumber(userMonument.depth),
    established_date: userMonument.establishedDate || null,
    established_year: userMonument.establishedYear || null,
    founder: userMonument.founder || null,
    monument_type: userMonument.monumentType || null,
    designation_status: userMonument.designationStatus || null,
    photo_url: userMonument.photoUrl || null,
    photo_date: userMonument.photoDate || null,
    photographer: userMonument.photographer || null,
    model_3d_url: userMonument.model3dUrl || null,
    remarks: userMonument.remarks || null,
    created_at: safeToISOString(userMonument.createdAt),
    updated_at: safeToISOString(userMonument.updatedAt),
    poet_id: userMonument.poetId || 0,
    source_id: userMonument.sourceId || 0,
    location_id: userMonument.locationId || 0,
    poets: [
      {
        id: userMonument.poetId || 0,
        name: userMonument.poetName || '',
        biography: userMonument.poetBiography || null,
        link_url: userMonument.poetLinkUrl || null,
        image_url: userMonument.poetImageUrl || null,
        created_at: safeToISOString(userMonument.createdAt),
        updated_at: safeToISOString(userMonument.updatedAt),
      },
    ],
    sources: [
      {
        id: userMonument.sourceId || 0,
        title: userMonument.sourceTitle || '',
        author: userMonument.sourceAuthor || null,
        publisher: userMonument.sourcePublisher || null,
        source_year: userMonument.sourceYear || null,
        url: userMonument.sourceUrl || null,
        created_at: safeToISOString(userMonument.createdAt),
        updated_at: safeToISOString(userMonument.updatedAt),
      },
    ],
    locations: [
      {
        id: userMonument.locationId || 0,
        region: userMonument.locationRegion || '',
        prefecture: userMonument.locationPrefecture || '',
        municipality: userMonument.locationMunicipality || null,
        address: userMonument.locationAddress || null,
        place_name: userMonument.locationPlaceName || null,
        latitude: safeParseNumber(userMonument.locationLatitude),
        longitude: safeParseNumber(userMonument.locationLongitude),
      },
    ],
  };
}

/**
 * MonumentWithRelations配列をHaikuMonument配列に変換
 */
export function mapMonumentsToHaikuMonuments(
  monuments: MonumentWithRelations[]
): HaikuMonument[] {
  return monuments.map(mapMonumentToHaikuMonument);
}

/**
 * ApiPoet配列をPoet配列に変換
 */
export function mapApiPoetsToPoets(poets: ApiPoet[]): Poet[] {
  return poets.map(mapApiPoetToPoet);
}

/**
 * ApiLocation配列をLocation配列に変換
 */
export function mapApiLocationsToLocations(
  locations: ApiLocation[]
): Location[] {
  return locations.map(mapApiLocationToLocation);
}

/**
 * ApiSource配列をSource配列に変換
 */
export function mapApiSourcesToSources(sources: ApiSource[]): Source[] {
  return sources.map(mapApiSourceToSource);
}

export const mapNewPoetToPoet = mapApiPoetToPoet;
export const mapNewLocationToLocation = mapApiLocationToLocation;
export const mapNewSourceToSource = mapApiSourceToSource;
export const mapNewLocationsToLocations = mapApiLocationsToLocations;
export const mapNewSourcesToSources = mapApiSourcesToSources;
