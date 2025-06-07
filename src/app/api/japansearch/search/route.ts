import { NextRequest, NextResponse } from 'next/server';
import {
  normalizeJapanSearchItem,
  JapanSearchItem,
} from '@/lib/japansearch-types';

const JAPANSEARCH_BASE_URL = 'https://jpsearch.go.jp/api';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // URLパラメータから検索条件を取得
    const params = {
      keyword:
        searchParams.get('keyword') || searchParams.get('q') || undefined,
      size: parseInt(searchParams.get('size') || '20'),
      from: parseInt(searchParams.get('from') || '0'),
      'f-contents': searchParams.get('f-contents') || undefined,
      'f-type': searchParams.get('f-type') || undefined,
      'f-spatial': searchParams.get('f-spatial') || undefined,
      'f-temporal': searchParams.get('f-temporal') || undefined,
    };

    // 直接外部APIを呼び出し
    const url = new URL(`${JAPANSEARCH_BASE_URL}/item/search/jps-cross`);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`ジャパンサーチAPI エラー: ${response.status}`);
    }

    const data = await response.json();

    // アイテムを正規化
    const normalizedItems =
      data.list?.map((item: JapanSearchItem & Record<string, unknown>) =>
        normalizeJapanSearchItem(item)
      ) || [];

    const responseData = {
      items: normalizedItems,
      total: data.hit || 0,
      page: Math.floor(params.from / params.size) + 1,
      size: params.size,
      totalPages: Math.ceil((data.hit || 0) / params.size),
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Japan Search検索エラー:', error);
    return NextResponse.json(
      {
        error: '検索に失敗しました',
        items: [],
        total: 0,
        page: 1,
        size: 20,
        totalPages: 0,
      },
      { status: 500 }
    );
  }
}
