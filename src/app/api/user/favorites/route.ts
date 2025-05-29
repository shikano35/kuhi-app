import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/../drizzle/schema';
import {
  userFavorites,
  haikuMonuments,
  poets,
  sources,
  locations,
} from '@/../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { AddFavoriteRequest, RemoveFavoriteRequest } from '@/types/haiku';
import { getHaikuMonumentById } from '@/lib/api';

// GET /api/user/favorites - Get user's favorite monuments
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/user/favorites - Add monument to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AddFavoriteRequest = await request.json();
    const { monumentId } = body;

    if (!monumentId) {
      return NextResponse.json(
        { error: 'Monument ID is required' },
        { status: 400 }
      );
    }

    let monument = await db
      .select()
      .from(haikuMonuments)
      .where(eq(haikuMonuments.id, monumentId))
      .limit(1);

    if (monument.length === 0) {
      const externalMonument = await getHaikuMonumentById(monumentId);

      if (!externalMonument) {
        return NextResponse.json(
          { error: 'Monument not found' },
          { status: 404 }
        );
      }

      for (const poet of externalMonument.poets) {
        await db
          .insert(poets)
          .values({
            id: poet.id,
            name: poet.name,
            biography: poet.biography,
            linkUrl: poet.link_url,
            imageUrl: poet.image_url,
            createdAt: new Date(poet.created_at),
            updatedAt: new Date(poet.updated_at),
          })
          .onConflictDoNothing();
      }

      for (const source of externalMonument.sources) {
        await db
          .insert(sources)
          .values({
            id: source.id,
            title: source.title,
            author: source.author,
            publisher: source.publisher,
            sourceYear: source.source_year,
            url: source.url,
            createdAt: new Date(source.created_at),
            updatedAt: new Date(source.updated_at),
          })
          .onConflictDoNothing();
      }

      for (const location of externalMonument.locations) {
        await db
          .insert(locations)
          .values({
            id: location.id,
            region: location.region,
            prefecture: location.prefecture,
            municipality: location.municipality,
            address: location.address,
            placeName: location.place_name,
            latitude: location.latitude?.toString(),
            longitude: location.longitude?.toString(),
          })
          .onConflictDoNothing();
      }

      await db
        .insert(haikuMonuments)
        .values({
          id: externalMonument.id,
          inscription: externalMonument.inscription,
          commentary: externalMonument.commentary,
          kigo: externalMonument.kigo,
          season: externalMonument.season,
          isReliable: externalMonument.is_reliable,
          hasReverseInscription: externalMonument.has_reverse_inscription,
          material: externalMonument.material,
          totalHeight: externalMonument.total_height?.toString(),
          width: externalMonument.width?.toString(),
          depth: externalMonument.depth?.toString(),
          establishedDate: externalMonument.established_date,
          establishedYear: externalMonument.established_year,
          founder: externalMonument.founder,
          monumentType: externalMonument.monument_type,
          designationStatus: externalMonument.designation_status,
          photoUrl: externalMonument.photo_url,
          photoDate: externalMonument.photo_date,
          photographer: externalMonument.photographer,
          model3dUrl: externalMonument.model_3d_url,
          remarks: externalMonument.remarks,
          poetId: externalMonument.poets[0]?.id,
          sourceId: externalMonument.sources[0]?.id,
          locationId: externalMonument.locations[0]?.id,
          createdAt: new Date(externalMonument.created_at),
          updatedAt: new Date(externalMonument.updated_at),
        })
        .onConflictDoNothing();

      monument = await db
        .select()
        .from(haikuMonuments)
        .where(eq(haikuMonuments.id, monumentId))
        .limit(1);
    }

    const existingFavorite = await db
      .select()
      .from(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, session.user.id),
          eq(userFavorites.monumentId, monumentId)
        )
      )
      .limit(1);

    if (existingFavorite.length > 0) {
      return NextResponse.json(
        { error: 'Monument already favorited' },
        { status: 409 }
      );
    }

    const [favorite] = await db
      .insert(userFavorites)
      .values({
        userId: session.user.id,
        monumentId,
      })
      .returning();

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/favorites - Remove monument from favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: RemoveFavoriteRequest = await request.json();
    const { monumentId } = body;

    if (!monumentId) {
      return NextResponse.json(
        { error: 'Monument ID is required' },
        { status: 400 }
      );
    }

    const result = await db
      .delete(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, session.user.id),
          eq(userFavorites.monumentId, monumentId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
