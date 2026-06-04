import {CreatePlaceInput} from '../types/place';
import {savePlaceExperience} from './firestore.service';
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
}: CreatePlaceInput): Promise<string> => {
  console.log('[Places] Iniciando creación de experiencia.');

  const imageUrl = await withTimeout(
    uploadPlaceImage(userId, photo),
    20000,
    'La subida de imagen tardó demasiado.',
  );

  console.log('[Places] Imagen lista. Guardando en Firestore.');

  const placeId = await withTimeout(
    savePlaceExperience({
      userId,
      title: title.trim(),
      description: description.trim(),
      imageUrl,
      latitude: location.latitude,
      longitude: location.longitude,
    }),
    15000,
    'El guardado en Firestore tardó demasiado.',
  );

  console.log('[Places] Experiencia creada:', placeId);

  return placeId;
};