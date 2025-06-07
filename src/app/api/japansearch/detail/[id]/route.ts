import { NextRequest, NextResponse } from 'next/server';
import {
  normalizeJapanSearchItem,
  JapanSearchItem,
} from '@/lib/japansearch-types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'アイテムIDが必要です' },
        { status: 400 }
      );
    }

    const decodedId = decodeURIComponent(id);
    let foundItem: JapanSearchItem | null = null;

    try {
      const directUrl = `https://jpsearch.go.jp/api/item/${decodedId}`;
      const directResponse = await fetch(directUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Kuhi-App/1.0',
        },
      });

      if (directResponse.ok) {
        const directData = await directResponse.json();
        if (directData && directData.id === decodedId) {
          foundItem = directData;
        }
      }
    } catch (error) {
      console.error('直接API取得エラー:', error);
    }

    if (!foundItem) {
      try {
        const searchUrl = new URL(
          'https://jpsearch.go.jp/api/item/search/jps-cross'
        );
        searchUrl.searchParams.set('q', `id:"${decodedId}"`);
        searchUrl.searchParams.set('size', '50');

        const searchResponse = await fetch(searchUrl.toString(), {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Kuhi-App/1.0',
          },
        });

        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.list && searchData.list.length > 0) {
            foundItem = searchData.list.find(
              (item: JapanSearchItem) => item.id === decodedId
            );
          }
        }
      } catch (error) {
        console.error('ID完全一致検索エラー:', error);
      }
    }

    if (!foundItem && decodedId.includes('-')) {
      try {
        const prefix = decodedId.split('-')[0];
        const prefixUrl = new URL(
          'https://jpsearch.go.jp/api/item/search/jps-cross'
        );
        prefixUrl.searchParams.set('q', prefix);
        prefixUrl.searchParams.set('size', '200');

        const prefixResponse = await fetch(prefixUrl.toString(), {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Kuhi-App/1.0',
          },
        });

        if (prefixResponse.ok) {
          const prefixData = await prefixResponse.json();
          if (prefixData.list && prefixData.list.length > 0) {
            foundItem = prefixData.list.find(
              (item: JapanSearchItem) => item.id === decodedId
            );
          }
        }
      } catch (error) {
        console.error('プレフィックス検索エラー:', error);
      }
    }

    if (!foundItem) {
      return NextResponse.json(
        {
          error: 'アイテムが見つかりませんでした',
          id: decodedId,
          message:
            'Japan Search APIでこのアイテムを見つけることができませんでした。IDが正しいか確認してください。',
        },
        { status: 404 }
      );
    }

    const normalizedItem = normalizeJapanSearchItem(
      foundItem as JapanSearchItem & Record<string, unknown>
    );
    return NextResponse.json(normalizedItem);
  } catch (error) {
    console.error('詳細情報の取得中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: '詳細情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}
