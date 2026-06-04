import {Asset} from 'react-native-image-picker';

export interface PlaceLocation {
  latitude: number;
  longitude: number;
}

export interface PlaceExperience {
  id?: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  createdAt?: unknown;
}

export interface CreatePlaceInput {
  userId: string;
  title: string;
  description: string;
  photo: Asset;
  location: PlaceLocation;
}