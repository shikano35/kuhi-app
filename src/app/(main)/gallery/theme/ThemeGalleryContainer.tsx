import {
  searchBySeason,
  searchByRegion,
  searchByTheme,
  searchByEra,
  type JapanSearchItem,
} from '@/lib/japansearch';
import { ThemeGalleryClient } from './ThemeGalleryClient';

type ThemeType = 'season' | 'region' | 'poet' | 'era';

type ThemeGalleryContainerProps = {
  theme?: ThemeType;
  query?: string;
  page?: number;
};

export async function ThemeGalleryContainer({
  theme = 'season',
  query = '春',
  page = 1,
}: ThemeGalleryContainerProps) {
  const ITEMS_PER_PAGE = 50;

  let initialResults: JapanSearchItem[] = [];
  let error = null;

  try {
    switch (theme) {
      case 'season':
        initialResults = await searchBySeason(query, ITEMS_PER_PAGE, page);
        break;
      case 'region':
        initialResults = await searchByRegion(query, ITEMS_PER_PAGE, page);
        break;
      case 'poet':
        initialResults = await searchByTheme(
          'poet',
          query,
          ITEMS_PER_PAGE,
          page
        );
        break;
      case 'era':
        initialResults = await searchByEra(query, ITEMS_PER_PAGE, page);
        break;
    }
  } catch (err) {
    console.error('初期データ取得エラー:', err);
    error = 'データの取得に失敗しました';
  }

  return (
    <ThemeGalleryClient
      error={error}
      initialPage={page}
      initialQuery={query}
      initialResults={initialResults}
      initialTheme={theme}
    />
  );
}
