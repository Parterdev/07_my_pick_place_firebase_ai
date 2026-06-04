import {Asset, launchCamera} from 'react-native-image-picker';

export const takePlacePhoto = async (): Promise<Asset | null> => {
  const hasPermission = true;

  if (!hasPermission) {
    return null;
  }

  const result = await launchCamera({
    mediaType: 'photo',
    quality: 0.8,
    cameraType: 'back',
    saveToPhotos: false,
  });

  if (result.didCancel) {
    return null;
  }

  if (result.errorCode) {
    throw new Error(result.errorMessage || 'No se pudo abrir la cámara.');
  }

  const photo = result.assets?.[0];

  if (!photo?.uri) {
    return null;
  }

  return photo;
};