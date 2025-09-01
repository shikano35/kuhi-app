/**
 * 新しいAPIの型定義を基にしたアダプター関数
 * 既存のHaikuMonument型との互換性を保ちながら、新しいAPIのデータ構造を使用
 */

import {
  MonumentWithRelations,
  Poet,
  Location,
  Source,
} from '@/types/definitions/api';
import {
  HaikuMonument,
  Poet as OldPoet,
  Location as OldLocation,
  Source as OldSource,
} from '@/types/definitions/haiku';

/**
 * 新しいAPIの句碑データを既存のHaikuMonument型に変換
 */
export function adaptMonumentToHaikuMonument(
  monument: MonumentWithRelations
): HaikuMonument {
  const firstInscription = monument.inscriptions?.[0];
  const firstPoem = firstInscription?.poems?.[0];
  const firstPoet = monument.poets?.[0];
  const firstSource = monument.sources?.[0];
  const firstLocation = monument.locations?.[0];
  const firstMedia = monument.media?.[0];

  // 建立日を取得
  const establishedEvent = monument.events?.find(
    (event) => event.event_type === 'erected'
  );
  const establishedDate = establishedEvent?.interval_start || null;
  const establishedYear = establishedDate
    ? new Date(establishedDate).getFullYear().toString()
    : null;

  return {
    id: monument.id,
    inscription: firstInscription?.original_text || '',
    commentary: firstInscription?.notes || null,
    kigo: firstPoem?.kigo || null,
    season: firstPoem?.season || null,
    is_reliable: true, // 新しいAPIでは信頼性情報がないため、デフォルトでtrue
    has_reverse_inscription: false, // 新しいAPIでは裏面情報がないため、デフォルトでfalse
    material: monument.material,
    total_height: null, // 新しいAPIでは寸法情報がない
    width: null,
    depth: null,
    established_date: establishedDate
      ? `${establishedDate.split('-')[0]}年${establishedDate.split('-')[1]}月`
      : null,
    established_year: establishedYear,
    founder: establishedEvent?.actor || null,
    monument_type: monument.monument_type || '句碑',
    designation_status: null, // 新しいAPIでは指定状況情報がない
    photo_url: firstMedia?.url || null,
    photo_date: firstMedia?.captured_at || null,
    photographer: firstMedia?.photographer || null,
    model_3d_url: null, // 新しいAPIでは3Dモデル情報がない
    remarks: monument.uncertainty_note,
    created_at: monument.created_at,
    updated_at: monument.updated_at,
    poet_id: firstPoet?.id || 0,
    source_id: firstSource?.id || 0,
    location_id: firstLocation?.id || 0,
    poets: firstPoet ? [adaptPoetToOldPoet(firstPoet)] : [],
    sources: firstSource ? [adaptSourceToOldSource(firstSource)] : [],
    locations: firstLocation ? [adaptLocationToOldLocation(firstLocation)] : [],
  };
}

/**
 * 新しいAPIの俳人データを既存のPoet型に変換
 */
export function adaptPoetToOldPoet(poet: Poet): OldPoet {
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
 * 新しいAPIの場所データを既存のLocation型に変換
 */
export function adaptLocationToOldLocation(location: Location): OldLocation {
  return {
    id: location.id,
    region: location.region || '',
    prefecture: location.prefecture || '',
    municipality: location.municipality || '',
    address: location.address || '',
    place_name: location.place_name || '',
    latitude: location.latitude || 0,
    longitude: location.longitude || 0,
  };
}

/**
 * 新しいAPIの出典データを既存のSource型に変換
 */
export function adaptSourceToOldSource(source: Source): OldSource {
  return {
    id: source.id,
    title: source.title || '',
    author: source.author || '',
    publisher: source.publisher || '',
    source_year: source.source_year || null,
    url: source.url || '',
    created_at: source.created_at,
    updated_at: source.updated_at,
  };
}

/**
 * 複数の句碑データを変換
 */
export function adaptMonumentsToHaikuMonuments(
  monuments: MonumentWithRelations[]
): HaikuMonument[] {
  return monuments.map(adaptMonumentToHaikuMonument);
}

/**
 * 複数の俳人データを変換
 */
export function adaptPoetsToOldPoets(poets: Poet[]): OldPoet[] {
  return poets.map(adaptPoetToOldPoet);
}

/**
 * 複数の場所データを変換
 */
export function adaptLocationsToOldLocations(
  locations: Location[]
): OldLocation[] {
  return locations.map(adaptLocationToOldLocation);
}

/**
 * 複数の出典データを変換
 */
export function adaptSourcesToOldSources(sources: Source[]): OldSource[] {
  return sources.map(adaptSourceToOldSource);
}
