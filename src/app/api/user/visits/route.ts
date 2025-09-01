import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/../drizzle/schema';
import {
  userVisits,
  haikuMonuments,
  poets,
  sources,
  locations,
} from '@/../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { AddVisitRequest, UpdateVisitRequest } from '@/types/definitions/haiku';
import { getHaikuMonumentById } from '@/lib/api';

// GET /api/user/visits - Get user's visited monuments
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    return NextResponse.json({ visits });
  } catch (error) {
    console.error('Error fetching user visits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/user/visits - Add monument visit
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AddVisitRequest = await request.json();
    const { monumentId, visitedAt, notes, rating, visitPhotoUrl } = body;

    if (!monumentId) {
      return NextResponse.json(
        { error: 'Monument ID is required' },
        { status: 400 }
      );
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
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

    const existingVisit = await db
      .select()
      .from(userVisits)
      .where(
        and(
          eq(userVisits.userId, session.user.id),
          eq(userVisits.monumentId, monumentId)
        )
      )
      .limit(1);

    if (existingVisit.length > 0) {
      const [updatedVisit] = await db
        .update(userVisits)
        .set({
          visitedAt: visitedAt ? new Date(visitedAt) : new Date(),
          notes,
          rating,
          visitPhotoUrl,
          updatedAt: new Date(),
        })
        .where(eq(userVisits.id, existingVisit[0].id))
        .returning();

      return NextResponse.json({ visit: updatedVisit });
    }

    const [visit] = await db
      .insert(userVisits)
      .values({
        userId: session.user.id,
        monumentId,
        visitedAt: visitedAt ? new Date(visitedAt) : new Date(),
        notes,
        rating,
        visitPhotoUrl,
      })
      .returning();

    return NextResponse.json({ visit }, { status: 201 });
  } catch (error) {
    console.error('Error adding visit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user/visits - Update monument visit
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: UpdateVisitRequest = await request.json();
    const { visitId, notes, rating, visitPhotoUrl } = body;

    if (!visitId) {
      return NextResponse.json(
        { error: 'Visit ID is required' },
        { status: 400 }
      );
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const [updatedVisit] = await db
      .update(userVisits)
      .set({
        notes,
        rating,
        visitPhotoUrl,
        updatedAt: new Date(),
      })
      .where(
        and(eq(userVisits.id, visitId), eq(userVisits.userId, session.user.id))
      )
      .returning();

    if (!updatedVisit) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    return NextResponse.json({ visit: updatedVisit });
  } catch (error) {
    console.error('Error updating visit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/visits - Remove monument visit
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const visitId = searchParams.get('visitId');
    const monumentId = searchParams.get('monumentId');

    if (!visitId && !monumentId) {
      return NextResponse.json(
        { error: 'Visit ID or Monument ID is required' },
        { status: 400 }
      );
    }

    let whereCondition;
    if (visitId) {
      whereCondition = and(
        eq(userVisits.id, visitId),
        eq(userVisits.userId, session.user.id)
      );
    } else {
      whereCondition = and(
        eq(userVisits.monumentId, parseInt(monumentId as string)),
        eq(userVisits.userId, session.user.id)
      );
    }

    const result = await db
      .delete(userVisits)
      .where(whereCondition)
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'Visit not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing visit:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
