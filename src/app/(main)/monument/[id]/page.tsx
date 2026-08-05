import { Metadata } from 'next';
import { getMonumentById } from '@/lib/kuhi-api';
import { MonumentDetailContainer } from '@/app/(main)/monument/_components/MonumentDetailContainer';

export const dynamic = 'force-dynamic';

type MonumentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: MonumentPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const monument = await getMonumentById(Number(id));

    if (!monument) {
      return {
        title: '句碑が見つかりません | くひめぐり',
      };
    }

    const poetName =
      monument.poets && monument.poets.length > 0
        ? monument.poets[0].name
        : '不明';
    const inscription =
      monument.inscriptions && monument.inscriptions.length > 0
        ? monument.inscriptions[0].original_text ||
          monument.inscriptions[0].transliteration ||
          ''
        : '';

    return {
      title: `${inscription.slice(0, 20)}${inscription.length > 20 ? '...' : ''} - ${poetName} | くひめぐり`,
      description: '句碑の詳細情報ページです。',
    };
  } catch (error) {
    console.error('Failed to generate metadata for monument:', error);
    return {
      title: '句碑詳細 | くひめぐり',
      description: '句碑の詳細情報ページです。',
    };
  }
}

export default async function MonumentPage({ params }: MonumentPageProps) {
  const { id } = await params;

  return <MonumentDetailContainer monumentId={Number(id)} />;
}
