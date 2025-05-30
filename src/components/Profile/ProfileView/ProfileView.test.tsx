/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProfileView } from './index';
import { Session } from 'next-auth';
import * as apiHooks from '@/lib/api-hooks';
import React from 'react';

// Next.js Imageコンポーネントのモック
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    return React.createElement('img', { src, alt, ...props });
  },
}));

// モックデータ
const mockUser: Session['user'] = {
  id: '1',
  name: 'テストユーザー',
  email: 'test@example.com',
  image: 'https://example.com/avatar.jpg',
};

const mockFavorites = {
  favorites: [
    {
      id: '1',
      userId: '1',
      monumentId: 1,
      createdAt: new Date(),
      monument: {
        id: 1,
        inscription: 'テスト俳句',
        createdAt: new Date(),
        updatedAt: new Date(),
        poetName: 'テスト俳人',
        locationPrefecture: 'テスト県',
      },
    },
  ],
};

const mockVisits = {
  visits: [
    {
      id: '1',
      userId: '1',
      monumentId: 2,
      visitedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      monument: {
        id: 2,
        inscription: 'テスト俳句2',
        createdAt: new Date(),
        updatedAt: new Date(),
        poetName: 'テスト俳人2',
        locationPrefecture: 'テスト県2',
      },
    },
  ],
};

// APIフックのモック
vi.mock('@/lib/api-hooks', () => ({
  useUserFavorites: vi.fn(),
  useUserVisits: vi.fn(),
  useAddFavorite: vi.fn(),
  useRemoveFavorite: vi.fn(),
  useRemoveVisit: vi.fn(),
}));

describe('ProfileView', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    // デフォルトのモック実装
    vi.mocked(apiHooks.useUserFavorites).mockReturnValue({
      data: mockFavorites,
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(apiHooks.useUserVisits).mockReturnValue({
      data: mockVisits,
      isLoading: false,
      error: null,
    } as any);

    vi.mocked(apiHooks.useAddFavorite).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    vi.mocked(apiHooks.useRemoveFavorite).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);

    vi.mocked(apiHooks.useRemoveVisit).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    } as any);
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  test('ユーザー情報が正しく表示される', () => {
    renderWithProvider(<ProfileView user={mockUser} />);

    expect(screen.getByText('テストユーザー')).toBeInTheDocument();
    expect(screen.getByAltText('テストユーザー')).toBeInTheDocument();
  });

  test('お気に入りタブが正しく表示される', () => {
    renderWithProvider(<ProfileView user={mockUser} />);

    expect(screen.getByText('お気に入り句碑')).toBeInTheDocument();
    expect(screen.getByText('テスト俳句')).toBeInTheDocument();
  });

  test('訪問済みタブに切り替えることができる', async () => {
    const user = userEvent.setup();
    renderWithProvider(<ProfileView user={mockUser} />);

    // 訪問済みタブをクリック
    const visitedTab = screen.getByRole('tab', { name: /訪問済み句碑/ });

    await user.click(visitedTab);

    // タブの内容が切り替わることを確認
    await waitFor(() => {
      // 訪問済みタブがアクティブになったことを確認
      expect(visitedTab).toHaveAttribute('data-state', 'active');
    });

    // 訪問済み用のTabsContentが表示されることを確認
    const visitedContent = await screen.findByRole('tabpanel', {
      name: /訪問済み句碑/,
    });
    expect(visitedContent).toBeInTheDocument();
    expect(visitedContent).not.toHaveAttribute('hidden');
  });

  test('ローディング状態が正しく表示される', () => {
    vi.mocked(apiHooks.useUserFavorites).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    renderWithProvider(<ProfileView user={mockUser} />);

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  test('お気に入りが空の場合の表示が正しい', () => {
    vi.mocked(apiHooks.useUserFavorites).mockReturnValue({
      data: { favorites: [] },
      isLoading: false,
      error: null,
    } as any);

    renderWithProvider(<ProfileView user={mockUser} />);

    expect(
      screen.getByText('お気に入り登録した句碑はありません')
    ).toBeInTheDocument();
    expect(screen.getByText('句碑や俳句を探す')).toBeInTheDocument();
  });

  test('お気に入り削除ボタンが機能する', async () => {
    const mockRemoveFavorite = vi.fn();
    vi.mocked(apiHooks.useRemoveFavorite).mockReturnValue({
      mutateAsync: mockRemoveFavorite,
      isPending: false,
    } as any);

    renderWithProvider(<ProfileView user={mockUser} />);

    const removeButton =
      screen.getByLabelText('テスト俳句をお気に入りから削除');
    fireEvent.click(removeButton);

    expect(mockRemoveFavorite).toHaveBeenCalledWith({ monumentId: 1 });
  });

  test('ユーザー画像がない場合のフォールバック表示', () => {
    const userWithoutImage = { ...mockUser, image: null };
    renderWithProvider(<ProfileView user={userWithoutImage} />);

    expect(screen.getByText('テ')).toBeInTheDocument(); // 名前の最初の文字
  });

  test('タブに件数バッジが表示される', () => {
    renderWithProvider(<ProfileView user={mockUser} />);

    // お気に入りタブとそのバッジを確認
    const favoritesTab = screen.getByRole('tab', { name: /お気に入り句碑/ });
    expect(favoritesTab).toBeInTheDocument();

    // 訪問済みタブとそのバッジを確認
    const visitedTab = screen.getByRole('tab', { name: /訪問済み句碑/ });
    expect(visitedTab).toBeInTheDocument();

    // バッジが表示されていることを確認（正確なセレクタを使用）
    const badges = screen.getAllByText('1');
    expect(badges).toHaveLength(2);
  });
});
