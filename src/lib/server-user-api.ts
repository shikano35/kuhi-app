import { auth } from '@/lib/auth';
import { db } from '@/../drizzle/schema';
import {
  userFavorites,
  userVisits,
  haikuMonuments,
  poets,
  sources,
  locations,
} from '@/../drizzle/schema';
import { eq } from 'drizzle-orm';
import {
  GetUserFavoritesResponse,
  GetUserVisitsResponse,
} from '@/types/definitions/haiku';

/**
 * サーバーサイドでユーザーのお気に入り句碑を取得する
 */
export async function getUserFavoritesServer(): Promise<GetUserFavoritesResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { favorites: [] };
  }

  try {
    const favorites = await db
      .select({
        id: userFavorites.id,
        userId: userFavorites.userId,
        monumentId: userFavorites.monumentId,
        createdAt: userFavorites.createdAt,
        monument: {
          id: haikuMonuments.id,
          inscription: haikuMonuments.inscription,
          commentary: haikuMonuments.commentary,
          kigo: haikuMonuments.kigo,
          season: haikuMonuments.season,
          isReliable: haikuMonuments.isReliable,
          hasReverseInscription: haikuMonuments.hasReverseInscription,
          material: haikuMonuments.material,
          totalHeight: haikuMonuments.totalHeight,
          width: haikuMonuments.width,
          depth: haikuMonuments.depth,
          establishedDate: haikuMonuments.establishedDate,
          establishedYear: haikuMonuments.establishedYear,
          founder: haikuMonuments.founder,
          monumentType: haikuMonuments.monumentType,
          designationStatus: haikuMonuments.designationStatus,
          photoUrl: haikuMonuments.photoUrl,
          photoDate: haikuMonuments.photoDate,
          photographer: haikuMonuments.photographer,
          model3dUrl: haikuMonuments.model3dUrl,
          remarks: haikuMonuments.remarks,
          poetId: haikuMonuments.poetId,
          sourceId: haikuMonuments.sourceId,
          locationId: haikuMonuments.locationId,
          createdAt: haikuMonuments.createdAt,
          updatedAt: haikuMonuments.updatedAt,
          poetName: poets.name,
          poetBiography: poets.biography,
          poetLinkUrl: poets.linkUrl,
          poetImageUrl: poets.imageUrl,
          sourceTitle: sources.title,
          sourceAuthor: sources.author,
          sourcePublisher: sources.publisher,
          sourceYear: sources.sourceYear,
          sourceUrl: sources.url,
          locationRegion: locations.region,
          locationPrefecture: locations.prefecture,
          locationMunicipality: locations.municipality,
          locationAddress: locations.address,
          locationPlaceName: locations.placeName,
          locationLatitude: locations.latitude,
          locationLongitude: locations.longitude,
        },
      })
      .from(userFavorites)
      .innerJoin(
        haikuMonuments,
        eq(userFavorites.monumentId, haikuMonuments.id)
      )
      .leftJoin(poets, eq(haikuMonuments.poetId, poets.id))
      .leftJoin(sources, eq(haikuMonuments.sourceId, sources.id))
      .leftJoin(locations, eq(haikuMonuments.locationId, locations.id))
      .where(eq(userFavorites.userId, session.user.id))
      .orderBy(userFavorites.createdAt);

    // null値をundefinedに変換
    const transformedFavorites = favorites.map((fav) => ({
      ...fav,
      monument: {
        ...fav.monument,
        commentary: fav.monument.commentary ?? undefined,
        kigo: fav.monument.kigo ?? undefined,
        season: fav.monument.season ?? undefined,
        isReliable: fav.monument.isReliable ?? undefined,
        hasReverseInscription: fav.monument.hasReverseInscription ?? undefined,
        material: fav.monument.material ?? undefined,
        totalHeight: fav.monument.totalHeight ?? undefined,
        width: fav.monument.width ?? undefined,
        depth: fav.monument.depth ?? undefined,
        establishedDate: fav.monument.establishedDate ?? undefined,
        establishedYear: fav.monument.establishedYear ?? undefined,
        founder: fav.monument.founder ?? undefined,
        monumentType: fav.monument.monumentType ?? undefined,
        designationStatus: fav.monument.designationStatus ?? undefined,
        photoUrl: fav.monument.photoUrl ?? undefined,
        photoDate: fav.monument.photoDate ?? undefined,
        photographer: fav.monument.photographer ?? undefined,
        model3dUrl: fav.monument.model3dUrl ?? undefined,
        remarks: fav.monument.remarks ?? undefined,
        poetId: fav.monument.poetId ?? undefined,
        sourceId: fav.monument.sourceId ?? undefined,
        locationId: fav.monument.locationId ?? undefined,
        poetName: fav.monument.poetName ?? undefined,
        poetBiography: fav.monument.poetBiography ?? undefined,
        poetLinkUrl: fav.monument.poetLinkUrl ?? undefined,
        poetImageUrl: fav.monument.poetImageUrl ?? undefined,
        sourceTitle: fav.monument.sourceTitle ?? undefined,
        sourceAuthor: fav.monument.sourceAuthor ?? undefined,
        sourcePublisher: fav.monument.sourcePublisher ?? undefined,
        sourceYear: fav.monument.sourceYear ?? undefined,
        sourceUrl: fav.monument.sourceUrl ?? undefined,
        locationRegion: fav.monument.locationRegion ?? undefined,
        locationPrefecture: fav.monument.locationPrefecture ?? undefined,
        locationMunicipality: fav.monument.locationMunicipality ?? undefined,
        locationAddress: fav.monument.locationAddress ?? undefined,
        locationPlaceName: fav.monument.locationPlaceName ?? undefined,
        locationLatitude: fav.monument.locationLatitude ?? undefined,
        locationLongitude: fav.monument.locationLongitude ?? undefined,
      },
    }));

    return { favorites: transformedFavorites };
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return { favorites: [] };
  }
}

/**
 * サーバーサイドでユーザーの訪問済み句碑を取得する
 */
export async function getUserVisitsServer(): Promise<GetUserVisitsResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return { visits: [] };
  }

  try {
    const visits = await db
      .select({
        id: userVisits.id,
        userId: userVisits.userId,
        monumentId: userVisits.monumentId,
        visitedAt: userVisits.visitedAt,
        notes: userVisits.notes,
        rating: userVisits.rating,
        visitPhotoUrl: userVisits.visitPhotoUrl,
        createdAt: userVisits.createdAt,
        updatedAt: userVisits.updatedAt,
        monument: {
          id: haikuMonuments.id,
          inscription: haikuMonuments.inscription,
          commentary: haikuMonuments.commentary,
          kigo: haikuMonuments.kigo,
          season: haikuMonuments.season,
          isReliable: haikuMonuments.isReliable,
          hasReverseInscription: haikuMonuments.hasReverseInscription,
          material: haikuMonuments.material,
          totalHeight: haikuMonuments.totalHeight,
          width: haikuMonuments.width,
          depth: haikuMonuments.depth,
          establishedDate: haikuMonuments.establishedDate,
          establishedYear: haikuMonuments.establishedYear,
          founder: haikuMonuments.founder,
          monumentType: haikuMonuments.monumentType,
          designationStatus: haikuMonuments.designationStatus,
          photoUrl: haikuMonuments.photoUrl,
          photoDate: haikuMonuments.photoDate,
          photographer: haikuMonuments.photographer,
          model3dUrl: haikuMonuments.model3dUrl,
          remarks: haikuMonuments.remarks,
          poetId: haikuMonuments.poetId,
          sourceId: haikuMonuments.sourceId,
          locationId: haikuMonuments.locationId,
          createdAt: haikuMonuments.createdAt,
          updatedAt: haikuMonuments.updatedAt,
          poetName: poets.name,
          poetBiography: poets.biography,
          poetLinkUrl: poets.linkUrl,
          poetImageUrl: poets.imageUrl,
          sourceTitle: sources.title,
          sourceAuthor: sources.author,
          sourcePublisher: sources.publisher,
          sourceYear: sources.sourceYear,
          sourceUrl: sources.url,
          locationRegion: locations.region,
          locationPrefecture: locations.prefecture,
          locationMunicipality: locations.municipality,
          locationAddress: locations.address,
          locationPlaceName: locations.placeName,
          locationLatitude: locations.latitude,
          locationLongitude: locations.longitude,
        },
      })
      .from(userVisits)
      .innerJoin(haikuMonuments, eq(userVisits.monumentId, haikuMonuments.id))
      .leftJoin(poets, eq(haikuMonuments.poetId, poets.id))
      .leftJoin(sources, eq(haikuMonuments.sourceId, sources.id))
      .leftJoin(locations, eq(haikuMonuments.locationId, locations.id))
      .where(eq(userVisits.userId, session.user.id))
      .orderBy(userVisits.visitedAt);

    // null値をundefinedに変換
    const transformedVisits = visits.map((visit) => ({
      ...visit,
      notes: visit.notes ?? undefined,
      rating: visit.rating ?? undefined,
      visitPhotoUrl: visit.visitPhotoUrl ?? undefined,
      monument: {
        ...visit.monument,
        commentary: visit.monument.commentary ?? undefined,
        kigo: visit.monument.kigo ?? undefined,
        season: visit.monument.season ?? undefined,
        isReliable: visit.monument.isReliable ?? undefined,
        hasReverseInscription:
          visit.monument.hasReverseInscription ?? undefined,
        material: visit.monument.material ?? undefined,
        totalHeight: visit.monument.totalHeight ?? undefined,
        width: visit.monument.width ?? undefined,
        depth: visit.monument.depth ?? undefined,
        establishedDate: visit.monument.establishedDate ?? undefined,
        establishedYear: visit.monument.establishedYear ?? undefined,
        founder: visit.monument.founder ?? undefined,
        monumentType: visit.monument.monumentType ?? undefined,
        designationStatus: visit.monument.designationStatus ?? undefined,
        photoUrl: visit.monument.photoUrl ?? undefined,
        photoDate: visit.monument.photoDate ?? undefined,
        photographer: visit.monument.photographer ?? undefined,
        model3dUrl: visit.monument.model3dUrl ?? undefined,
        remarks: visit.monument.remarks ?? undefined,
        poetId: visit.monument.poetId ?? undefined,
        sourceId: visit.monument.sourceId ?? undefined,
        locationId: visit.monument.locationId ?? undefined,
        poetName: visit.monument.poetName ?? undefined,
        poetBiography: visit.monument.poetBiography ?? undefined,
        poetLinkUrl: visit.monument.poetLinkUrl ?? undefined,
        poetImageUrl: visit.monument.poetImageUrl ?? undefined,
        sourceTitle: visit.monument.sourceTitle ?? undefined,
        sourceAuthor: visit.monument.sourceAuthor ?? undefined,
        sourcePublisher: visit.monument.sourcePublisher ?? undefined,
        sourceYear: visit.monument.sourceYear ?? undefined,
        sourceUrl: visit.monument.sourceUrl ?? undefined,
        locationRegion: visit.monument.locationRegion ?? undefined,
        locationPrefecture: visit.monument.locationPrefecture ?? undefined,
        locationMunicipality: visit.monument.locationMunicipality ?? undefined,
        locationAddress: visit.monument.locationAddress ?? undefined,
        locationPlaceName: visit.monument.locationPlaceName ?? undefined,
        locationLatitude: visit.monument.locationLatitude ?? undefined,
        locationLongitude: visit.monument.locationLongitude ?? undefined,
      },
    }));

    return { visits: transformedVisits };
  } catch (error) {
    console.error('Error fetching user visits:', error);
    return { visits: [] };
  }
}
