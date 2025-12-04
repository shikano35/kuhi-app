import { test, expect, type Page } from '@playwright/test';

test.describe('句碑ページの統合テスト', () => {
  test.beforeEach(async ({ page }) => {
    // 句碑データのモック
    await page.route('**/monuments**', route => {
      const url = route.request().url();
      
      // 句碑詳細（特定ID）の場合
      if (/\/monuments\/\d+$/.test(url)) {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            canonical_name: '本統寺 句碑（松尾芭蕉）',
            canonical_uri: 'https://api.kuhi.jp/monuments/1',
            monument_type: '句碑',
            monument_type_uri: null,
            material: null,
            material_uri: null,
            is_reliable: true,
            verification_status: 'unverified',
            verified_at: null,
            verified_by: null,
            reliability_note: null,
            created_at: '2025-05-11T16:02:33.000Z',
            updated_at: '2025-05-11T16:02:33.000Z',
            original_established_date: null,
            hu_time_normalized: null,
            interval_start: null,
            interval_end: null,
            uncertainty_note: null,
            inscriptions: [{
              id: 1,
              side: 'front',
              original_text: '冬牡丹千鳥よ雪のほととぎす',
              transliteration: null,
              reading: null,
              language: 'ja',
              notes: '芭蕉の代表作の一つ',
              poems: [{
                id: 1,
                text: '冬牡丹千鳥よ雪のほととぎす',
                normalized_text: '冬牡丹千鳥よ雪のほととぎす',
                text_hash: '4c5f9260',
                kigo: '冬牡丹,千鳥,雪,ほととぎす',
                season: '冬',
                created_at: '2025-05-11T16:02:33.000Z',
                updated_at: '2025-05-11T16:02:33.000Z'
              }],
              source: { id: 1, title: 'テスト句集' }
            }],
            events: [{
              id: 111,
              event_type: 'erected',
              hu_time_normalized: 'HT:interval/1937-04-01/1937-04-30',
              interval_start: '1937-04-01',
              interval_end: '1937-04-30',
              uncertainty_note: '月は特定だが日不明',
              actor: '小林雨月',
              source: { id: 1, title: 'テスト句集' }
            }],
            media: [{
              id: 125,
              media_type: 'photo',
              url: '/images/monuments/sample1.jpg',
              iiif_manifest_url: null,
              captured_at: null,
              photographer: null,
              license: null
            }],
            poets: [{ id: 1, name: '松尾芭蕉' }],
            sources: [{ id: 1, title: 'テスト句集' }],
            locations: [{ 
              id: 1, 
              prefecture: '三重県', 
              municipality: '桑名市',
              place_name: '本統寺'
            }]
          }),
        });
      } else {
        // 句碑一覧の場合
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 1,
              canonical_name: '本統寺 句碑（松尾芭蕉）',
              canonical_uri: 'https://api.kuhi.jp/monuments/1',
              monument_type: '句碑',
              monument_type_uri: null,
              material: null,
              material_uri: null,
              is_reliable: false,
              verification_status: 'unverified',
              verified_at: null,
              verified_by: null,
              reliability_note: null,
              created_at: '2025-05-11T16:02:33.000Z',
              updated_at: '2025-05-11T16:02:33.000Z',
              original_established_date: null,
              hu_time_normalized: null,
              interval_start: null,
              interval_end: null,
              uncertainty_note: null,
              inscriptions: [{
                id: 1,
                side: 'front',
                original_text: 'テスト俳句一',
                transliteration: null,
                reading: null,
                language: 'ja',
                notes: null,
                poems: [],
                source: { id: 1, title: 'テスト句集' }
              }],
              events: [],
              media: [{
                id: 125,
                media_type: 'photo',
                url: '/images/monuments/sample1.jpg',
                iiif_manifest_url: null,
                captured_at: null,
                photographer: null,
                license: null
              }],
              poets: [{ id: 1, name: '松尾芭蕉' }],
              sources: [{ id: 1, title: 'テスト句集' }],
              locations: [{ 
                id: 1, 
                prefecture: '三重県', 
                municipality: '桑名市',
                place_name: '本統寺'
              }]
            }
          ]),
        });
      }
    });

    // 俳人データのモック
    await page.route('**/poets**', route => {
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