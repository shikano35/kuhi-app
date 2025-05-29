/**
 * プロフィール関連のAPI呼び出し関数
 */

export interface ProfileData {
  name: string;
  bio?: string;
  emailNotifications: boolean;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  emailNotifications: boolean | null;
}

/**
 * プロフィール情報を更新する
 */
export async function updateProfile(data: ProfileData): Promise<void> {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'プロフィールの更新に失敗しました');
  }
}

/**
 * プロフィール情報を取得する
 */
export async function getProfile(): Promise<UserProfile> {
  const response = await fetch('/api/profile');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'プロフィールの取得に失敗しました');
  }

  return response.json();
}

/**
 * プロフィール画像をアップロードする
 */
export async function uploadProfileImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/profile/avatar', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '画像のアップロードに失敗しました');
  }

  const result = await response.json();
  return result.imageUrl;
}

/**
 * プロフィール画像を削除する
 */
export async function deleteProfileImage(): Promise<void> {
  const response = await fetch('/api/profile/avatar', {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '画像の削除に失敗しました');
  }
}
