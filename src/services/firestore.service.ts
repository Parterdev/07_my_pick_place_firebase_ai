import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import {
  GooglePlaceMetadata,
  PlaceAIInsights,
  PlaceExperience,
} from '../types/place';

export const savePlaceExperience = async (
  place: Omit<PlaceExperience, 'id' | 'createdAt'>,
): Promise<string> => {
  try {
    console.log('[Firestore] Guardando experiencia:', place);

    const docRef = await addDoc(collection(db, 'places'), {
      ...place,
      createdAt: serverTimestamp(),
    });

    console.log('[Firestore] Experiencia guardada con ID:', docRef.id);

    return docRef.id;
  } catch (error) {
    console.error('[Firestore] Error al guardar experiencia:', error);
    throw error;
  }
};

export const getUserPlaceExperiences = async (
  userId: string,
): Promise<PlaceExperience[]> => {
  try {
    console.log('[Firestore] Consultando experiencias del usuario:', userId);

    const placesRef = collection(db, 'places');

    const placesQuery = query(placesRef, where('userId', '==', userId));

    const snapshot = await getDocs(placesQuery);

    const places = snapshot.docs.map(document => {
      const data = document.data();

      return {
        id: document.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        latitude: data.latitude,
        longitude: data.longitude,
        createdAt: data.createdAt ?? null,

        googlePlaceId: data.googlePlaceId,
        googlePlaceName: data.googlePlaceName,
        googlePlaceRating: data.googlePlaceRating,
        googlePlaceCategory: data.googlePlaceCategory,
        googlePlaceAddress: data.googlePlaceAddress,
        googlePlaceValidatedAt: data.googlePlaceValidatedAt ?? null,

        aiInsights: data.aiInsights ?? null,
      } as PlaceExperience;
    });

    return places.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() ?? 0;
      const dateB = b.createdAt?.toMillis?.() ?? 0;

      return dateB - dateA;
    });
  } catch (error) {
    console.error('[Firestore] Error consultando experiencias:', error);
    throw error;
  }
};

export const deletePlaceDocument = async (placeId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'places', placeId));

    console.log('[Firestore] Documento eliminado correctamente:', placeId);
  } catch (error) {
    console.error('[Firestore] Error eliminando documento:', error);
    throw error;
  }
};

export const updatePlaceAIInsights = async (
  placeId: string,
  aiInsights: PlaceAIInsights,
): Promise<void> => {
  try {
    console.log('[Firestore] Guardando IA para experiencia:', placeId);

    await updateDoc(doc(db, 'places', placeId), {
      aiInsights: {
        ...aiInsights,
        generatedAt: serverTimestamp(),
      },
    });

    console.log('[Firestore] IA guardada correctamente.');
  } catch (error) {
    console.error('[Firestore] Error guardando IA:', error);
    throw error;
  }
};

export const updatePlaceGoogleMetadata = async (
  placeId: string,
  metadata: GooglePlaceMetadata,
): Promise<void> => {
  try {
    console.log('[Firestore] Guardando metadata Google del lugar:', {
      placeId,
      metadata,
    });

    await updateDoc(doc(db, 'places', placeId), {
      ...metadata,
      googlePlaceValidatedAt: serverTimestamp(),
    });

    console.log('[Firestore] Metadata Google guardada correctamente.');
  } catch (error) {
    console.error('[Firestore] Error guardando metadata Google:', error);
    throw error;
  }
};