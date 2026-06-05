import {Timestamp} from 'firebase/firestore';
import {CreatePlaceInput, PlaceExperience} from '../types/place';
import {
  getUserPlaceExperiences,
  savePlaceExperience,
} from './firestore.service';
import {uploadPlaceImage} from './storage.service';

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