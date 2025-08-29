import { describe, expect, vi, beforeEach } from 'vitest';
import {
  updateProfile,
  uploadProfileImage,
  deleteProfileImage,
} from '@/lib/profile-api';

// グローバルfetchのモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('プロフィールAPI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateProfile', () => {
    test('プロフィール更新が成功すること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const profileData = {
        name: 'テストユーザー',
        bio: 'テスト用の自己紹介',
        emailNotifications: true,
      };

      await expect(updateProfile(profileData)).resolves.toBeUndefined();

      expect(mockFetch).toHaveBeenCalledWith('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
    });

    test('プロフィール更新でエラーが発生した場合、適切なエラーがスローされること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'プロフィールの更新に失敗しました' }),
      });

      const profileData = {
        name: 'テストユーザー',
        bio: 'テスト用の自己紹介',
        emailNotifications: true,
      };

      await expect(updateProfile(profileData)).rejects.toThrow(
        'プロフィールの更新に失敗しました'
      );
    });
  });

  describe('uploadProfileImage', () => {
    test('画像アップロードが成功すること', async () => {
      const mockImageUrl = '/uploads/avatars/test.jpg';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ imageUrl: mockImageUrl, success: true }),
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      const result = await uploadProfileImage(file);

      expect(result).toBe(mockImageUrl);
      expect(mockFetch).toHaveBeenCalledWith('/api/profile/avatar', {
        method: 'POST',
        body: expect.any(FormData),
      });
    }, 10000);

    test('画像アップロードでエラーが発生した場合、適切なエラーがスローされること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: '画像のアップロードに失敗しました' }),
      });

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      await expect(uploadProfileImage(file)).rejects.toThrow(
        '画像のアップロードに失敗しました'
      );
    }, 10000);
  });

  describe('deleteProfileImage', () => {
    test('画像削除が成功すること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await expect(deleteProfileImage()).resolves.toBeUndefined();

      expect(mockFetch).toHaveBeenCalledWith('/api/profile/avatar', {
        method: 'DELETE',
      });
    });

    test('画像削除でエラーが発生した場合、適切なエラーがスローされること', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: '画像の削除に失敗しました' }),
      });

      await expect(deleteProfileImage()).rejects.toThrow(
        '画像の削除に失敗しました'
      );
    });
  });
});
