import { HaikuMonument, UserHaikuMonument } from '@/types/definitions/haiku';

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
