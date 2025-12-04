'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FilterIcon } from 'lucide-react';
import { useFilterStore } from '@/store/useFilterStore';
import { Poet, Location } from '@/types/definitions/haiku';

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
  'すべて',
];

type ListFilterProps = {
  poets?: Poet[];
  locations?: Location[];
};

export function ListFilter({ poets = [], locations = [] }: ListFilterProps) {
  const router = useRouter();

  const {
    listSearchText,
    listSelectedRegion,
    listSelectedPrefecture,
    listSelectedPoet,
    listPoetId,
    setListSearchText,
    setListSelectedRegion,
    setListSelectedPrefecture,
    setListSelectedPoet,
    resetListFilters,
  } = useFilterStore();

  const [filterVisible, setFilterVisible] = useState(false);

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

    if (listSearchText) {
      params.set('q', listSearchText);
    }
    if (listSelectedRegion !== 'すべて') {
      params.set('region', listSelectedRegion);
    }
    if (listSelectedPrefecture !== 'すべて') {
      params.set('prefecture', listSelectedPrefecture);
    }
    if (listPoetId) {
      params.set('poet_id', String(listPoetId));
    }

    const queryString = params.toString();
    router.push(`/list${queryString ? `?${queryString}` : ''}`);
  };

  const handleReset = () => {
    resetListFilters();
    router.push('/list');
  };

  const handlePoetChange = (poetName: string) => {
    const poet = poets.find((p) => p.name === poetName);
    setListSelectedPoet(poetName, poet?.id);
  };

  return (
    <div>
      <form
        className="flex flex-col md:flex-row gap-4 mb-4"
        onSubmit={handleSubmit}
        role="form"
      >
        <div className="flex-grow">
          <input
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:border-primary"
            onChange={(e) => setListSearchText(e.target.value)}
            placeholder="俳句、俳人、場所などで検索..."
            type="text"
            value={listSearchText}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
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
        <div className="bg-muted/50 p-4 rounded-md mb-4">
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
                  const region = e.target.value;
                  setListSelectedRegion(region);
                }}
                value={listSelectedRegion}
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
                onChange={(e) => setListSelectedPrefecture(e.target.value)}
                value={listSelectedPrefecture}
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
                onChange={(e) => handlePoetChange(e.target.value)}
                value={listSelectedPoet}
              >
                {poetNames.map((poet) => (
                  <option key={poet} value={poet}>
                    {poet}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-200 text-primary rounded-md hover:bg-gray-300 transition-colors"
              onClick={handleReset}
              type="button"
            >
              リセット
            </button>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              onClick={() => handleSubmit()}
              type="button"
            >
              この条件で絞り込む
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
