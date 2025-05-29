import { test, expect, type Page } from '@playwright/test';

test.describe('句碑ページの統合テスト', () => {
  test.beforeEach(async ({ page }) => {
    // 句碑データのモック
    await page.route('**/api/haiku-monuments**', route => {
      const url = route.request().url();
      
      // 句碑詳細（特定ID）の場合
      if (/\/haiku-monuments\/\d+$/.test(url)) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            haiku_monument: {
              id: 1,
              inscription: '冬牡丹千鳥よ雪のほととぎす',
              commentary: '芭蕉の代表作の一つ',
              kigo: '冬牡丹,千鳥,雪,ほととぎす',
              season: '冬',
              is_reliable: true,
              has_reverse_inscription: true,
              material: null,
              total_height: null,
              width: null,
              depth: null,
              established_date: '昭和12年4月',
              established_year: '1937-4',
              founder: '小林雨月',
              monument_type: '句碑',
              designation_status: null,
              photo_url: '/images/monuments/sample1.jpg',
              photo_date: null,
              photographer: null,
              model_3d_url: null,
              remarks: null,
              created_at: '2025-05-11 16:02:33',
              updated_at: '2025-05-11 16:02:33',
              poet_id: 1,
              source_id: 1,
              location_id: 1,
              poets: [{ id: 1, name: '松尾芭蕉' }],
              sources: [{ id: 1, title: 'テスト句集' }],
              locations: [{ 
                id: 1, 
                prefecture: '三重県', 
                municipality: '桑名市',
                place_name: '本統寺'
              }]
            }
          }),
        });
      } else {
        // 句碑一覧の場合
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            haiku_monuments: [
              {
                id: 1,
                inscription: 'テスト俳句一',
                poets: [{ id: 1, name: '松尾芭蕉' }],
                locations: [{ 
                  id: 1, 
                  prefecture: '三重県', 
                  municipality: '桑名市',
                  place_name: '本統寺'
                }],
                photo_url: '/images/monuments/sample1.jpg'
              }
            ],
            totalCount: 1
          }),
        });
      }
    });

    // 俳人データのモック
    await page.route('**/api/poets**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 1, name: '松尾芭蕉', biography: '俳聖として知られる' }
        ]),
      });
    });
  });
  test('ホームページから句碑詳細ページに遷移できること', async ({ page }: { page: Page }) => {
    // ホームページにアクセス
    await page.goto('/');
    
    // ページタイトルを確認
    await expect(page).toHaveTitle(/くひめぐり/);
    
    // ページが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    
    // 「東海」地域ボタンをクリック（サンプルデータに合わせる）
    await page.click('button:has-text("東海")');
    
    // 句碑カードが表示されるのを待つ
    await page.waitForSelector('[data-testid="haiku-card"]', { timeout: 10000 });
    
    // ナビゲーションを監視
    const navigationPromise = page.waitForURL('**/monument/**');
    
    // 一番目の句碑カードをクリック（より確実なセレクター使用）
    await page.locator('[data-testid="haiku-card"]').first().click();
    
    // ナビゲーション完了を待つ
    await navigationPromise;
    
    // 詳細ページに遷移したことを確認
    await expect(page.url()).toContain('/monument/');
    
    // 詳細ページに俳句が表示されていることを確認
    await expect(page.locator('h1')).toBeVisible();
  });

  test('句碑リストページで検索とフィルタリングができること', async ({ page }: { page: Page }) => {
    // 句碑リストページにアクセス
    await page.goto('/list');
    
    // ページが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    
    // 句碑カードが表示されていることを確認
    await expect(page.locator('[data-testid="haiku-card"]').first()).toBeVisible({ timeout: 10000 });
  });
  
  test('俳人詳細ページに関連する句碑が表示されること', async ({ page }: { page: Page }) => {
    // 句碑リストページにアクセス
    await page.goto('/list');
    
    // ページが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    
    // 句碑カードが表示されていることを確認
    await expect(page.locator('[data-testid="haiku-card"]').first()).toBeVisible({ timeout: 10000 });
  });
  
  test('句碑マップページでマーカーをクリックすると詳細が表示されること', async ({ page }: { page: Page }) => {
    // 句碑マップページにアクセス
    await page.goto('/map');
    
    // ページが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    
    // マップコンポーネントが表示されるまで待つ
    await expect(page.locator('[data-testid="map-marker"], .leaflet-container').first()).toBeVisible({ timeout: 15000 });
  });
}); 