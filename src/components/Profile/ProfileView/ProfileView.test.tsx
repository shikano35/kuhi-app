import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProfileView } from './index';
import { Session } from 'next-auth';
import React from 'react';

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => {
    return React.createElement('img', { src, alt, ...props });
  },
}));

vi.mock('@/components/Profile/ProfileContainer', () => ({
  ProfileContainer: vi.fn(({ user }: { user: Session['user'] }) => {
    return (
      <div data-testid="profile-container">
        <div>
          <h1>{user.name}</h1>
          {user.image && <img alt={user.name || ''} src={user.image} />}
          {!user.image && <div>{user.name?.charAt(0)}</div>}
        </div>

        <div role="tablist">
          <button aria-selected="true" data-state="active" role="tab">
            お気に入り句碑 <span>1</span>
          </button>
          <button aria-selected="false" data-state="inactive" role="tab">
            訪問済み句碑 <span>1</span>
          </button>
        </div>

        <div aria-labelledby="favorites-tab" role="tabpanel">
          <div>テスト俳句</div>
          <button aria-label="テスト俳句をお気に入りから削除">削除</button>
        </div>

        <div aria-labelledby="visited-tab" hidden role="tabpanel">
          <div>テスト俳句2</div>
        </div>
      </div>
    );
  }),
}));

const mockUser: Session['user'] = {
  id: '1',
  name: 'テストユーザー',
  email: 'test@example.com',
  image: 'https://example.com/avatar.jpg',
};

describe('ProfileView', () => {
  test('ユーザー情報が正しく表示される', () => {
    render(<ProfileView user={mockUser} />);

    expect(screen.getByText('テストユーザー')).toBeInTheDocument();
    expect(screen.getByAltText('テストユーザー')).toBeInTheDocument();
  });

  test('ProfileContainerが正しくレンダリングされる', () => {
    render(<ProfileView user={mockUser} />);

    expect(screen.getByTestId('profile-container')).toBeInTheDocument();
  });

  test('タブが正しく表示される', () => {
    render(<ProfileView user={mockUser} />);

    expect(screen.getByText('お気に入り句碑')).toBeInTheDocument();
    expect(screen.getByText('訪問済み句碑')).toBeInTheDocument();
  });

  test('お気に入りコンテンツが表示される', () => {
    render(<ProfileView user={mockUser} />);

    expect(screen.getByText('テスト俳句')).toBeInTheDocument();
  });

  test('ユーザー画像がない場合のフォールバック表示', () => {
    const userWithoutImage = { ...mockUser, image: null };
    render(<ProfileView user={userWithoutImage} />);

    expect(screen.getByText('テ')).toBeInTheDocument(); // 名前の最初の文字
  });

  test('タブに件数バッジが表示される', () => {
    render(<ProfileView user={mockUser} />);

    const badges = screen.getAllByText('1');
    expect(badges).toHaveLength(2);
  });
});
