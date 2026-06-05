import {GOOGLE_CONFIG} from '../config/google';
import {RecommendedPlace} from '../types/place';

interface NearbyPlacesParams {
  latitude: number;
  longitude: number;
  category?: string;
}

interface GooglePlaceResponseItem {
  id?: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  rating?: number;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  types?: string[];
}

const mapCategoryToIncludedTypes = (category?: string): string[] => {
  if (!category) {
    return ['tourist_attraction', 'park', 'museum', 'restaurant'];
  }

  const normalizedCategory = category.toLowerCase();

  if (
    normalizedCategory.includes('naturaleza') ||
    normalizedCategory.includes('aire libre') ||
    normalizedCategory.includes('parque')
  ) {
    return ['park', 'tourist_attraction'];
  }

  if (
    normalizedCategory.includes('cultura') ||
    normalizedCategory.includes('aprendizaje') ||
    normalizedCategory.includes('museo')
  ) {
    return ['museum', 'tourist_attraction'];
  }

  if (
    normalizedCategory.includes('gastronomía') ||
    normalizedCategory.includes('comida') ||
    normalizedCategory.includes('restaurante')
  ) {
    return ['restaurant', 'cafe'];
  }

  if (
    normalizedCategory.includes('compras') ||
    normalizedCategory.includes('entretenimiento')
  ) {
    return ['shopping_mall', 'movie_theater'];
  }

  return ['tourist_attraction', 'park', 'museum', 'restaurant'];
};

const normalizeGooglePlace = (
  place: GooglePlaceResponseItem,
): RecommendedPlace => {
  return {
    id: place.id,
    name: place.displayName?.text || 'Lugar recomendado',
    category: place.types?.[0]?.replace(/_/g, ' ') || 'Recomendado',
    description:
      place.formattedAddress ||
      'Sitio cercano recomendado según la ubicación registrada.',
    rating: place.rating,
    address: place.formattedAddress,
    latitude: place.location?.latitude,
    longitude: place.location?.longitude,
    source: 'google_places',
  };
};

export const searchNearbyPlaces = async ({
  latitude,
  longitude,
  category,
}: NearbyPlacesParams): Promise<RecommendedPlace[]> => {
  if (!GOOGLE_CONFIG.PLACES_API_KEY) {
    throw new Error('Google Places API Key no configurada.');
  }

  const includedTypes = mapCategoryToIncludedTypes(category);

  const response = await fetch(GOOGLE_CONFIG.PLACES_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_CONFIG.PLACES_API_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.rating,places.location,places.types',
    },
    body: JSON.stringify({
      includedTypes,
      maxResultCount: 5,
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: 1500,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error('No se pudieron consultar lugares cercanos.');
  }

  const data = await response.json();

  const places = data?.places ?? [];

  return places.map(normalizeGooglePlace);
};