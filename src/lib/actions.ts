'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { auth } from './auth';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export interface ContributionData {
  id: string;
  created_at: string;
  title: string;
  content: string;
  location: string;
  prefecture: string;
  status: 'pending' | 'approved' | 'rejected';
  latitude?: string | null;
  longitude?: string | null;
  photo_url?: string | null;
  name?: string | null;
  email?: string | null;
}

export async function submitContribution(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    return { error: 'ログインが必要です' };
  }

  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const prefecture = formData.get('prefecture') as string;
    const location = formData.get('location') as string;
    const latitude = (formData.get('latitude') as string) || null;
    const longitude = (formData.get('longitude') as string) || null;
    const photo = formData.get('photo') as File;

    if (!title || !content || !prefecture || !location) {
      return { error: '必須項目が入力されていません' };
    }

    if (photo && photo.size > 10 * 1024 * 1024) {
      return { error: '画像は10MBを超えることはできません。' };
    }

    // 投稿数のカウント
    const { count } = await supabaseAdmin
      .from('contributions')
      .select('id', { count: 'exact' })
      .eq('user_id', session.user.id)
      .gte(
        'created_at',
        new Date(new Date().setHours(0, 0, 0, 0)).toISOString()
      );

    if (count !== null && count >= 50) {
      return { error: '1日あたりの投稿上限に達しました。' };
    }

    let photoUrl = null;

    // 写真がある場合はアップロード
    if (photo && photo.size > 0) {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('contribution-photos')
        .upload(fileName, photo);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabaseAdmin.storage
        .from('contribution-photos')
        .getPublicUrl(fileName);

      photoUrl = urlData.publicUrl;
    }

    // 投稿データをデータベースに保存
    const { error: insertError } = await supabaseAdmin
      .from('contributions')
      .insert([
        {
          id: crypto.randomUUID(),
          name: session.user.name,
          email: session.user.email,
          title: title,
          content: content,
          prefecture: prefecture,
          location: location,
          latitude: latitude,
          longitude: longitude,
          photo_url: photoUrl,
          status: 'pending',
        },
      ]);

    if (insertError) throw insertError;

    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('投稿エラー:', err);
    return { error: '投稿中にエラーが発生しました。もう一度お試しください。' };
  }
}

export async function getContributions() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    return { error: '権限がありません' };
  }

  try {
    // RLSをバイパス
    const { data, error } = await supabaseAdmin
      .from('contributions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data: data as ContributionData[] };
  } catch (err) {
    console.error('投稿データの取得エラー:', err);
    return { error: '投稿データの読み込み中にエラーが発生しました' };
  }
}

export async function updateContributionStatus(
  id: string,
  status: 'approved' | 'rejected'
) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    return { error: '権限がありません' };
  }

  try {
    // RLSをバイパス
    const { error } = await supabaseAdmin
      .from('contributions')
      .update({ status })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('投稿ステータス更新エラー:', err);
    return { error: 'ステータスの更新中にエラーが発生しました' };
  }
}
