import type { Meta, StoryObj } from '@storybook/react';
import { ProfileSettings } from './index';

const meta = {
  title: 'Components/Profile/ProfileSettings',
  component: ProfileSettings,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProfileSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockUser = {
  id: 'test-user-id',
  name: 'テストユーザー',
  email: 'test@example.com',
  image: null,
  bio: 'こんにちは！俳句と句碑が大好きです。日本各地の句碑を巡って、俳人たちの足跡を辿ることが趣味です。',
  emailNotifications: true,
};

const mockUserWithImage = {
  ...mockUser,
  image: '/images/sample-avatar.jpg',
};

export const Default: Story = {
  args: {
    user: mockUser,
  },
};

export const WithProfileImage: Story = {
  args: {
    user: mockUserWithImage,
  },
};

export const WithLongBio: Story = {
  args: {
    user: {
      ...mockUser,
      bio: '俳句と句碑に魅せられて早20年。日本全国の句碑を巡る旅を続けています。特に松尾芭蕉、与謝蕪村、正岡子規の句碑を中心に研究しており、これまでに500以上の句碑を訪れました。俳句の世界観と句碑が設置された場所の風景が織りなす美しさに感動し、その魅力を多くの人に伝えたいと思っています。',
    },
  },
};

export const WithoutNotifications: Story = {
  args: {
    user: {
      ...mockUser,
      emailNotifications: false,
    },
  },
};

export const MinimalProfile: Story = {
  args: {
    user: {
      id: 'minimal-user',
      name: 'ミニマルユーザー',
      email: 'minimal@example.com',
      image: null,
      bio: '',
      emailNotifications: false,
    },
  },
};
