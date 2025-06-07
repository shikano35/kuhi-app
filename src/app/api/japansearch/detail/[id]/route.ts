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

    // デコードされたIDを使用
    const decodedId = decodeURIComponent(id);

    let foundItem: JapanSearchItem | null = null;

    const searchStrategies = [
      {
        url: 'https://jpsearch.go.jp/api/item/search/jps-cross',
        params: { q: `id:"${decodedId}"`, size: '50' },
        strategy: 'ID完全一致',
      },
      {
        url: 'https://jpsearch.go.jp/api/item/search/jps-cross',
        params: { q: `id:${decodedId}`, size: '50' },
        strategy: 'ID部分一致',
      },
      {
        url: 'https://jpsearch.go.jp/api/item/search/jps-cross',
        params: { q: decodedId, size: '100' },
        strategy: 'キーワード検索',
      },
      {
        url: 'https://jpsearch.go.jp/api/item/search/jps-cross',
        params: { q: `title:"${decodedId}"`, size: '20' },
        strategy: 'タイトル完全一致',
      },
    ];

    for (const { url, params, strategy } of searchStrategies) {
      const searchUrl = new URL(url);
      Object.entries(params).forEach(([key, value]) => {
        searchUrl.searchParams.set(key, value);
      });

      try {
        const response = await fetch(searchUrl.toString(), {
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          const searchData = await response.json();

          if (searchData.list && searchData.list.length > 0) {
            // 検索戦略に応じたマッチング
            if (strategy.includes('ID')) {
              foundItem = searchData.list.find(
                (item: JapanSearchItem) => item.id === decodedId
              );

              // 完全一致がない場合、部分一致も試行
              if (!foundItem) {
                foundItem = searchData.list.find(
                  (item: JapanSearchItem) =>
                    item.id &&
                    (item.id.includes(decodedId) ||
                      decodedId.includes(item.id) ||
                      item.id.endsWith(decodedId.split('-').pop() || '') ||
                      item.id.split('-').pop() === decodedId.split('-').pop())
                );
              }
            } else if (strategy.includes('タイトル')) {
              // タイトル完全一致
              foundItem = searchData.list.find(
                (item: JapanSearchItem) => item.common?.title === decodedId
              );
            } else {
              // 柔軟なマッチング
              foundItem = searchData.list.find(
                (item: JapanSearchItem) =>
                  item.id === decodedId ||
                  item.common?.title === decodedId ||
                  (item.id && item.id.includes(decodedId))
              );
            }

            if (foundItem) {
              break;
            }
          }
        }
      } catch (error) {
        console.error(`${strategy}検索エラー:`, error);
      }
    }

    if (!foundItem && decodedId.includes('-')) {
      const prefix = decodedId.split('-')[0];
      const prefixSearchUrl = new URL(
        'https://jpsearch.go.jp/api/item/search/jps-cross'
      );
      prefixSearchUrl.searchParams.set('q', prefix);
      prefixSearchUrl.searchParams.set('size', '200');

      try {
        const prefixResponse = await fetch(prefixSearchUrl.toString(), {
          headers: { Accept: 'application/json' },
        });

        if (prefixResponse.ok) {
          const prefixData = await prefixResponse.json();

          if (prefixData.list && prefixData.list.length > 0) {
            // 詳細な検索結果の中から探す
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
      // 直接アイテムIDでアクセスを試行
      try {
        const directApiUrl = `https://jpsearch.go.jp/api/item/${decodedId}`;
        const directResponse = await fetch(directApiUrl, {
          headers: { Accept: 'application/json' },
        });

        if (directResponse.ok) {
          const directData = await directResponse.json();

          if (directData && directData.id) {
            foundItem = directData;
          }
        }
      } catch (error) {
        console.error('直接APIアクセスエラー:', error);
      }
    }

    if (!foundItem) {
      try {
        const broadSearchUrl = new URL(
          'https://jpsearch.go.jp/api/item/search/jps-cross'
        );

        const searchTerms = [
          decodedId.split('-').pop() || decodedId,
          decodedId.split('_').pop() || decodedId,
          decodedId.replace(/[^a-zA-Z0-9]/g, ' '),
        ];

        for (const term of searchTerms) {
          if (term && term.length > 2) {
            broadSearchUrl.searchParams.set('q', term);
            broadSearchUrl.searchParams.set('size', '100');

            const broadResponse = await fetch(broadSearchUrl.toString(), {
              headers: { Accept: 'application/json' },
            });

            if (broadResponse.ok) {
              const broadData = await broadResponse.json();

              if (broadData.list && broadData.list.length > 0) {
                foundItem = broadData.list.find(
                  (item: JapanSearchItem) =>
                    item.id === decodedId ||
                    item.id?.includes(decodedId) ||
                    decodedId.includes(item.id || '') ||
                    item.common?.title?.includes(term)
                );

                if (foundItem) {
                  break;
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('広範囲検索エラー:', error);
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
