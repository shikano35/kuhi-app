'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HaikuCard } from '@/components/shared/HaikuCard';
import { HaikuMonument } from '@/types/haiku';
import { Button } from '@/components/ui/button';

const REGIONS = [
  '北海道',
  '東北',
  '関東甲信',
  '東海',
  '北陸',
  '近畿',
  '中国',
  '四国',
  '九州',
  '沖縄',
];

const SAMPLE_HAIKU_MONUMENTS: HaikuMonument[] = [
  {
    id: 1,
    inscription: '冬牡丹千鳥よ雪のほととぎす',
    commentary:
      'この句は、「野ざらし紀行」の旅の折、貞亨元年の晩秋に大垣の俳人木因と共に本統寺第三世大谷琢恵（俳号古益）に招かれた際、一夜を過ごして詠んだといわれている',
    kigo: '冬牡丹,千鳥,雪,ほととぎす',
    season: '冬',
    is_reliable: true,
    has_reverse_inscription: true,
    material: null,
    total_height: null,
    width: null,
    depth: null,
    established_date: '昭和12年4月',
    established_year: '1937-4',
    founder: '小林雨月',
    monument_type: '句碑',
    designation_status: null,
    photo_url: '/images/monuments/sample1.jpg',
    photo_date: null,
    photographer: null,
    model_3d_url: null,
    remarks: null,
    created_at: '2025-05-11 16:02:33',
    updated_at: '2025-05-11 16:02:33',
    poet_id: 1,
    source_id: 1,
    location_id: 1,
    poets: [
      {
        id: 1,
        name: '松尾芭蕉',
        biography:
          '滑稽や諧謔を主としていた俳諧を、蕉風と呼ばれる芸術性の極めて高い句風として確立し、後世では俳聖として世界的にも知られる、日本史上最高の俳諧師の一人',
        link_url:
          'https://ja.wikipedia.org/wiki/%E6%9D%BE%E5%B0%BE%E8%8A%AD%E8%95%89',
        image_url: '/images/poets/basho.jpg',
        created_at: '2025-05-11 15:56:40',
        updated_at: '2025-05-11 15:56:40',
      },
    ],
    sources: [
      {
        id: 1,
        title: '俳句のくに・三重',
        author: '三重県庁',
        publisher: '三重県庁',
        source_year: 2011,
        url: 'https://www.bunka.pref.mie.lg.jp/haiku/',
        created_at: '2025-05-11 15:54:14',
        updated_at: '2025-05-11 15:54:14',
      },
    ],
    locations: [
      {
        id: 1,
        prefecture: '三重県',
        region: '東海',
        municipality: '桑名市',
        address: '桑名市北寺町47',
        place_name: '本統寺',
        latitude: 35.065502,
        longitude: 136.692193,
      },
    ],
  },
];

export function RegionalHaikuSection() {
  const [activeRegion, setActiveRegion] = useState<string>('関東');
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const filteredMonuments = SAMPLE_HAIKU_MONUMENTS.filter(
    (monument) => monument.locations[0]?.region === activeRegion
  );

  return (
    <section className="py-32">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-primary">
          地域で探す
        </h2>

        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {REGIONS.map((region) => (
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeRegion === region
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-input'
              }`}
              key={region}
              onClick={() => setActiveRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {filteredMonuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMonuments.slice(0, 6).map((monument) => (
                  <HaikuCard key={monument.id} monument={monument} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  この地域の句碑データはまだありません。
                </p>
              </div>
            )}

            {filteredMonuments.length > 6 && (
              <div className="text-center mt-8">
                <Button asChild className="rounded-full px-8 py-6 text-base">
                  <Link href={`/list?region=${activeRegion}`}>もっと見る</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
