import { Metadata } from 'next';
import { getHaikuMonumentById, getAllHaikuMonuments } from '@/lib/api';
import { MonumentDetail } from '@/components/Monument/MonumentDetail';

export async function generateStaticParams() {
  try {
    const monuments = await getAllHaikuMonuments();
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
  const monument = await getHaikuMonumentById(Number(id));

  if (!monument) {
    return {
      title: '句碑が見つかりません | くひめぐり',
    };
  }

  const poetName = monument.poets[0]?.name || '不明';

  return {
    title: `${monument.inscription.slice(0, 20)}${monument.inscription.length > 20 ? '...' : ''} - ${poetName} | くひめぐり`,
    description: monument.commentary || '句碑の詳細情報ページです。',
  };
}

export default async function MonumentPage({ params }: MonumentPageProps) {
  const { id } = await params;

  return <MonumentDetail monumentId={Number(id)} />;
}
