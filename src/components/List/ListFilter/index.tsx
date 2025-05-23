'use client';

import { useState, useEffect } from 'react';
import { useRouter as useNextRouter } from 'next/navigation';
import { usePoetsList, useLocationsList } from '@/lib/api-hooks';
import { FilterIcon } from 'lucide-react';

type ListFilterProps = {
  searchParams: {
    q?: string;
    region?: string;
    prefecture?: string;
    poet_id?: string;
    filter?: string;
    view?: string;
  };
};

const REGIONS = [
  '北海道',
  '東北',
  '関東',
  '中部',
  '近畿',
  '中国',
  '四国',
  '九州・沖縄',
  'すべて',
];

type RouterType = {
  push: (url: string) => void;
};

const useRouter = (): RouterType => {
  try {
    return useNextRouter();
  } catch (e) {
    return {
      push: (url: string) => console.log('Router push:', url, e),
    };
  }
};

export function ListFilter({ searchParams }: ListFilterProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>(searchParams.q || '');
  const [selectedRegion, setSelectedRegion] = useState<string>(
    searchParams.region || 'すべて'
  );
  const [selectedPrefecture, setSelectedPrefecture] = useState<string>(
    searchParams.prefecture || 'すべて'
  );
  const [selectedPoet, setSelectedPoet] = useState<string>('すべて');
  const [filterVisible, setFilterVisible] = useState<boolean>(false);

  const { data: poets = [] } = usePoetsList();
  const { data: locations = [] } = useLocationsList();

  useEffect(() => {
    setSearchText(searchParams.q || '');
    setSelectedRegion(searchParams.region || 'すべて');
    setSelectedPrefecture(searchParams.prefecture || 'すべて');

    if (searchParams.poet_id) {
      const poetId = Number(searchParams.poet_id);
      const poet = poets.find((p) => p.id === poetId);
      if (poet) {
        setSelectedPoet(poet.name);
      }
    } else {
      setSelectedPoet('すべて');
    }
  }, [searchParams, poets]);

  const prefectures = [
    'すべて',
    ...Array.from(
      new Set(
        locations
          .map((location) => location.prefecture)
          .filter((prefecture): prefecture is string => !!prefecture)
          .sort()
      )
    ),
  ];

  const poetNames = [
    'すべて',
    ...poets
      .map((poet) => poet.name)
      .filter((name): name is string => !!name)
      .sort(),
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    const params = new URLSearchParams();

    if (searchText) {
      params.set('q', searchText);
    }
    if (selectedRegion !== 'すべて') {
      params.set('region', selectedRegion);
    }
    if (selectedPrefecture !== 'すべて') {
      params.set('prefecture', selectedPrefecture);
    }
    if (selectedPoet !== 'すべて') {
      const poet = poets.find((p) => p.name === selectedPoet);
      if (poet) {
        params.set('poet_id', String(poet.id));
      }
    }

    const queryString = params.toString();
    router.push(`/list${queryString ? `?${queryString}` : ''}`);
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedRegion('すべて');
    setSelectedPrefecture('すべて');
    setSelectedPoet('すべて');
    router.push('/list');
  };

  return (
    <div>
      <form
        className="flex flex-col md:flex-row gap-4 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="flex-grow">
          <input
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:border-primary"
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="俳句、俳人、場所などで検索..."
            type="text"
            value={searchText}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary transition-colors"
            type="submit"
          >
            検索
          </button>
          <button
            className="px-4 py-2 bg-gray-100 text-primary rounded-md hover:bg-gray-300 transition-colors flex items-center"
            onClick={() => setFilterVisible(!filterVisible)}
            type="button"
          >
            <FilterIcon className="h-5 w-5 mr-1" />
            絞り込み
          </button>
        </div>
      </form>

      {filterVisible && (
        <div className="bg-muted p-4 rounded-md mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-primary mb-1"
                htmlFor="region"
              >
                地域
              </label>
              <select
                className="w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                id="region"
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  if (e.target.value !== selectedRegion) {
                    setSelectedPrefecture('すべて');
                  }
                }}
                value={selectedRegion}
              >
                {REGIONS.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-primary mb-1"
                htmlFor="prefecture"
              >
                都道府県
              </label>
              <select
                className="w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                id="prefecture"
                onChange={(e) => setSelectedPrefecture(e.target.value)}
                value={selectedPrefecture}
              >
                {prefectures.map((prefecture) => (
                  <option key={prefecture} value={prefecture}>
                    {prefecture}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-primary mb-1"
                htmlFor="poet"
              >
                俳人
              </label>
              <select
                className="w-full px-3 py-2 bg-background border border-border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                id="poet"
                onChange={(e) => setSelectedPoet(e.target.value)}
                value={selectedPoet}
              >
                {poetNames.map((poet) => (
                  <option key={poet} value={poet}>
                    {poet}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 bg-gray-200 text-primary rounded-md hover:bg-gray-300 transition-colors mr-2"
              onClick={handleReset}
              type="button"
            >
              リセット
            </button>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary transition-colors"
              onClick={() => handleSubmit()}
              type="button"
            >
              適用
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
