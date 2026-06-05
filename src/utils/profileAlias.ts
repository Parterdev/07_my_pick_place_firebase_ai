import {ImageSourcePropType} from 'react-native';
import {imageAssets} from '../assets/images';

export interface ProfileAlias {
  alias: string;
  icon: ImageSourcePropType;
}

export const getProfileAliasByPlacesCount = (
  placesCount: number,
): ProfileAlias => {
  if (placesCount <= 1) {
    return {
      alias: 'Nube tranquila',
      icon: imageAssets.cloudIcon,
    };
  }

  if (placesCount === 2) {
    return {
      alias: 'Mariposa curiosa',
      icon: imageAssets.butterflyIcon,
    };
  }

  if (placesCount === 3) {
    return {
      alias: 'Conejo explorador',
      icon: imageAssets.rabbitIcon,
    };
  }

  if (placesCount === 4) {
    return {
      alias: 'Gato observador',
      icon: imageAssets.catIcon,
    };
  }

  if (placesCount === 5) {
    return {
      alias: 'Perro aventurero',
      icon: imageAssets.dogIcon,
    };
  }

  if (placesCount === 6) {
    return {
      alias: 'Pulpo creativo',
      icon: imageAssets.octopusIcon,
    };
  }

  if (placesCount <= 8) {
    return {
      alias: 'Oso memorioso',
      icon: imageAssets.bearIcon,
    };
  }

  if (placesCount <= 10) {
    return {
      alias: 'Elefante caminante',
      icon: imageAssets.elephantIcon,
    };
  }

  return {
    alias: 'Fuego viajero',
    icon: imageAssets.fireIcon,
  };
};