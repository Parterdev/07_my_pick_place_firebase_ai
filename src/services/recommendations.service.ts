import {FEATURES} from '../config/features';
import {generateMockPlaceInsights} from './ai.service';
import {searchNearbyPlaces} from './googlePlaces.service';
import {PlaceAIInsights, PlaceExperience} from '../types/place';

export const generatePlaceRecommendations = async (
  place: PlaceExperience,
): Promise<PlaceAIInsights> => {
  const mockInsights = await generateMockPlaceInsights(place);

  if (!FEATURES.USE_GOOGLE_PLACES) {
    return mockInsights;
  }

  try {
    const nearbyPlaces = await searchNearbyPlaces({
      latitude: place.latitude,
      longitude: place.longitude,
      category: mockInsights.category,
    });

    return {
      ...mockInsights,
      recommendations:
        nearbyPlaces.length > 0 ? nearbyPlaces : mockInsights.recommendations,
      provider: FEATURES.USE_CHATGPT ? 'chatgpt' : 'mock',
    };
  } catch (error) {
    console.error('[Recommendations] Error usando Google Places:', error);

    return mockInsights;
  }
};