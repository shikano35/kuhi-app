import { render, screen } from '@testing-library/react';
import { HaikuCard } from './index';
import { mockHaikuMonuments } from '@/mocks/data/haiku-monuments';
import { describe, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// api-hooksのモック
vi.mock('@/lib/api-hooks', () => ({
  useUserFavorites: () => ({ data: { favorites: [] }, isLoading: false }),
  useAddFavorite: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useRemoveFavorite: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img alt={alt} data-testid="next-image" src={src} />
  ),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a data-testid="next-link" href={href}>
      {children}
    </a>
  ),
}));

describe('HaikuCard', () => {
  const testMonument = mockHaikuMonuments[0];
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  test('句碑情報を正しく表示すること', () => {
    renderWithProvider(<HaikuCard monument={testMonument} />);

    // 俳句が表示されることを確認
    expect(screen.getByText(testMonument.inscription)).toBeInTheDocument();

    // 俳人名が表示されることを確認
    expect(screen.getByText(testMonument.poets[0].name)).toBeInTheDocument();

    // 場所情報が表示されることを確認
    const location = testMonument.locations[0];
    expect(
      screen.getByText(`${location.prefecture} ${location.municipality}`)
    ).toBeInTheDocument();

    // 画像が正しく表示されることを確認
    const image = screen.getByTestId('next-image');
    expect(image).toHaveAttribute('src', testMonument.photo_url);

    // リンクが正しいURLを指していることを確認
    const link = screen.getByTestId('next-link');
    expect(link).toHaveAttribute('href', `/monument/${testMonument.id}`);
  });

  test('写真URLがない場合はプレースホルダー画像を使用すること', () => {
    const monumentWithoutPhoto = {
      ...testMonument,
      photo_url: null,
    };

    renderWithProvider(<HaikuCard monument={monumentWithoutPhoto} />);

    const placeholderText = screen.getByText(/写真がありません/);
    expect(placeholderText).toBeInTheDocument();
  });

  test('長い俳句は省略されて表示されること', () => {
    const longInscriptionMonument = {
      ...testMonument,
      inscription:
        '古池や蛙飛び込む水の音春の海終日のたりのたりかな閑さや岩にしみ入る蝉の声これは非常に長い俳句の例です',
    };

    renderWithProvider(<HaikuCard monument={longInscriptionMonument} />);

    // 省略されたテキストが含まれているか確認
    const displayedText =
      screen.getByText(/古池や蛙飛び込む水の音春の海終日のたり/);
    expect(displayedText).toBeInTheDocument();
    expect(displayedText).toHaveTextContent(/\.\.\.$/); // 省略記号で終わることを確認
  });
});
