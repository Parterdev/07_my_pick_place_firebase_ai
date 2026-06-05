import {Timestamp} from 'firebase/firestore';
import {Asset} from 'react-native-image-picker';

export interface PlaceLocation {
  latitude: number;
  longitude: number;
}

export type RecommendationSource = 'google_places' | 'chatgpt' | 'mock';

export interface RecommendedPlace {
  id?: string;
  name: string;
  category: string;
  description: string;
  rating?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  source: RecommendationSource;
}

export interface PlaceAIInsights {
  summary: string;
  category: string;
  tags: string[];
  recommendations: RecommendedPlace[];
  generatedAt?: Timestamp | null;
  provider?: 'gemini' | 'chatgpt' | 'mock';
}

export interface PlaceExperience {
  id: string;
  userId: string;
  title: string;
  description: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  createdAt?: Timestamp | null;

  googlePlaceId?: string;
  googlePlaceName?: string;
  googlePlaceRating?: number;
  googlePlaceCategory?: string;
  googlePlaceAddress?: string;
  googlePlaceValidatedAt?: Timestamp | null;

  aiInsights?: PlaceAIInsights | null;
}

export interface CreatePlaceInput {
  userId: string;
  title: string;
  description: string;
  photo: Asset;
  location: PlaceLocation;
}

export interface GooglePlaceMetadata {
  googlePlaceId?: string;
  googlePlaceName?: string;
  googlePlaceRating?: number;
  googlePlaceCategory?: string;
  googlePlaceAddress?: string;
}

export interface UserBehaviorSummary {
  id?: string;
  userId: string;
  placesCount: number;
  profileTitle: string;
  personalityType: string;
  summary: string;
  strengths: string[];
  patterns: string[];
  recommendation: string;
  generatedAt?: any;
  provider: 'gemini';
}

export interface BehaviorPlaceInput {
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  createdAt?: any;
  googlePlaceName?: string;
  googlePlaceRating?: number;
  googlePlaceCategory?: string;
  googlePlaceAddress?: string;
}