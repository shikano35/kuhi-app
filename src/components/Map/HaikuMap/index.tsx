'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { MapFilter } from '../MapFilter';
import { HaikuInfoPanel } from '../HaikuInfoPanel';
import { HaikuMonument } from '@/types/haiku';
import { useQuery } from '@tanstack/react-query';
import { getAllHaikuMonuments } from '@/lib/api';
import { ChevronRight, X } from 'lucide-react';
import { useFilterStore } from '@/store/useFilterStore';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 36.2048,
  lng: 138.2529,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  scrollwheel: true,
  streetViewControl: false,
  fullscreenControl: true,
  mapTypeControl: true,
};

export function HaikuMap() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['haiku-monuments'],
    queryFn: () => getAllHaikuMonuments(),
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  });

  const {
    mapFilteredMonuments,
    setMapFilteredMonuments,
    mapSelectedRegion,
    mapSelectedPrefecture,
    mapSelectedPoet,
    mapSearchText,
  } = useFilterStore();

  const monuments = data || [];

  const [displayMonuments, setDisplayMonuments] = useState<HaikuMonument[]>([]);
  const [selectedMonument, setSelectedMonument] =
    useState<HaikuMonument | null>(null);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const mapRef = useRef<google.maps.Map | null>(null);
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

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerClick = (monument: HaikuMonument) => {
    setSelectedMonument(monument);
    setIsInfoPanelOpen(true);

    if (mapRef.current && monument.locations[0]) {
      mapRef.current.panTo({
        lat: monument.locations[0].latitude ?? 0,
        lng: monument.locations[0].longitude ?? 0,
      });
    }
  };

  const handleFilterChange = (filtered: HaikuMonument[]) => {
    setMapFilteredMonuments(filtered);
    setDisplayMonuments(filtered);
  };

  const handleCloseInfoPanel = () => {
    setIsInfoPanelOpen(false);
    setSelectedMonument(null);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  if (loadError) {
    return (
      <div className="p-4 text-center text-destructive">
        Google Mapsの読み込みに失敗しました
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {isLoading && (
        <div className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-background/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mb-3" />
            <p className="text-primary">地図データを読み込み中...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-50 border border-red-400 text-destructive px-4 py-2 rounded z-50">
          {error instanceof Error
            ? error.message
            : '句碑データの読み込み中にエラーが発生しました'}
        </div>
      )}

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
        {isLoaded ? (
          <GoogleMap
            center={center}
            mapContainerStyle={mapContainerStyle}
            onLoad={onLoad}
            options={mapOptions}
            zoom={6}
          >
            {displayMonuments.map((monument) => {
              const location = monument.locations[0];
              if (!location || !location.latitude || !location.longitude)
                return null;

              return (
                <Marker
                  key={monument.id}
                  onClick={() => handleMarkerClick(monument)}
                  position={{
                    lat: location.latitude,
                    lng: location.longitude,
                  }}
                  title={monument.inscription}
                />
              );
            })}
          </GoogleMap>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {selectedMonument && isInfoPanelOpen && (
        <div className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-background shadow-lg z-10 overflow-y-auto">
          <HaikuInfoPanel
            monument={selectedMonument}
            onClose={handleCloseInfoPanel}
          />
        </div>
      )}
    </div>
  );
}
