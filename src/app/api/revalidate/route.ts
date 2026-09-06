import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { timingSafeEqual } from 'node:crypto';

const REVALIDATABLE_TAGS = [
  'haiku-monuments',
  'haiku-monument',
  'poets',
  'locations',
  'sources',
  'news',
] as const;

type RevalidatableTag = (typeof REVALIDATABLE_TAGS)[number];

function isRevalidatableTag(value: string): value is RevalidatableTag {
  return REVALIDATABLE_TAGS.some((tag) => tag === value);
}

function isAuthorized(request: NextRequest, secret: string): boolean {
  const provided =
    request.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';

  const providedBytes = Buffer.from(provided);
  const secretBytes = Buffer.from(secret);

  if (providedBytes.length !== secretBytes.length) {
    return false;
  }

  return timingSafeEqual(providedBytes, secretBytes);
}

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    console.error('REVALIDATE_SECRET is not configured');
    return NextResponse.json(
      { error: '再検証は無効になっています' },
      { status: 503 }
    );
  }

  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 });
  }

  const requested = request.nextUrl.searchParams.get('tag');

  if (requested && !isRevalidatableTag(requested)) {
    return NextResponse.json(
      { error: `tag には ${REVALIDATABLE_TAGS.join(', ')} を指定してください` },
      { status: 400 }
    );
  }

  const tags = requested ? [requested] : [...REVALIDATABLE_TAGS];
  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: tags, at: new Date().toISOString() });
}
