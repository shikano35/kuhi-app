import { Metadata } from 'next';
import { getAllPoets, getPoetById } from '@/lib/server-api';
import { BackButton } from '@/components/BackButton';
import { PoetDetailsContainer } from '@/components/Poet/PoetDetailsContainer';

export async function generateStaticParams() {
  try {
    const poets = await getAllPoets();
    return poets.map((poet) => ({
      id: poet.id.toString(),
    }));
  } catch (error) {
    console.error('Failed to generate static params for poets:', error);
    return [];
  }
}

type PoetPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PoetPageProps): Promise<Metadata> {
  const { id } = await params;
  const poetId = Number(id);

  const poet = await getPoetById(poetId);

  if (!poet) {
    return {
      title: '俳人が見つかりません | くひめぐり',
    };
  }

  return {
    title: `${poet.name} | くひめぐり`,
    description: poet.biography || `${poet.name}の句碑情報ページです。`,
  };
}

export default async function PoetPage({ params }: PoetPageProps) {
  const { id } = await params;
  const poetId = Number(id);

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="container mx-auto py-8 px-4">
        <BackButton fallbackUrl="/poets">一覧に戻る</BackButton>
        <PoetDetailsContainer poetId={poetId} />
      </div>
    </div>
  );
}
