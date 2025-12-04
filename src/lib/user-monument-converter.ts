import { HaikuMonument, UserHaikuMonument } from '@/types/definitions/haiku';
import { MonumentWithRelations } from '@/types/definitions/api';

/**
 * UserHaikuMonumentをMonumentWithRelationsに変換するユーティリティ関数
 */
export function convertUserHaikuMonumentToMonumentWithRelations(
  userMonument: UserHaikuMonument
): MonumentWithRelations {
  const safeParseNumber = (value: string | undefined): number | null => {
    if (!value) return null;
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  };

  const safeToISOString = (date: Date | string): string => {
    if (date instanceof Date) {
      return date.toISOString();
    }
    return date;
  };

  return {
    id: userMonument.id,
    canonical_name: userMonument.inscription,
    canonical_uri: `https://api.kuhi.jp/monuments/${userMonument.id}`,
    monument_type: userMonument.monumentType || null,
    monument_type_uri: null,
    material: userMonument.material || null,
    material_uri: null,
    is_reliable: false,
    verification_status: 'unverified',
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
 * UserHaikuMonumentをHaikuMonumentに変換するユーティリティ関数
 */
export function convertUserHaikuMonumentToHaikuMonument(
  userMonument: UserHaikuMonument
): HaikuMonument {
  const safeParseNumber = (value: string | undefined): number | null => {
    if (!value) return null;
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  };

  const safeToISOString = (date: Date | string): string => {
    if (date instanceof Date) {
      return date.toISOString();
    }
    return date;
  };

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
