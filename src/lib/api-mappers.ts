import {
  MonumentWithRelations,
  Poet as ApiPoet,
  Location as ApiLocation,
  Source as ApiSource,
} from '@/types/definitions/api';
import {
  HaikuMonument,
  Poet,
  Location,
  Source,
} from '@/types/definitions/haiku';

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

export function mapMonumentsToHaikuMonuments(
  monuments: MonumentWithRelations[]
): HaikuMonument[] {
  return monuments.map(mapMonumentToHaikuMonument);
}

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
