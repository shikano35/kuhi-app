import { describe, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileSettings } from './index';
import * as profileApi from '@/lib/profile-api';

vi.mock('@/lib/profile-api', () => ({
  updateProfile: vi.fn(),
  uploadProfileImage: vi.fn(),
  deleteProfileImage: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => <img alt={alt} src={src} {...props} />,
}));

const mockUser = {
  id: 'test-user-id',
  name: 'テストユーザー',
  email: 'test@example.com',
  image: null,
  bio: 'テスト用の自己紹介',
  emailNotifications: true,
};

describe('ProfileSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('ユーザー情報が正しく表示されること', () => {
    render(<ProfileSettings user={mockUser} />);

    expect(screen.getByDisplayValue('テストユーザー')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('テスト用の自己紹介')).toBeInTheDocument();
  });

  test('プロフィール情報を更新できること', async () => {
    const user = userEvent.setup();
    const mockUpdateProfile = vi.mocked(profileApi.updateProfile);
    mockUpdateProfile.mockResolvedValue();

    render(<ProfileSettings user={mockUser} />);

    // 名前を変更
    const nameInput = screen.getByDisplayValue('テストユーザー');
    await user.clear(nameInput);
    await user.type(nameInput, '更新されたユーザー');

    // 自己紹介を変更
    const bioTextarea = screen.getByDisplayValue('テスト用の自己紹介');
    await user.clear(bioTextarea);
    await user.type(bioTextarea, '更新された自己紹介');

    // 保存ボタンをクリック
    const saveButton = screen.getByRole('button', { name: /設定を保存/ });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        name: '更新されたユーザー',
        bio: '更新された自己紹介',
        emailNotifications: true,
      });
    });
  });

  test('プロフィール画像をアップロードできること', async () => {
    const user = userEvent.setup();
    const mockUploadProfileImage = vi.mocked(profileApi.uploadProfileImage);
    mockUploadProfileImage.mockResolvedValue('/uploads/avatars/test.jpg');

    render(<ProfileSettings user={mockUser} />);

    const fileInput = screen.getByLabelText('プロフィール画像のアップロード');

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(mockUploadProfileImage).toHaveBeenCalledWith(file);
    });
  });

  test('プロフィール画像を削除できること', async () => {
    const user = userEvent.setup();
    const mockDeleteProfileImage = vi.mocked(profileApi.deleteProfileImage);
    mockDeleteProfileImage.mockResolvedValue();

    const userWithImage = { ...mockUser, image: '/uploads/avatars/test.jpg' };
    render(<ProfileSettings user={userWithImage} />);

    const deleteButton = screen.getByRole('button', { name: /画像を削除/ });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteProfileImage).toHaveBeenCalled();
    });
  });

  test('メール通知設定を変更できること', async () => {
    const user = userEvent.setup();
    const mockUpdateProfile = vi.mocked(profileApi.updateProfile);
    mockUpdateProfile.mockResolvedValue();

    render(<ProfileSettings user={mockUser} />);

    // メール通知スイッチを取得して切り替え
    const emailSwitch = screen.getByRole('switch');
    await user.click(emailSwitch);

    // 保存ボタンをクリック
    const saveButton = screen.getByRole('button', { name: /設定を保存/ });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        name: 'テストユーザー',
        bio: 'テスト用の自己紹介',
        emailNotifications: false,
      });
    });
  });

  test('エラー時にエラーメッセージが表示されること', async () => {
    const user = userEvent.setup();
    const mockUpdateProfile = vi.mocked(profileApi.updateProfile);
    mockUpdateProfile.mockRejectedValue(new Error('更新に失敗しました'));

    render(<ProfileSettings user={mockUser} />);

    const saveButton = screen.getByRole('button', { name: /設定を保存/ });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('更新に失敗しました')).toBeInTheDocument();
    });
  });
});
