import { HeroSection } from '@/app/(main)/_components/Hero';
import { TodaysHaikuSection } from '@/app/(main)/_components/TodaysHaiku';
import { RegionalHaikuContainer } from '@/app/(main)/_components/RegionalHaikuContainer';
import { PickupSection } from '@/app/(main)/_components/PickupSection';
import { SearchSection } from '@/app/(main)/_components/Search';
import { PoetContainer } from '@/app/(main)/_components/PoetContainer';
import { HistorySection } from '@/app/(main)/_components/History';
import { OtherSection } from '@/app/(main)/_components/Other';
import { HomeHeader } from '@/layouts/Header';

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <HomeHeader />
      <HeroSection />
      <RegionalHaikuContainer />
      <PoetContainer />
      <SearchSection />
      <TodaysHaikuSection />
      <PickupSection />
      <HistorySection />
      <OtherSection />
    </main>
  );
}
