import { Metadata } from 'next';
import { baseMetadata } from '@/lib/metadata';
import { PoetListContainer } from './_components/PoetListContainer';

export const metadata: Metadata = {
  ...baseMetadata,
  title: '俳人リスト | くひめぐり',
  description:
    '日本の句碑に関連する俳人のリストを表示します。俳人の生涯や作品について探索できます。',
};

export default function PoetsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">俳人リスト</h1>
      <PoetListContainer />
    </div>
  );
}
