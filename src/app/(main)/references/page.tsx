import { Metadata } from 'next';
import { baseMetadata } from '@/lib/metadata';
import { SourcesContainer } from './_components/SourcesContainer';

export const metadata: Metadata = {
  ...baseMetadata,
  title: '関連文献・参考文献 | くひめぐり',
  description:
    '句碑情報の出典となる関連文献や参考書籍などの情報を提供しています。',
};

export default function ReferencesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">関連文献・参考文献</h1>
      <SourcesContainer />
    </div>
  );
}
