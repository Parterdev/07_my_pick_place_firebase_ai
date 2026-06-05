import {GOOGLE_CONFIG} from '../config/google';
import {GooglePlaceMetadata, RecommendedPlace} from '../types/place';

interface NearbyPlacesParams {
  latitude: number;
  longitude: number;
  category?: string;
  originalPlaceName?: string;
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

const normalizeText = (value?: string): string => {
  return (value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

const isSamePlace = (googlePlaceName: string, originalPlaceName?: string) => {
  if (!originalPlaceName) {
    return false;
  }

  const googleName = normalizeText(googlePlaceName);
  const originalName = normalizeText(originalPlaceName);

  if (!googleName || !originalName) {
    return false;
  }

  return (
    googleName === originalName ||
    googleName.includes(originalName) ||
    originalName.includes(googleName)
  );
};

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
    return ['museum', 'tourist_attraction', 'historical_landmark'];
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

const translateGoogleType = (type?: string): string => {
  switch (type) {
    case 'tourist_attraction':
      return 'Atracción turística';
    case 'historical_landmark':
      return 'Sitio histórico';
    case 'museum':
      return 'Museo';
    case 'art_museum':
      return 'Museo de arte';
    case 'cultural_center':
      return 'Centro cultural';
    case 'government_office':
      return 'Oficina gubernamental';
    case 'city_hall':
      return 'Municipio';
    case 'park':
      return 'Parque';
    case 'restaurant':
      return 'Restaurante';
    case 'cafe':
      return 'Cafetería';
    case 'shopping_mall':
      return 'Centro comercial';
    case 'movie_theater':
      return 'Cine';
    case 'church':
      return 'Iglesia';
    case 'point_of_interest':
      return 'Punto de interés';
    case 'establishment':
      return 'Establecimiento';
    default:
      return type?.replace(/_/g, ' ') || 'Recomendado';
  }
};

const normalizeGooglePlace = (
  place: GooglePlaceResponseItem,
): RecommendedPlace => {
  const mainType = place.types?.[0];

  return {
    id: place.id,
    name: place.displayName?.text || 'Lugar recomendado',
    category: translateGoogleType(mainType),
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
  originalPlaceName,
}: NearbyPlacesParams): Promise<RecommendedPlace[]> => {
  if (!GOOGLE_CONFIG.PLACES_API_KEY) {
    throw new Error('Google Places API Key no configurada.');
  }

  const includedTypes = mapCategoryToIncludedTypes(category);

  console.log('[GooglePlaces] Consultando lugares cercanos:', {
    latitude,
    longitude,
    category,
    originalPlaceName,
    includedTypes,
  });

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
      maxResultCount: 3,
      languageCode: 'es',
      regionCode: 'EC',
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
    const errorText = await response.text();

    console.error('[GooglePlaces] Error de respuesta:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });

    throw new Error('No se pudieron consultar lugares cercanos.');
  }

  const data = await response.json();

  console.log('[GooglePlaces] Lugares encontrados:', data?.places?.length ?? 0);

  const places: GooglePlaceResponseItem[] = data?.places ?? [];

  const normalizedPlaces = places
    .map(normalizeGooglePlace)
    .filter(place => !isSamePlace(place.name, originalPlaceName))
    .slice(0, 3);

  console.log(
    '[GooglePlaces] Lugares normalizados:',
    normalizedPlaces.map(place => ({
      name: place.name,
      category: place.category,
      rating: place.rating,
      source: place.source,
    })),
  );

  return normalizedPlaces;
};

const calculateDistanceMeters = (
  pointA: {latitude: number; longitude: number},
  pointB: {latitude: number; longitude: number},
): number => {
  const earthRadius = 6371000;

  const toRadians = (value: number) => (value * Math.PI) / 180;

  const deltaLat = toRadians(pointB.latitude - pointA.latitude);
  const deltaLon = toRadians(pointB.longitude - pointA.longitude);

  const lat1 = toRadians(pointA.latitude);
  const lat2 = toRadians(pointB.latitude);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

const getNameMatchBonus = (
  googlePlaceName?: string,
  originalPlaceName?: string,
): number => {
  if (!googlePlaceName || !originalPlaceName) {
    return 0;
  }

  const googleName = normalizeText(googlePlaceName);
  const originalName = normalizeText(originalPlaceName);

  if (!googleName || !originalName) {
    return 0;
  }

  if (googleName === originalName) {
    return 80;
  }

  if (googleName.includes(originalName) || originalName.includes(googleName)) {
    return 50;
  }

  return 0;
};

export const findGooglePlaceMetadataByLocation = async ({
  latitude,
  longitude,
  originalPlaceName,
}: {
  latitude: number;
  longitude: number;
  originalPlaceName?: string;
}): Promise<GooglePlaceMetadata | null> => {
  if (!GOOGLE_CONFIG.PLACES_API_KEY) {
    throw new Error('Google Places API Key no configurada.');
  }

  console.log('[GooglePlaces] Validando rating del lugar guardado:', {
    latitude,
    longitude,
    originalPlaceName,
  });

  const response = await fetch(GOOGLE_CONFIG.PLACES_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_CONFIG.PLACES_API_KEY,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.rating,places.location,places.types',
    },
    body: JSON.stringify({
      includedTypes: [
        'tourist_attraction',
        'historical_landmark',
        'museum',
        'art_museum',
        'park',
        'restaurant',
        'cafe',
        'church',
        'government_office',
      ],
      maxResultCount: 5,
      languageCode: 'es',
      regionCode: 'EC',
      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude,
          },
          radius: 180,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error('[GooglePlaces] Error validando lugar guardado:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });

    throw new Error('No se pudo validar el lugar guardado en Google Places.');
  }

  const data = await response.json();
  const places: GooglePlaceResponseItem[] = data?.places ?? [];

  if (places.length === 0) {
    console.log('[GooglePlaces] No se encontró metadata para el lugar.');
    return null;
  }

  const rankedPlaces = places
    .filter(place => place.location?.latitude && place.location?.longitude)
    .map(place => {
      const distance = calculateDistanceMeters(
        {latitude, longitude},
        {
          latitude: place.location?.latitude ?? latitude,
          longitude: place.location?.longitude ?? longitude,
        },
      );

      const nameBonus = getNameMatchBonus(
        place.displayName?.text,
        originalPlaceName,
      );

      return {
        place,
        score: distance - nameBonus,
        distance,
      };
    })
    .sort((a, b) => a.score - b.score);

  const bestMatch = rankedPlaces[0]?.place;

  if (!bestMatch) {
    return null;
  }

  const metadata: GooglePlaceMetadata = {
    googlePlaceId: bestMatch.id,
    googlePlaceName: bestMatch.displayName?.text,
    googlePlaceRating: bestMatch.rating,
    googlePlaceCategory: translateGoogleType(bestMatch.types?.[0]),
    googlePlaceAddress: bestMatch.formattedAddress,
  };

  console.log('[GooglePlaces] Metadata detectada:', metadata);

  return metadata;
};