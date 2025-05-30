import { Metadata } from 'next';
import { baseMetadata } from '@/lib/metadata';
import { NewsContainer } from '@/components/News/NewsContainer';

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'お知らせ一覧 | くひめぐり',
  description:
    'くひめぐりアプリからのお知らせやアップデート情報を一覧で確認できます。',
};

export default async function NewsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">お知らせ</h1>
      <NewsContainer />
    </div>
  );
}
