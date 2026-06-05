import {deleteObject, getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {Asset} from 'react-native-image-picker';
import {storage} from '../config/firebase';

export const uploadPlaceImage = async (
  userId: string,
  photo: Asset,
): Promise<string> => {
  try {
    if (!photo.uri) {
      throw new Error('La imagen seleccionada no tiene una URI válida.');
    }

    console.log('[Storage] URI local:', photo.uri);

    const response = await fetch(photo.uri);
    const blob = await response.blob();

    const extension = photo.fileName?.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}.${extension}`;
    const imagePath = `places/${userId}/${fileName}`;

    console.log('[Storage] Subiendo imagen en:', imagePath);

    const imageRef = ref(storage, imagePath);

    await uploadBytes(imageRef, blob);

    console.log('[Storage] Imagen subida correctamente.');

    const downloadURL = await getDownloadURL(imageRef);

    console.log('[Storage] URL generada:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('[Storage] Error al subir imagen:', error);
    throw error;
  }
};

export const deletePlaceImage = async (imageUrl: string): Promise<void> => {
  try {
    if (!imageUrl) {
      return;
    }

    const imageRef = ref(storage, imageUrl);

    await deleteObject(imageRef);

    console.log('[Storage] Imagen eliminada correctamente.');
  } catch (error) {
    console.error('[Storage] Error eliminando imagen:', error);
    throw error;
  }
};