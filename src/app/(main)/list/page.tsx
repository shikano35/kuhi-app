import { HaikuList } from '@/components/List/HaikuList';
import { Metadata } from 'next';
import { baseMetadata } from '@/lib/metadata';

export const metadata: Metadata = {
  ...baseMetadata,
  title: '句碑リスト | くひめぐり',
  description:
    '日本全国の句碑をリストで表示します。地域や俳人で絞り込み、検索できます。',
};

interface ListPageProps {
  searchParams: {
    q?: string;
    region?: string;
    prefecture?: string;
    poet_id?: string;
    filter?: string;
    view?: string;
  };
}

export default async function ListPage({ searchParams }: ListPageProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">句碑リスト</h1>
      <HaikuList searchParams={searchParams} />
    </div>
  );
}
