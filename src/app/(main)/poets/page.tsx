import { Metadata } from 'next';
import { getAllPoets } from '@/lib/api';
import { baseMetadata } from '@/lib/metadata';
import { PoetList } from '@/components/List/PoetList';

export const metadata: Metadata = {
  ...baseMetadata,
  title: '俳人リスト | くひめぐり',
  description:
    '日本の句碑に関連する俳人のリストを表示します。俳人の生涯や作品について探索できます。',
};

export default async function PoetsPage() {
  const poets = await getAllPoets();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">俳人リスト</h1>
      <PoetList poets={poets} />
    </div>
  );
}
