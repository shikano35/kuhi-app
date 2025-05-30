import { HaikuListContainer } from '@/components/List/HaikuListContainer';
import { Metadata } from 'next';
import { baseMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...baseMetadata,
  title: '句碑リスト | くひめぐり',
  description:
    '日本全国の句碑をリストで表示します。地域や俳人で絞り込み、検索できます。',
};

type ListPageProps = {
  searchParams: Promise<{
    q?: string;
    region?: string;
    prefecture?: string;
    poet_id?: string;
  }>;
};

export default async function ListPage({ searchParams }: ListPageProps) {
  const params = await searchParams;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">句碑リスト</h1>
      <HaikuListContainer searchParams={params} />
    </div>
  );
}
