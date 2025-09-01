/**
 * 新しいAPIの型から既存の型にマッピングするユーティリティ関数
 */

import {
  MonumentWithRelations,
  Poet as NewPoet,
  Location as NewLocation,
  Source as NewSource,
} from '@/types/definitions/api';
import {
  HaikuMonument,
  Poet as OldPoet,
  Location as OldLocation,
  Source as OldSource,
} from '@/types/definitions/haiku';

/**
 * 新しいAPI形式のMonumentを既存のHaikuMonument形式に変換
 */
export function mapMonumentToHaikuMonument(
  monument: MonumentWithRelations
): HaikuMonument {
  // 最初の碑文を取得（メインの俳句として使用）
  const firstInscription = monument.inscriptions?.[0];
  const firstPoem = firstInscription?.poems?.[0];

  // 建立イベントを探す
  const establishedEvent = monument.events?.find(
    (event) => event.event_type === 'erected'
  );

  const result = {
    id: monument.id,
    inscription: firstInscription?.original_text || '',
    commentary: firstInscription?.notes || null,
    kigo: firstPoem?.kigo || null,
    season: firstPoem?.season || null,
    is_reliable: true, // 新しいAPIでは信頼性フラグがないため、デフォルトでtrue
    has_reverse_inscription: (monument.inscriptions?.length || 0) > 1,
    material: monument.material,
    total_height: null, // 新しいAPIには寸法情報がない
    width: null,
    depth: null,
    established_date: establishedEvent?.interval_start || null,
    established_year: establishedEvent?.interval_start
      ? new Date(establishedEvent.interval_start).getFullYear().toString()
      : null,
    founder: establishedEvent?.actor || null,
    monument_type: monument.monument_type,
    designation_status: null, // 新しいAPIには指定状況がない
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
    remarks: null, // 新しいAPIには備考フィールドがない
    created_at: monument.created_at,
    updated_at: monument.updated_at,
    poet_id: monument.poets?.[0]?.id || 0, // とりあえず最初の俳人のIDを使用
    source_id: monument.sources?.[0]?.id || 0, // とりあえず最初の出典のIDを使用
    location_id: monument.locations?.[0]?.id || 0, // とりあえず最初の場所のIDを使用
    poets: monument.poets?.map(mapNewPoetToPoet) || [],
    sources: monument.sources?.map(mapNewSourceToSource) || [],
    locations: monument.locations?.map(mapNewLocationToLocation) || [],
  };

  return result;
}

/**
 * 新しいAPI形式のPoetを既存のPoet形式に変換
 */
export function mapNewPoetToPoet(poet: NewPoet): OldPoet {
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
 * 新しいAPI形式のLocationを既存のLocation形式に変換
 */
export function mapNewLocationToLocation(location: NewLocation): OldLocation {
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
 * 新しいAPI形式のSourceを既存のSource形式に変換
 */
export function mapNewSourceToSource(source: NewSource): OldSource {
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
 * Monument配列をHaikuMonument配列に変換
 */
export function mapMonumentsToHaikuMonuments(
  monuments: MonumentWithRelations[]
): HaikuMonument[] {
  return monuments.map(mapMonumentToHaikuMonument);
}

/**
 * NewPoet配列をPoet配列に変換
 */
export function mapNewPoetsToPoets(poets: NewPoet[]): OldPoet[] {
  return poets.map(mapNewPoetToPoet);
}

/**
 * NewLocation配列をLocation配列に変換
 */
export function mapNewLocationsToLocations(
  locations: NewLocation[]
): OldLocation[] {
  return locations.map(mapNewLocationToLocation);
}

/**
 * NewSource配列をSource配列に変換
 */
export function mapNewSourcesToSources(sources: NewSource[]): OldSource[] {
  return sources.map(mapNewSourceToSource);
}
