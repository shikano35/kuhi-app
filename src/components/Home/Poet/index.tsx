import Image from 'next/image';
import Link from 'next/link';
import { Poet } from '@/types/haiku';
import { Button } from '@/components/ui/button';

const POETS: Poet[] = [
  {
    id: 1,
    name: '松尾芭蕉',
    biography:
      '滑稽や諧謔を主としていた俳諧を、蕉風と呼ばれる芸術性の極めて高い句風として確立し、後世では俳聖として世界的にも知られる、日本史上最高の俳諧師の一人',
    link_url:
      'https://ja.wikipedia.org/wiki/%E6%9D%BE%E5%B0%BE%E8%8A%AD%E8%95%89',
    image_url: '',
    created_at: '2025-05-11 15:56:40',
    updated_at: '2025-05-11 15:56:40',
  },
  {
    id: 2,
    name: '与謝蕪村',
    biography:
      '江戸時代中期の俳人、画家。松尾芭蕉と共に「蕉門の二大俊秀」と称され、日本の俳諧史上屈指の俳人である。',
    link_url:
      'https://ja.wikipedia.org/wiki/%E4%B8%8E%E8%AC%9D%E8%95%AA%E6%9D%91',
    image_url: '',
    created_at: '2025-05-11 15:56:40',
    updated_at: '2025-05-11 15:56:40',
  },
  {
    id: 3,
    name: '正岡子規',
    biography:
      '明治時代の俳人、歌人。俳句、短歌の革新に大きな影響を与えた。「写生」を重視し、近代俳句の祖と呼ばれる。',
    link_url:
      'https://ja.wikipedia.org/wiki/%E6%AD%A3%E5%B2%A1%E5%AD%90%E8%A6%8F',
    image_url: '',
    created_at: '2025-05-11 15:56:40',
    updated_at: '2025-05-11 15:56:40',
  },
  {
    id: 4,
    name: '高浜虚子',
    biography:
      '正岡子規の弟子で、「ホトトギス」を主宰。客観写生を重視した「花鳥諷詠」を提唱し、伝統俳句の基礎を築いた。',
    link_url:
      'https://ja.wikipedia.org/wiki/%E9%AB%98%E6%B5%9C%E8%99%9A%E5%AD%90',
    image_url: '',
    created_at: '2025-05-11 15:56:40',
    updated_at: '2025-05-11 15:56:40',
  },
];

export function PoetSection() {
  return (
    <section className="py-12 bg-muted">
      <Link className="block" href="/poets/{}">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            俳人で探す
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {POETS.map((poet) => (
              <div
                className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                key={poet.id}
              >
                <div className="relative h-48">
                  <Image
                    alt={poet.name}
                    className="object-cover bg-muted opacity-30"
                    fill
                    src={poet.image_url || '/images/poets/default.png'}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1">{poet.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {poet.biography}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Link>
      <div className="mt-8 text-center">
        <Button asChild className="rounded-full px-8 py-6 text-base">
          <Link href="/poets">すべての俳人を見る</Link>
        </Button>
      </div>
    </section>
  );
}
