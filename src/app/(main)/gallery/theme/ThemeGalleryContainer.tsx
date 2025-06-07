import ThemeGalleryClient from './ThemeGalleryClient';

type ThemeType = 'season' | 'region' | 'poet' | 'era';

type ThemeGalleryContainerProps = {
  theme?: ThemeType;
  query?: string;
  page?: number;
};

export default function ThemeGalleryContainer({
  theme = 'season',
  query = '春',
  page = 1,
}: ThemeGalleryContainerProps) {
  return (
    <ThemeGalleryClient
      initialPage={page}
      initialQuery={query}
      initialTheme={theme}
    />
  );
}
