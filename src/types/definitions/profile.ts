/**
 * プロフィール関連の型定義
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
