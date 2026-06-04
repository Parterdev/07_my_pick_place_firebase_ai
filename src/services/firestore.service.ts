import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import {db} from '../config/firebase';
import {PlaceExperience} from '../types/place';

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

    const placesQuery = query(
      placesRef,
      where('userId', '==', userId),
    );

    const snapshot = await getDocs(placesQuery);

    const places = snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        latitude: data.latitude,
        longitude: data.longitude,
        createdAt: data.createdAt ?? null,
      } as PlaceExperience;
    });

    const sortedPlaces = places.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() ?? 0;
      const dateB = b.createdAt?.toMillis?.() ?? 0;

      return dateB - dateA;
    });

    console.log('[Firestore] Experiencias encontradas:', sortedPlaces.length);

    return sortedPlaces;
  } catch (error) {
    console.error('[Firestore] Error consultando experiencias:', error);
    throw error;
  }
};