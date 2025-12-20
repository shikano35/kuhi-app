'use client';

import { useState } from 'react';
import { useInfiniteImageSearch } from '@/lib/japansearch-hooks';
import ImageGalleryClient from './ImageGalleryClient';

export default function ImageGalleryContainer() {
  const [searchQuery, setSearchQuery] = useState('桜');

  const imageSearchQuery = useInfiniteImageSearch(searchQuery);

  const handleSearchChange = (newQuery: string) => {
    setSearchQuery(newQuery);
  };

  return (
    <ImageGalleryClient
      currentQuery={searchQuery}
      imageSearchQuery={imageSearchQuery}
      onSearchChange={handleSearchChange}
    />
  );
}
