import { Metadata } from 'next';
import { getMonuments } from '@/lib/kuhi-api';
import { baseMetadata } from '@/lib/metadata';
import { HaikuListView } from '@/components/List/HaikuListView';
import { mapMonumentsToHaikuMonuments } from '@/lib/api-mappers';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  ...baseMetadata,
  title: '俳句リスト | くひめぐり',
  description:
    '句碑に刻まれた日本の俳句をリスト形式で表示します。季節や作者で絞り込み、検索できます。',
};

export default async function HaikuPage() {
  try {
    const monuments = await getMonuments({ limit: 50 });
    const poems = mapMonumentsToHaikuMonuments(monuments);

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">俳句リスト</h1>
        <HaikuListView poems={poems} />
      </div>
    );
  } catch {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">俳句リスト</h1>
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">データの取得に失敗しました</p>
          <p className="text-muted-foreground">
            しばらく時間をおいてから再度お試しください。
          </p>
        </div>
      </div>
    );
  }
}
