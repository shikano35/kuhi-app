'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { MapFilter } from '../MapFilter';
import { HaikuInfoPanel } from '../HaikuInfoPanel/index';
import { HaikuMonument } from '@/types/definitions/haiku';
import { ChevronRight, X } from 'lucide-react';
import { useFilterStore } from '@/store/useFilterStore';

const Map = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  ),
});

type MapClientComponentProps = {
  initialMonuments: HaikuMonument[];
};

export function MapClientComponent({
  initialMonuments,
}: MapClientComponentProps) {
  const {
    mapFilteredMonuments,
    setMapFilteredMonuments,
    mapSelectedRegion,
    mapSelectedPrefecture,
    mapSelectedPoet,
    mapSearchText,
  } = useFilterStore();

  const monuments = useMemo(() => initialMonuments || [], [initialMonuments]);

  const [displayMonuments, setDisplayMonuments] = useState<HaikuMonument[]>([]);
  const [selectedMonument, setSelectedMonument] =
    useState<HaikuMonument | null>(null);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (monuments.length === 0) return;

    if (!isInitialized.current) {
      isInitialized.current = true;
      setDisplayMonuments(monuments);

      if (mapFilteredMonuments.length === 0) {
        setMapFilteredMonuments(monuments);
      }
    }

    if (
      mapFilteredMonuments.length > 0 ||
      mapSelectedRegion !== 'すべて' ||
      mapSelectedPrefecture !== 'すべて' ||
      mapSelectedPoet !== 'すべて' ||
      mapSearchText
    ) {
      setDisplayMonuments(mapFilteredMonuments);
    }
  }, [
    monuments,
    mapFilteredMonuments,
    mapSelectedRegion,
    mapSelectedPrefecture,
    mapSelectedPoet,
    mapSearchText,
    setMapFilteredMonuments,
  ]);

  const handleMarkerClick = (monument: HaikuMonument) => {
    setSelectedMonument(monument);
    setIsInfoPanelOpen(true);
  };

  const handleFilterChange = useCallback(
    (filtered: HaikuMonument[]) => {
      setMapFilteredMonuments(filtered);
      setDisplayMonuments(filtered);
    },
    [setMapFilteredMonuments]
  );

  const handleCloseInfoPanel = () => {
    setIsInfoPanelOpen(false);
    setSelectedMonument(null);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="relative w-full h-screen">
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-background shadow-lg z-10 transition-all duration-300 overflow-hidden ${
          isFilterOpen ? 'w-80' : 'w-0'
        }`}
      >
        <MapFilter monuments={monuments} onFilterChange={handleFilterChange} />
      </div>

      <button
        className={`fixed top-20 z-10 bg-background p-2 rounded-md transition-all duration-300 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 ${
          isFilterOpen ? 'left-64' : 'left-4 shadow-md'
        }`}
        onClick={toggleFilter}
      >
        {isFilterOpen ? (
          <X className="size-5" />
        ) : (
          <ChevronRight className="size-5" />
        )}
      </button>

      <div className="fixed inset-0">
        <Map monuments={displayMonuments} onMarkerClick={handleMarkerClick} />
      </div>

      {selectedMonument && isInfoPanelOpen && (
        <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-96 bg-background shadow-lg z-10 overflow-y-auto">
          <HaikuInfoPanel
            monument={selectedMonument}
            onClose={handleCloseInfoPanel}
          />
        </div>
      )}
    </div>
  );
}
