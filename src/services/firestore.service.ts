import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
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