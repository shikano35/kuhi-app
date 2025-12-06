import { useEffect, useMemo } from 'react';
import { HaikuMonument } from '@/types/definitions/haiku';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardHeader } from '@/components/ui/card';
import { useFilterStore } from '@/store/useFilterStore';
import { useUserFavorites, useUserVisits } from '@/lib/api-hooks';
import { useSession } from 'next-auth/react';

type MapFilterProps = {
  monuments: HaikuMonument[];
  onFilterChange: (filteredMonuments: HaikuMonument[]) => void;
};

const REGIONS = [
  'すべて',
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

export function MapFilter({ monuments, onFilterChange }: MapFilterProps) {
  const { data: session } = useSession();
  const {
    mapSelectedRegion,
    mapSelectedPrefecture,
    mapSelectedPoet,
    mapSearchText,
    mapFilteredMonuments,
    mapShowFavoritesOnly,
    mapShowVisitedOnly,
    setMapSelectedRegion,
    setMapSelectedPrefecture,
    setMapSelectedPoet,
    setMapSearchText,
    setMapShowFavoritesOnly,
    setMapShowVisitedOnly,
    resetMapFilters,
  } = useFilterStore();

  const { data: userFavorites } = useUserFavorites();
  const { data: userVisits } = useUserVisits();

  const prefectures = useMemo(
    () => [
      'すべて',
      ...Array.from(
        new Set(
          monuments
            .filter((monument) => monument.locations[0]?.prefecture)
            .map((monument) => monument.locations[0].prefecture)
            .sort()
        )
      ),
    ],
    [monuments]
  );

  const poets = useMemo(
    () => [
      'すべて',
      ...Array.from(
        new Set(
          monuments
            .filter((monument) => monument.poets[0]?.name)
            .map((monument) => monument.poets[0].name)
            .sort()
        )
      ),
    ],
    [monuments]
  );

  const filteredMonuments = useMemo(() => {
    if (monuments.length === 0) return [];

    let filtered = [...monuments];

    if (mapSelectedRegion !== 'すべて') {
      filtered = filtered.filter(
        (monument) => monument.locations[0]?.region === mapSelectedRegion
      );
    }

    if (mapSelectedPrefecture !== 'すべて') {
      filtered = filtered.filter(
        (monument) =>
          monument.locations[0]?.prefecture === mapSelectedPrefecture
      );
    }

    if (mapSelectedPoet !== 'すべて') {
      filtered = filtered.filter(
        (monument) => monument.poets[0]?.name === mapSelectedPoet
      );
    }

    if (mapSearchText) {
      const searchLower = mapSearchText.toLowerCase();
      filtered = filtered.filter(
        (monument) =>
          monument.inscription.toLowerCase().includes(searchLower) ||
          monument.commentary?.toLowerCase().includes(searchLower) ||
          monument.poets[0]?.name.toLowerCase().includes(searchLower) ||
          monument.locations[0]?.place_name?.toLowerCase().includes(searchLower)
      );
    }

    if (mapShowFavoritesOnly || mapShowVisitedOnly) {
      const favoriteIds =
        userFavorites?.favorites?.map((fav) => fav.monument.id) || [];
      const visitedIds =
        userVisits?.visits?.map((visit) => visit.monument.id) || [];

      if (mapShowFavoritesOnly && mapShowVisitedOnly) {
        const combinedIds = [...new Set([...favoriteIds, ...visitedIds])];
        filtered = filtered.filter((monument) =>
          combinedIds.includes(monument.id)
        );
      } else if (mapShowFavoritesOnly) {
        filtered = filtered.filter((monument) =>
          favoriteIds.includes(monument.id)
        );
      } else if (mapShowVisitedOnly) {
        filtered = filtered.filter((monument) =>
          visitedIds.includes(monument.id)
        );
      }
    }

    return filtered;
  }, [
    monuments,
    mapSelectedRegion,
    mapSelectedPrefecture,
    mapSelectedPoet,
    mapSearchText,
    mapShowFavoritesOnly,
    mapShowVisitedOnly,
    userFavorites,
    userVisits,
  ]);

  useEffect(() => {
    onFilterChange(filteredMonuments);
  }, [filteredMonuments]);

  const handleRegionChange = (region: string) => {
    setMapSelectedRegion(region);
  };

  const handlePrefectureChange = (prefecture: string) => {
    setMapSelectedPrefecture(prefecture);
  };

  const handlePoetChange = (poet: string) => {
    setMapSelectedPoet(poet);
  };

  const handleSearchChange = (text: string) => {
    setMapSearchText(text);
  };

  const handleResetFilters = () => {
    resetMapFilters();
  };

  const displayCount = mapFilteredMonuments.length;
  const isFiltered =
    mapSelectedRegion !== 'すべて' ||
    mapSelectedPrefecture !== 'すべて' ||
    mapSelectedPoet !== 'すべて' ||
    mapSearchText ||
    mapShowFavoritesOnly ||
    mapShowVisitedOnly;

  return (
    <div className="h-full w-full min-w-80 flex flex-col">
      <CardHeader className="pb-2 pt-5 px-6">
        <h2 className="text-xl font-bold text-primary">句碑を絞り込む</h2>
      </CardHeader>

      <ScrollArea className="flex-1 px-6 pb-6">
        <div className="space-y-4 mb-6">
          <div>
            <label
              className="block text-sm font-medium my-2 text-primary"
              htmlFor="search"
            >
              キーワード検索
            </label>
            <Input
              className="w-full"
              id="search"
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="俳句、俳人、場所など"
              value={mapSearchText}
            />
          </div>
        </div>

        {session?.user && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={mapShowFavoritesOnly}
                id="favorites-only"
                onCheckedChange={(checked) =>
                  setMapShowFavoritesOnly(!!checked)
                }
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="favorites-only"
              >
                お気に入りのみ表示
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={mapShowVisitedOnly}
                id="visited-only"
                onCheckedChange={(checked) => setMapShowVisitedOnly(!!checked)}
              />
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="visited-only"
              >
                訪問済みのみ表示
              </label>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-12">
          <div>
            <label
              className="block text-sm font-medium mb-2 text-primary"
              htmlFor="region"
            >
              地域
            </label>
            <Select
              onValueChange={handleRegionChange}
              value={mapSelectedRegion}
            >
              <SelectTrigger className="w-full" id="region">
                <SelectValue placeholder="地域を選択" />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2 text-primary"
              htmlFor="prefecture"
            >
              都道府県
            </label>
            <Select
              onValueChange={handlePrefectureChange}
              value={mapSelectedPrefecture}
            >
              <SelectTrigger className="w-full" id="prefecture">
                <SelectValue placeholder="都道府県を選択" />
              </SelectTrigger>
              <SelectContent>
                {prefectures.map((prefecture) => (
                  <SelectItem key={prefecture} value={prefecture}>
                    {prefecture}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2 text-primary"
              htmlFor="poet"
            >
              俳人
            </label>
            <Select onValueChange={handlePoetChange} value={mapSelectedPoet}>
              <SelectTrigger className="w-full" id="poet">
                <SelectValue placeholder="俳人を選択" />
              </SelectTrigger>
              <SelectContent>
                {poets.map((poet) => (
                  <SelectItem key={poet} value={poet}>
                    {poet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleResetFilters}
          variant="outline"
        >
          フィルターをリセット
        </Button>

        <div className="mt-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            表示中:{' '}
            {monuments.length > 0
              ? isFiltered
                ? `${displayCount}件の句碑`
                : `${monuments.length}件の句碑`
              : '読込み中...'}
          </p>
        </div>
      </ScrollArea>
    </div>
  );
}
