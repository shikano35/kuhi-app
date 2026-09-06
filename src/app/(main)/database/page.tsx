import { Metadata } from 'next';
import { baseMetadata } from '@/lib/metadata';
import { notoSerifJP } from '@/lib/fonts-reading';
import { DatabaseStatsContainer } from './_components/DatabaseStatsContainer';
import { DatabaseFaq } from './_components/DatabaseFaq';

export const revalidate = 3600;

export const metadata: Metadata = {
  ...baseMetadata,
  title: 'このデータベースについて | くひめぐり',
  description:
    'くひめぐりが収録している句碑データを、CSVとJSON Linesで配布しています。',
};

export default function DatabasePage() {
  return (
    <div
      className={`${notoSerifJP.variable} font-serif-reading container mx-auto py-10 md:py-16 px-4`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="font-shippori-mincho text-3xl md:text-4xl mb-10 md:mb-14 text-center">
          データベースについて
        </h1>

        <DatabaseStatsContainer />

        <section className="mt-20">
          <h2 className="font-shippori-mincho text-2xl text-center mb-10">
            よくある質問
          </h2>
          <DatabaseFaq />
        </section>
      </div>
    </div>
  );
}
