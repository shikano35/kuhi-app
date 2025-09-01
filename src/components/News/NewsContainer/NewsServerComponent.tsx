import { NewsClientComponent } from './NewsClientComponent';
import { News } from '@/types/definitions/haiku';

// モックデータ
const mockNews: News[] = [
  {
    id: 1,
    title: 'くひめぐりβ版公開のお知らせ',
    content:
      'くひめぐりのβ版を公開いたしました。現在、全国の句碑データを順次追加中です。',
    published_at: '2025-08-01T00:00:00Z',
    created_at: '2025-08-01T00:00:00Z',
    updated_at: '2025-08-01T00:00:00Z',
    is_important: true,
    category: 'release',
  },
  {
    id: 2,
    title: '全国句碑データベース構築開始',
    content:
      '日本全国の句碑情報を収集・整理し、デジタルアーカイブとして提供開始いたします。',
    published_at: '2025-07-15T00:00:00Z',
    created_at: '2025-07-15T00:00:00Z',
    updated_at: '2025-07-15T00:00:00Z',
    is_important: false,
    category: 'update',
  },
  {
    id: 3,
    title: '句碑位置情報の精度向上について',
    content:
      'GPSデータの精度向上により、より正確な句碑の位置情報を提供できるようになりました。',
    published_at: '2025-07-01T00:00:00Z',
    created_at: '2025-07-01T00:00:00Z',
    updated_at: '2025-07-01T00:00:00Z',
    is_important: false,
    category: 'improvement',
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
