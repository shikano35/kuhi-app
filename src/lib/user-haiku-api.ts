import {
  AddFavoriteRequest,
  RemoveFavoriteRequest,
  AddVisitRequest,
  UpdateVisitRequest,
  GetUserFavoritesResponse,
  GetUserVisitsResponse,
  UserVisit,
  UserHaikuMonument,
} from '@/types/definitions/haiku';

export async function getUserFavorites(): Promise<GetUserFavoritesResponse> {
  const response = await fetch('/api/user/favorites');

  if (!response.ok) {
    throw new Error('Failed to fetch favorites');
  }

  return response.json();
}

export async function addFavorite(data: AddFavoriteRequest): Promise<void> {
  const response = await fetch('/api/user/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add favorite');
  }
}

export async function removeFavorite(
  data: RemoveFavoriteRequest
): Promise<void> {
  const response = await fetch('/api/user/favorites', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove favorite');
  }
}

export async function getUserVisits(): Promise<GetUserVisitsResponse> {
  const response = await fetch('/api/user/visits');

  if (!response.ok) {
    throw new Error('Failed to fetch visits');
  }

  return response.json();
}

export async function addVisit(data: AddVisitRequest): Promise<void> {
  const response = await fetch('/api/user/visits', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add visit');
  }
}

export async function updateVisit(data: UpdateVisitRequest): Promise<void> {
  const response = await fetch('/api/user/visits', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update visit');
  }
}

export async function removeVisit(visitId: string): Promise<void> {
  const response = await fetch(`/api/user/visits?visitId=${visitId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove visit');
  }
}

export async function removeVisitByMonumentId(
  monumentId: number
): Promise<void> {
  const response = await fetch(`/api/user/visits?monumentId=${monumentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove visit');
  }
}

export async function checkIfFavorited(monumentId: number): Promise<boolean> {
  try {
    const response = await getUserFavorites();
    return (
      response.favorites?.some((fav) => fav.monumentId === monumentId) || false
    );
  } catch (error) {
    console.error('Failed to check favorite status:', error);
    return false;
  }
}

export async function checkIfVisited(monumentId: number): Promise<boolean> {
  try {
    const { visits } = await getUserVisits();
    return visits.some((visit) => visit.monumentId === monumentId);
  } catch (error) {
    console.error('Error checking visit status:', error);
    return false;
  }
}

export async function getVisitByMonumentId(
  monumentId: number
): Promise<(UserVisit & { monument: UserHaikuMonument }) | null> {
  try {
    const { visits } = await getUserVisits();
    return visits.find((visit) => visit.monumentId === monumentId) || null;
  } catch (error) {
    console.error('Error getting visit by monument ID:', error);
    return null;
  }
}
