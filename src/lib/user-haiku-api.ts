import {
  AddFavoriteRequest,
  RemoveFavoriteRequest,
  AddVisitRequest,
  UpdateVisitRequest,
  GetUserFavoritesResponse,
  GetUserVisitsResponse,
} from '@/types/haiku';

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

export async function checkIfFavorited(monumentId: string): Promise<boolean> {
  try {
    const { favorites } = await getUserFavorites();
    const numericMonumentId = parseInt(monumentId, 10);
    return favorites.some((fav) => fav.monumentId === numericMonumentId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}

export async function checkIfVisited(monumentId: string): Promise<boolean> {
  try {
    const { visits } = await getUserVisits();
    const numericMonumentId = parseInt(monumentId, 10);
    return visits.some((visit) => visit.monumentId === numericMonumentId);
  } catch (error) {
    console.error('Error checking visit status:', error);
    return false;
  }
}

export async function getVisitByMonumentId(monumentId: string) {
  try {
    const { visits } = await getUserVisits();
    const numericMonumentId = parseInt(monumentId, 10);
    return visits.find((visit) => visit.monumentId === numericMonumentId);
  } catch (error) {
    console.error('Error getting visit by monument ID:', error);
    return null;
  }
}
