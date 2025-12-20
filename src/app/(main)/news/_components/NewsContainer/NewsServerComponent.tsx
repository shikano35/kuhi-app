import { NewsClientComponent } from './NewsClientComponent';
import { News } from '@/types/definitions/haiku';

const mockNews: News[] = [
  {
    id: 1,
    title: 'くひめぐりβ版公開のお知らせ',
    content:
      'くひめぐりのβ版を公開いたしました。現在、全国の句碑データを順次追加中です。',
    published_at: '2025-09-02T00:00:00Z',
    created_at: '2025-09-02T00:00:00Z',
    updated_at: '2025-09-02T00:00:00Z',
    is_important: false,
    category: 'release',
  },
];

export async function NewsServerComponent() {
  try {
    const news = mockNews;

    return <NewsClientComponent initialNews={news} />;
  } catch {
    return <NewsClientComponent initialNews={[]} />;
  }
}
