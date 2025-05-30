import { HeroSection } from '@/components/Home/Hero';
import { RegionalHaikuContainer } from '@/components/Home/RegionalHaikuContainer';
import { SearchSection } from '@/components/Home/Search';
import { PoetContainer } from '@/components/Home/PoetContainer';
import { HistorySection } from '@/components/Home/History';
import { OtherSection } from '@/components/Home/Other';
import { HomeHeader } from '@/layouts/Header';

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <HomeHeader />
      <HeroSection />
      <RegionalHaikuContainer />
      <PoetContainer />
      <SearchSection />
      <HistorySection />
      <OtherSection />
    </main>
  );
}
