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

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
const project = setProjectAnnotations([
  a11yAddonAnnotations,
  projectAnnotations,
]);

beforeAll(project.beforeAll);
