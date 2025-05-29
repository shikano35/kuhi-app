import { Metadata } from 'next';
import { getAllHaikuMonuments } from '@/lib/api';
import { baseMetadata } from '@/lib/metadata';
import { HaikuListView } from '@/components/List/HaikuListView';

export const metadata: Metadata = {
  ...baseMetadata,
  title: '俳句リスト | くひめぐり',
  description:
    '句碑に刻まれた日本の俳句をリスト形式で表示します。季節や作者で絞り込み、検索できます。',
};

export default async function HaikuPage() {
  const poems = await getAllHaikuMonuments();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">俳句リスト</h1>
      <HaikuListView poems={poems} />
    </div>
  );
}
