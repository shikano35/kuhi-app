import { unstable_cache } from 'next/cache';
import {
  getAllHaikuMonuments as _getAllHaikuMonuments,
  getAllPoets as _getAllPoets,
  getPoetByIdOld as _getPoetById,
  getAllLocations as _getAllLocations,
  getHaikuMonumentById as _getHaikuMonumentById,
  getHaikuMonumentsByPoet as _getHaikuMonumentsByPoet,
  getAllSources as _getAllSources,
  getAllNews as _getAllNews,
} from './api';
import {
  getUserFavoritesServer as _getUserFavorites,
  getUserVisitsServer as _getUserVisits,
} from './server-user-api';
import {
  HaikuMonument,
  Poet,
  Location,
  GetUserFavoritesResponse,
  GetUserVisitsResponse,
  News,
  Source,
} from '@/types/definitions/haiku';

export const getAllHaikuMonuments = unstable_cache(
  async (params?: {
    limit?: number;
    search?: string;
    region?: string;
    prefecture?: string;
  }): Promise<HaikuMonument[]> => {
    return _getAllHaikuMonuments(params);
  },
  ['haiku-monuments'],
  {
    revalidate: 60 * 60,
    tags: ['haiku-monuments'],
  }
);

export const getAllPoets = unstable_cache(
  async (): Promise<Poet[]> => {
    return _getAllPoets();
  },
  ['poets'],
  {
    revalidate: 60 * 60,
    tags: ['poets'],
  }
);

export const getPoetById = unstable_cache(
  async (id: number): Promise<Poet | null> => {
    return _getPoetById(id);
  },
  ['poet-by-id'],
  {
    revalidate: 60 * 60,
    tags: ['poets'],
  }
);

export const getAllLocations = unstable_cache(
  async (): Promise<Location[]> => {
    return _getAllLocations();
  },
  ['locations'],
  {
    revalidate: 60 * 60,
    tags: ['locations'],
  }
);

export const getAllSources = unstable_cache(
  async (): Promise<Source[]> => {
    return _getAllSources();
  },
  ['sources'],
  {
    revalidate: 60 * 60 * 24,
    tags: ['sources'],
  }
);

export const getHaikuMonumentById = unstable_cache(
  async (id: number): Promise<HaikuMonument | null> => {
    return _getHaikuMonumentById(id);
  },
  ['haiku-monument'],
  {
    revalidate: 60 * 60,
    tags: ['haiku-monument'],
  }
);

export const getHaikuMonumentsByPoet = unstable_cache(
  async (poetId: number): Promise<HaikuMonument[]> => {
    return _getHaikuMonumentsByPoet(poetId);
  },
  ['haiku-monuments-by-poet'],
  {
    revalidate: 60 * 60,
    tags: ['haiku-monuments', 'poets'],
  }
);

export const getUserFavorites = unstable_cache(
  async (): Promise<GetUserFavoritesResponse> => {
    return _getUserFavorites();
  },
  ['user-favorites'],
  {
    revalidate: 60,
    tags: ['user-favorites'],
  }
);

export const getUserVisits = unstable_cache(
  async (): Promise<GetUserVisitsResponse> => {
    return _getUserVisits();
  },
  ['user-visits'],
  {
    revalidate: 60,
    tags: ['user-visits'],
  }
);

export const getNews = unstable_cache(
  async (): Promise<News[]> => {
    return _getAllNews();
  },
  ['news'],
  {
    revalidate: 60 * 60 * 24,
    tags: ['news'],
  }
);

export function preloadHaikuMonuments(params?: {
  search?: string;
  region?: string;
  prefecture?: string;
}) {
  void getAllHaikuMonuments(params);
}

export function preloadPoets() {
  void getAllPoets();
}

export function preloadPoet(id: number) {
  void getPoetById(id);
}

export function preloadLocations() {
  void getAllLocations();
}

export function preloadSources() {
  void getAllSources();
}

export function preloadHaikuMonument(id: number) {
  void getHaikuMonumentById(id);
}

export function preloadUserFavorites() {
  void getUserFavorites();
}

export function preloadUserVisits() {
  void getUserVisits();
}

export function preloadNews() {
  void getNews();
}
