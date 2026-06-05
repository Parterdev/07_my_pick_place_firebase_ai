import {Timestamp} from 'firebase/firestore';
import {
  CreatePlaceInput, 
  PlaceExperience,
  PlaceAIInsights,
} from '../types/place';
import {
  deletePlaceDocument,
  getUserPlaceExperiences,
  savePlaceExperience,
  updatePlaceAIInsights,
} from './firestore.service';
import {deletePlaceImage, uploadPlaceImage} from './storage.service';
import {findGooglePlaceMetadataByLocation} from './googlePlaces.service';
import {updatePlaceGoogleMetadata} from './firestore.service';
import {GooglePlaceMetadata} from '../types/place';

const withTimeout = async <T>(
  promise: Promise<T>,
  milliseconds: number,
  message: string,
): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, milliseconds);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
};

export const createPlaceExperience = async ({
  userId,
  title,
  description,
  photo,
  location,
}: CreatePlaceInput): Promise<PlaceExperience> => {
  console.log('[Places] Iniciando creación de experiencia.');

  const imageUrl = await withTimeout(
    uploadPlaceImage(userId, photo),
    20000,
    'La subida de imagen tardó demasiado.',
  );

  const cleanPlace = {
    userId,
    title: title.trim(),
    description: description.trim(),
    imageUrl,
    latitude: location.latitude,
    longitude: location.longitude,
  };

  console.log('[Places] Imagen lista. Guardando en Firestore.');

  const placeId = await withTimeout(
    savePlaceExperience(cleanPlace),
    30000,
    'El guardado en Firestore tardó demasiado.',
  );

  const createdPlace: PlaceExperience = {
    id: placeId,
    ...cleanPlace,
    createdAt: Timestamp.now(),
  };

  console.log('[Places] Experiencia creada:', createdPlace);

  return createdPlace;
};

export const listUserPlaceExperiences = async (
  userId: string,
): Promise<PlaceExperience[]> => {
  return getUserPlaceExperiences(userId);
};

export const deletePlaceExperience = async (
  place: PlaceExperience,
): Promise<void> => {
  if (!place.id) {
    throw new Error('No se encontró el identificador del lugar.');
  }

  await withTimeout(
    deletePlaceImage(place.imageUrl),
    20000,
    'La eliminación de la imagen tardó demasiado.',
  );

  await withTimeout(
    deletePlaceDocument(place.id),
    20000,
    'La eliminación del registro tardó demasiado.',
  );

  console.log('[Places] Experiencia eliminada:', place.id);
};

export const savePlaceAIInsights = async (
  placeId: string,
  aiInsights: PlaceAIInsights,
): Promise<void> => {
  if (!placeId) {
    throw new Error('No se encontró el identificador del lugar.');
  }

  await withTimeout(
    updatePlaceAIInsights(placeId, aiInsights),
    20000,
    'El guardado de recomendaciones IA tardó demasiado.',
  );

  console.log('[Places] Recomendaciones IA guardadas:', placeId);
};

export const resolvePlaceGoogleMetadata = async (
  place: PlaceExperience,
): Promise<GooglePlaceMetadata | null> => {
  if (place.googlePlaceRating && place.googlePlaceName) {
    return {
      googlePlaceId: place.googlePlaceId,
      googlePlaceName: place.googlePlaceName,
      googlePlaceRating: place.googlePlaceRating,
      googlePlaceCategory: place.googlePlaceCategory,
      googlePlaceAddress: place.googlePlaceAddress,
    };
  }

  const metadata = await findGooglePlaceMetadataByLocation({
    latitude: place.latitude,
    longitude: place.longitude,
    originalPlaceName: place.title,
  });

  if (!metadata) {
    return null;
  }

  await updatePlaceGoogleMetadata(place.id, metadata);

  return metadata;
};