import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  getMonuments,
  getMonumentById,
  getPoets,
  getPoetById,
  getMonumentsByPoet,
  getLocations,
  getSources,
} from '@/lib/kuhi-api';
import {
  MonumentWithRelations,
  MonumentsQueryParams,
  Location,
  Inscription,
  PoetsQueryParams,
  LocationsQueryParams,
  SourcesQueryParams,
} from '@/types/definitions/api';

export function useMonuments(params: MonumentsQueryParams = {}) {
  return useQuery({
    queryKey: ['monuments', params],
    queryFn: () => getMonuments(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useInfiniteMonuments(params: MonumentsQueryParams = {}) {
  return useInfiniteQuery({
    queryKey: ['monuments', 'infinite', params],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam as number;

      try {
        const monuments = await getMonuments({
          ...params,
          offset,
          limit: params.limit || 20,
        });

        return {
          data: monuments,
          nextOffset:
            monuments.length === (params.limit || 20)
              ? offset + (params.limit || 20)
              : undefined,
        };
      } catch {
        try {
          const inscriptionsUrl = `${process.env.KUHI_API_URL || 'https://api.kuhi.jp'}/inscriptions?limit=${params.limit || 20}&offset=${offset}`;
          const response = await fetch(inscriptionsUrl);

          if (!response.ok) {
            throw new Error(`Inscriptions API failed: ${response.status}`);
          }

          const inscriptionsData = (await response.json()) as {
            inscriptions?: Inscription[];
          };

          const monuments =
            inscriptionsData.inscriptions?.map((inscription) => ({
              id: inscription.monument_id || 0,
              canonical_name: `句碑 ${inscription.monument_id}`,
              canonical_uri: `https://api.kuhi.jp/monuments/${inscription.monument_id}`,
              monument_type: '句碑',
              monument_type_uri: null,
              material: null,
              material_uri: null,
              is_reliable: false,
              verification_status: 'unverified',
              verified_at: null,
              verified_by: null,
              reliability_note: null,
              created_at: inscription.created_at || new Date().toISOString(),
              updated_at: inscription.updated_at || new Date().toISOString(),
              inscriptions: [inscription],
              events: [],
              media: [],
              locations: [],
              poets: [],
              sources: inscription.source ? [inscription.source] : [],
              original_established_date: null,
              hu_time_normalized: null,
              interval_start: null,
              interval_end: null,
              uncertainty_note: null,
            })) || [];

          const uniqueMonuments = Array.from(
            new Map(monuments.map((m) => [m.id, m])).values()
          );

          return {
            data: uniqueMonuments,
            nextOffset:
              uniqueMonuments.length === (params.limit || 20)
                ? offset + (params.limit || 20)
                : undefined,
          };
        } catch {
          return {
            data: [],
            nextOffset: undefined,
          };
        }
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMonument(id: number) {
  return useQuery({
    queryKey: ['monument', id],
    queryFn: () => getMonumentById(id),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePoets(params: PoetsQueryParams = {}) {
  return useQuery({
    queryKey: ['poets', params],
    queryFn: () => getPoets(params),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePoet(id: number) {
  return useQuery({
    queryKey: ['poet', id],
    queryFn: () => getPoetById(id),
    staleTime: 10 * 60 * 1000,
  });
}

export function useMonumentsByPoet(poetId: number) {
  return useQuery({
    queryKey: ['monuments', 'by-poet', poetId],
    queryFn: () => getMonumentsByPoet(poetId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLocations(params: LocationsQueryParams = {}) {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => getLocations(params),
    staleTime: 15 * 60 * 1000,
  });
}

export function useSources(params: SourcesQueryParams = {}) {
  return useQuery({
    queryKey: ['sources', params],
    queryFn: () => getSources(params),
    staleTime: 15 * 60 * 1000,
  });
}

export function useFlattenedInfiniteMonuments(
  data: { data: MonumentWithRelations[]; nextOffset?: number }[] | undefined
): MonumentWithRelations[] {
  if (!data) return [];
  return data.flatMap((page) => page.data);
}

export function useMonumentsByRegion() {
  return useQuery({
    queryKey: ['monuments', 'by-region'],
    queryFn: async () => {
      const monuments = await getMonuments({ limit: 500 });

      const regionMap: Record<string, MonumentWithRelations[]> = {};

      monuments.forEach((monument: MonumentWithRelations) => {
        monument.locations.forEach((location: Location) => {
          if (!regionMap[location.region]) {
            regionMap[location.region] = [];
          }
          regionMap[location.region].push(monument);
        });
      });

      return regionMap;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useSearchMonuments(searchParams: {
  q?: string;
  poet_name_contains?: string;
  inscription_contains?: string;
  prefecture?: string;
  region?: string;
  season?: string;
  kigo?: string;
}) {
  return useInfiniteMonuments({
    ...searchParams,
    limit: 20,
  });
}
