import { NewsClientComponent } from './NewsClientComponent';
import { getNews } from '@/lib/server-api';

export async function NewsServerComponent() {
  try {
    const news = await getNews();

    return <NewsClientComponent initialNews={news} />;
  } catch (error) {
    console.error('Error loading news data:', error);

    return <NewsClientComponent initialNews={[]} />;
  }
}
