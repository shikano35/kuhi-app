import { Metadata } from 'next';
import { baseMetadata } from '@/lib/metadata';
import { NewsList } from '@/components/List/NewsList';
import { News } from '@/types/haiku';

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'お知らせ一覧 | くひめぐり',
  description:
    'くひめぐりアプリからのお知らせやアップデート情報を一覧で確認できます。',
};

const news: News[] = [
  // {
  //   id: 1,
  //   title: '句碑めぐりアプリリリースのお知らせ',
  //   content: '句碑めぐりWEBアプリが正式にリリースされました。日本全国の句碑情報を検索・閲覧できます。',
  //   published_at: '2025-05-20T10:00:00Z',
  //   created_at: '2025-05-19T15:30:00Z',
  //   updated_at: '2025-05-19T15:30:00Z',
  //   is_important: true,
  //   category: 'お知らせ'
  // },
  // {
  //   id: 2,
  //   title: '三重県の句碑データ追加完了',
  //   content: '三重県の句碑データの登録が完了しました。松尾芭蕉ゆかりの地を中心に、多数の句碑情報がご覧いただけます。',
  //   published_at: '2025-05-15T09:00:00Z',
  //   created_at: '2025-05-14T16:45:00Z',
  //   updated_at: '2025-05-14T16:45:00Z',
  //   category: 'データ更新'
  // },
  // {
  //   id: 3,
  //   title: 'アプリ機能更新のお知らせ',
  //   content: '地図機能が強化され、現在地からの距離でソートすることが可能になりました。また、お気に入り機能も追加されています。',
  //   published_at: '2025-05-10T14:30:00Z',
  //   created_at: '2025-05-09T11:20:00Z',
  //   updated_at: '2025-05-09T11:20:00Z',
  //   category: '機能更新'
  // },
  // {
  //   id: 4,
  //   title: 'メンテナンスのお知らせ',
  //   content: '2025年5月5日（月）午前2時〜6時まで、定期メンテナンスのためサービスがご利用いただけません。ご不便をおかけして申し訳ございません。',
  //   published_at: '2025-05-01T10:00:00Z',
  //   created_at: '2025-04-30T16:30:00Z',
  //   updated_at: '2025-04-30T16:30:00Z',
  //   is_important: true,
  //   category: 'メンテナンス'
  // },
  // {
  //   id: 5,
  //   title: '東北地方の句碑データ追加予定',
  //   content: '2025年6月中旬に、東北地方の句碑データを一括登録予定です。特に山形県の句碑情報が充実する予定です。',
  //   published_at: '2025-04-25T09:45:00Z',
  //   created_at: '2025-04-24T15:10:00Z',
  //   updated_at: '2025-04-24T15:10:00Z',
  //   category: 'お知らせ'
  // }
];

export default async function NewsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">お知らせ</h1>
      {news.length === 0 ? (
        <p className="text-center text-lg md:text-xl text-muted-foreground py-10">
          お知らせはありません
        </p>
      ) : (
        <NewsList news={news} />
      )}
    </div>
  );
}
