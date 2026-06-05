import {NavigatorScreenParams} from '@react-navigation/native';
import { PlaceExperience } from "./place";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type GalleryStackParamList = {
  GalleryList: undefined;
  PlaceDetail: {
    place: PlaceExperience;
  };
};

export type AppTabParamList = {
  Home: undefined;
  CapturePlace: undefined;
  Gallery: NavigatorScreenParams<GalleryStackParamList> | undefined;
  Profile: undefined;
};