import { Metadata } from 'next';
import {
  getMonumentById,
  getAllMonumentsFromInscriptions,
} from '@/lib/kuhi-api';
import { MonumentDetailContainer } from '@/components/Monument/MonumentDetailContainer';
import type { MonumentWithRelations } from '@/types/definitions/api';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    console.log('静的パラメータ生成: 句碑データ取得中...');

    let monuments: MonumentWithRelations[] = [];
    try {
      monuments = await getAllMonumentsFromInscriptions();
      console.log(`静的パラメータ用データ取得: ${monuments.length}件`);
    } catch (error) {
      console.error('句碑データの取得に失敗:', error);
      monuments = [];
    }

    return monuments.map((monument) => ({
      id: monument.id.toString(),
    }));
  } catch (error) {
    console.error('Failed to generate static params for monuments:', error);
    return [];
  }
}

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
