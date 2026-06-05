import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {db} from '../config/firebase';
import {
  BehaviorPlaceInput,
  PlaceExperience,
  UserBehaviorSummary,
} from '../types/place';
import {generateBehaviorSummaryWithGemini} from './gemini.service';

const mapPlacesForBehavior = (
  places: PlaceExperience[],
): BehaviorPlaceInput[] => {
  return places.map(place => ({
    title: place.title,
    description: place.description,
    latitude: place.latitude,
    longitude: place.longitude,
    createdAt: place.createdAt ?? null,
    googlePlaceName: place.googlePlaceName,
    googlePlaceRating: place.googlePlaceRating,
    googlePlaceCategory: place.googlePlaceCategory,
    googlePlaceAddress: place.googlePlaceAddress,
  }));
};

export const getUserBehaviorSummary = async (
  userId: string,
): Promise<UserBehaviorSummary | null> => {
  const reference = doc(db, 'userBehaviorSummaries', userId);
  const snapshot = await getDoc(reference);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as UserBehaviorSummary;
};

export const generateAndSaveUserBehaviorSummary = async ({
  userId,
  places,
}: {
  userId: string;
  places: PlaceExperience[];
}): Promise<UserBehaviorSummary> => {
  if (places.length < 3) {
    throw new Error('Se necesitan al menos 3 lugares para generar el análisis.');
  }

  const behaviorPlaces = mapPlacesForBehavior(places);

  const summary = await generateBehaviorSummaryWithGemini({
    userId,
    places: behaviorPlaces,
  });

  const payload: UserBehaviorSummary = {
    ...summary,
    userId,
    placesCount: places.length,
    provider: 'gemini',
  };

  await setDoc(doc(db, 'userBehaviorSummaries', userId), {
    ...payload,
    generatedAt: serverTimestamp(),
  });

  return payload;
};