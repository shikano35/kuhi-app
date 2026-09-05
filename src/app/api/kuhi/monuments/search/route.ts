import { NextRequest, NextResponse } from 'next/server';
import { monumentSearchSchema } from '@/lib/monument-search';
import { getListMonumentsPage } from '@/lib/server-monument-search';

export async function GET(request: NextRequest) {
  const parsed = monumentSearchSchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: '検索条件が正しくありません' },
      { status: 400 }
    );
  }
  try {
    return NextResponse.json(await getListMonumentsPage(parsed.data));
  } catch (error) {
    console.error('Monument search failed:', error);
    return NextResponse.json({ error: '検索に失敗しました' }, { status: 502 });
  }
}
