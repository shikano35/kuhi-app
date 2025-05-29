import { test, expect } from '@playwright/test';

test('シンプルなプロフィールページテスト', async ({ page }) => {
  // ブラウザコンソールログをキャプチャ
  page.on('console', msg => {
    console.log(`Browser Console [${msg.type()}]:`, msg.text());
  });

  // API呼び出しをログに出力するためのインターセプト
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log('API Request:', request.method(), request.url());
    }
  });

  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log('API Response:', response.status(), response.url());
    }
  });

  // お気に入り取得APIをモック
  await page.route('**/api/user/favorites', route => {
    console.log('Mocking favorites API');
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        favorites: [
          {
            id: 'fav-1',
            userId: 'test-user',
            monumentId: 1,
            createdAt: new Date('2025-05-29T10:00:00Z'),
            monument: {
              id: 1,
              inscription: 'テスト俳句',
              commentary: 'テスト解説',
              kigo: 'テスト季語',
              season: '春',
              isReliable: true,
              hasReverseInscription: false,
              material: '石',
              totalHeight: '150',
              width: '50',
              depth: '50',
              establishedDate: '2000-04-01',
              establishedYear: '2000',
              founder: 'テスト設立者',
              monumentType: '句碑',
              designationStatus: null,
              photoUrl: null,
              photoDate: null,
              photographer: null,
              model3dUrl: null,
              remarks: null,
              poetId: 1,
              sourceId: 1,
              locationId: 1,
              poetName: 'テスト俳人',
              poetBiography: null,
              poetLinkUrl: null,
              poetImageUrl: null,
              sourceTitle: 'テスト句集',
              sourceAuthor: null,
              sourcePublisher: null,
              sourceYear: 2000,
              sourceUrl: null,
              locationRegion: '関東',
              locationPrefecture: '東京都',
              locationMunicipality: '渋谷区',
              locationAddress: 'テスト住所',
              locationPlaceName: 'テスト場所',
              locationLatitude: '35.6762',
              locationLongitude: '139.6503',
              createdAt: new Date('2025-05-29T09:00:00Z'),
              updatedAt: new Date('2025-05-29T09:00:00Z')
            }
          }
        ]
      }),
    });
  });

  // 訪問履歴取得APIをモック
  await page.route('**/api/user/visits', route => {
    console.log('Mocking visits API');
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ visits: [] }),
    });
  });

  // プロフィールページにアクセス
  await page.goto('/profile');

  // プロフィールページのタイトルが表示されることを確認
  await expect(page.locator('h1')).toContainText('プロフィール');

  // 少し待機してデータが読み込まれるのを待つ
  await page.waitForTimeout(3000);

  // お気に入りタブが存在するか確認
  const favoritesTab = page.locator('button:has-text("お気に入り句碑")');
  await expect(favoritesTab).toBeVisible();
  
  // お気に入りのデータが表示されているか確認
  await expect(page.locator('text=テスト俳句')).toBeVisible();
});
