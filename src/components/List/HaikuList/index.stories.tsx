import type { Meta, StoryObj } from '@storybook/react';
import { SessionProvider } from 'next-auth/react';
import { HaikuList } from './index';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/tanstack-query';

const meta = {
  title: 'Components/List/HaikuList',
  component: HaikuList,
  decorators: [
    (Story) => (
      <SessionProvider session={null}>
        <QueryClientProvider client={queryClient}>
          <div className="container mx-auto p-4">
            <Story />
          </div>
        </QueryClientProvider>
      </SessionProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/list',
        query: {},
      },
    },
  },
} satisfies Meta<typeof HaikuList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSearchQuery: Story = {};

export const FilteredByRegion: Story = {};

export const FilteredByPoet: Story = {};
