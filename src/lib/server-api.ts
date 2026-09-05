import { unstable_cache } from 'next/cache';
import {
  getAllHaikuMonuments as _getAllHaikuMonuments,
  getAllPoetsFromApi as _getAllPoetsFromApi,
  getPoetByIdOld as _getPoetById,
  getAllLocations as _getAllLocations,
  getHaikuMonumentById as _getHaikuMonumentById,
  getHaikuMonumentsByPoet as _getHaikuMonumentsByPoet,
  getAllSources as _getAllSources,
  getAllNews as _getAllNews,
} from './api';
import { mapNewPoetToPoet } from './api-mappers';
import {
  HaikuMonument,
  Poet,
  Location,
  News,
  Source,
} from '@/types/definitions/haiku';

class ResourceNotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'ResourceNotFoundError';
  }
}

async function unwrapNotFound<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return null;
    }
    throw error;
  }
}

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
    revalidate: 60 * 60 * 2,
    tags: ['haiku-monuments'],
  }
);

export const getAllPoets = unstable_cache(
  async (): Promise<Poet[]> => {
    const apiPoets = await _getAllPoetsFromApi();
    return apiPoets.map(mapNewPoetToPoet);
  },
  ['poets'],
  {
    revalidate: 60 * 60 * 2,
    tags: ['poets'],
  }
);

const getCachedPoetById = unstable_cache(
  async (id: number): Promise<Poet> => {
    const poet = await _getPoetById(id);

    if (!poet) {
      throw new ResourceNotFoundError(`poet ${id}`);
    }

    return poet;
  },
  ['poet-by-id'],
  {
    revalidate: 60 * 60 * 2,
    tags: ['poets'],
  }
);

export async function getPoetById(id: number): Promise<Poet | null> {
  return unwrapNotFound(() => getCachedPoetById(id));
}

export const getAllLocations = unstable_cache(
  async (): Promise<Location[]> => {
    return _getAllLocations();
  },
  ['locations'],
  {
    revalidate: 60 * 60 * 2,
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

export async function getHaikuMonumentById(
  id: number
): Promise<HaikuMonument | null> {
  const cachedFn = unstable_cache(
    async (monumentId: number): Promise<HaikuMonument> => {
      const monument = await _getHaikuMonumentById(monumentId);

      if (!monument) {
        throw new ResourceNotFoundError(`monument ${monumentId}`);
      }

      return monument;
    },
    [`haiku-monument-${id}`],
    {
      revalidate: 60 * 60 * 2,
      tags: ['haiku-monument', `monument-${id}`],
    }
  );
  return unwrapNotFound(() => cachedFn(id));
}

export async function getHaikuMonumentsByPoet(
  poetId: number
): Promise<HaikuMonument[]> {
  const cachedFn = unstable_cache(
    async (id: number): Promise<HaikuMonument[]> => {
      return _getHaikuMonumentsByPoet(id);
    },
    [`haiku-monuments-by-poet-${poetId}`],
    {
      revalidate: 60 * 60 * 2,
      tags: ['haiku-monuments', 'poets', `poet-${poetId}`],
    }
  );
  return cachedFn(poetId);
}

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

export function preloadNews() {
  void getNews();
}
