import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { beforeAll, vi } from 'vitest';
import { setProjectAnnotations } from '@storybook/experimental-nextjs-vite';
import * as projectAnnotations from './preview';
import React from 'react';

// Next.js Imageコンポーネントのモック
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return React.createElement('img', { src, alt, ...props });
  },
}));

// api-hooksのモック
vi.mock('@/lib/api-hooks', () => ({
  useUserFavorites: () => ({ data: { favorites: [] }, isLoading: false }),
  useAddFavorite: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useRemoveFavorite: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useHaikuList: () => ({
    data: { pages: [{ monuments: [], nextPage: null, totalCount: 0 }] },
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
    isError: false,
    error: null,
  }),
  usePoetsList: () => ({ data: [] }),
  useLocationsList: () => ({ data: [] }),
  useHaikuDetail: () => ({ data: null, isLoading: false }),
  useUserVisits: () => ({ data: { visits: [] }, isLoading: false }),
  useAddVisit: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useRemoveVisit: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
const project = setProjectAnnotations([
  a11yAddonAnnotations,
  projectAnnotations,
]);

beforeAll(project.beforeAll);
