import { test, expect } from '@playwright/test';

test.describe('プロフィール機能のE2Eテスト', () => {
  test.beforeEach(async ({ page, context }) => {
    // NextAuth.jsのセッション情報を含むCookieを設定
    await context.addCookies([
      {
        name: 'next-auth.session-token',
        value: 'test-session-token',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    // NextAuth.js関連のAPIエンドポイントをすべてモック
    await page.route('**/api/auth/**', async (route) => {
      const url = route.request().url();
      
      if (url.includes('/session')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            user: {
              id: 'test-user-id',
              name: 'テストユーザー',
              email: 'test@example.com',
              image: null,
              bio: 'テスト用の自己紹介',
            },
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          }),
        });
      } else if (url.includes('/csrf')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            csrfToken: 'test-csrf-token',
          }),
        });
      } else {
        // その他のauth APIは成功レスポンスを返す
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
      }
    });

    // お気に入り取得APIをモック
    await page.route('**/api/user/favorites', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            favorites: [
              {
                id: 'fav-1',
                userId: 'test-user-id',
                monumentId: 1,
                createdAt: new Date('2025-05-29T10:00:00Z'),
                monument: {
                  id: 1,
                  inscription: 'テスト俳句一',
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
      }
    });

    // 訪問履歴取得APIをモック
    await page.route('**/api/user/visits', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            visits: [
              {
                id: 'visit-1',
                userId: 'test-user-id',
                monumentId: 2,
                visitedAt: new Date('2025-05-29T10:00:00Z'),
                notes: 'テスト訪問メモ',
                rating: 5,
                visitPhotoUrl: null,
                createdAt: new Date('2025-05-29T10:00:00Z'),
                updatedAt: new Date('2025-05-29T10:00:00Z'),
                monument: {
                  id: 2,
                  inscription: 'テスト俳句二',
                  commentary: 'テスト解説2',
                  kigo: 'テスト季語2',
                  season: '夏',
                  isReliable: true,
                  hasReverseInscription: false,
                  material: '石',
                  totalHeight: '180',
                  width: '60',
                  depth: '60',
                  establishedDate: '2001-07-15',
                  establishedYear: '2001',
                  founder: 'テスト設立者2',
                  monumentType: '句碑',
                  designationStatus: null,
                  photoUrl: null,
                  photoDate: null,
                  photographer: null,
                  model3dUrl: null,
                  remarks: null,
                  poetId: 2,
                  sourceId: 2,
                  locationId: 2,
                  poetName: 'テスト俳人2',
                  poetBiography: null,
                  poetLinkUrl: null,
                  poetImageUrl: null,
                  sourceTitle: 'テスト句集2',
                  sourceAuthor: null,
                  sourcePublisher: null,
                  sourceYear: 2001,
                  sourceUrl: null,
                  locationRegion: '関東',
                  locationPrefecture: '東京都',
                  locationMunicipality: '新宿区',
                  locationAddress: 'テスト住所2',
                  locationPlaceName: 'テスト場所2',
                  locationLatitude: '35.6895',
                  locationLongitude: '139.6917',
                  createdAt: new Date('2025-05-29T09:00:00Z'),
                  updatedAt: new Date('2025-05-29T09:00:00Z')
                }
              }
            ]
          }),
        });
      }
    });
  });

  test('プロフィールページが正しく表示されること', async ({ page }) => {
    await page.goto('/profile');

    // ページが読み込まれるまで待つ
    await page.waitForLoadState('networkidle');
    
    // ログインページにリダイレクトされていないか確認
    expect(page.url()).not.toContain('/auth/login');

    // ユーザー名がh1タグで表示されていることを確認
    await expect(page.locator('h1:has-text("テストユーザー")')).toBeVisible({ timeout: 10000 });

    // ユーザー情報が表示されていることを確認
    await expect(page.locator('text=テストユーザー')).toBeVisible();

    // タブが表示されていることを確認
    await expect(page.locator('button:has-text("お気に入り句碑")')).toBeVisible();
    await expect(page.locator('button:has-text("訪問済み句碑")')).toBeVisible();
  });

  test('お気に入りタブが正しく表示されること', async ({ page }) => {
    await page.goto('/profile');

    // お気に入りタブがデフォルトで選択されていることを確認
    const favoritesTab = page.locator('button:has-text("お気に入り句碑")');
    await expect(favoritesTab).toHaveAttribute('data-state', 'active');

    // お気に入り句碑が表示されていることを確認
    await expect(page.locator('text=テスト俳句一')).toBeVisible();
    await expect(page.locator('text=テスト俳人')).toBeVisible();
    await expect(page.locator('text=東京都 渋谷区')).toBeVisible();
  });

  test('訪問済みタブに切り替えられること', async ({ page }) => {
    await page.goto('/profile');

    // 訪問済みタブをクリック
    await page.click('button:has-text("訪問済み句碑")');

    // 訪問済みタブがアクティブになることを確認
    const visitedTab = page.locator('button:has-text("訪問済み句碑")');
    await expect(visitedTab).toHaveAttribute('data-state', 'active');

    // 訪問済み句碑が表示されていることを確認
    await expect(page.locator('text=テスト俳句二')).toBeVisible();
    await expect(page.locator('text=テスト俳人2')).toBeVisible();
    await expect(page.locator('text=東京都 新宿区')).toBeVisible();
  });

  test('お気に入りが空の場合の表示', async ({ page }) => {
    // 空のお気に入りリストをモック
    await page.route('**/api/user/favorites', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ favorites: [] }),
      });
    });

    await page.goto('/profile');

    // 空状態のメッセージが表示されることを確認
    await expect(page.locator('text=お気に入り登録した句碑はありません')).toBeVisible();
    await expect(page.locator('text=気に入った句碑や俳句をお気に入り登録して、いつでも見返せるようにしましょう')).toBeVisible();
    await expect(page.locator('a[href="/list"]:has-text("句碑や俳句を探す")')).toBeVisible();
  });

  test('訪問履歴が空の場合の表示', async ({ page }) => {
    // 空の訪問履歴をモック
    await page.route('**/api/user/visits', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ visits: [] }),
      });
    });

    await page.goto('/profile');

    // 訪問済みタブをクリック
    await page.click('button:has-text("訪問済み句碑")');

    // 空状態のメッセージが表示されることを確認
    await expect(page.locator('text=訪問記録がありません')).toBeVisible();
    await expect(page.locator('text=訪れた句碑を記録して、あなたの句碑めぐりの思い出を残しましょう')).toBeVisible();
    await expect(page.locator('a[href="/map"]:has-text("地図で句碑を探す")')).toBeVisible();
  });

  test('句碑カードから詳細ページに遷移できること', async ({ page }) => {
    await page.goto('/profile');

    // お気に入りタブがアクティブであることを確認
    await expect(page.locator('button:has-text("お気に入り句碑")')).toHaveAttribute('data-state', 'active');
    
    // 句碑カードが表示されるまで待つ
    await expect(page.locator('[data-testid="haiku-card"]').first()).toBeVisible({ timeout: 10000 });

    // 遷移をPromiseで待つ
    const navigationPromise = page.waitForURL('**/monument/**');
    
    // お気に入りの句碑カードをクリック（HaikuCardのLinkコンポーネント）
    await page.click('[data-testid="haiku-card"]:first-child');

    // ナビゲーション完了を待つ
    await navigationPromise;

    // 句碑詳細ページに遷移することを確認
    await expect(page.url()).toContain('/monument/');
  });

  test('ローディング状態が表示されること', async ({ page }) => {
    // APIレスポンスを遅延させる
    await page.route('**/api/user/favorites', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ favorites: [] }),
        });
      }, 1000);
    });

    await page.goto('/profile');

    // ローディングスピナーが表示されることを確認
    await expect(page.locator('.animate-spin')).toBeVisible();
    // より具体的なセレクターを使用して重複を避ける
    await expect(page.locator('[data-testid="loading-text"], .text-muted-foreground').filter({ hasText: '読み込み中...' }).first()).toBeVisible();
  });
});
