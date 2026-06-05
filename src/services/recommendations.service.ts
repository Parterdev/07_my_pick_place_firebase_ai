import {FEATURES} from '../config/features';
import {PlaceAIInsights, PlaceExperience} from '../types/place';
import {generateMockPlaceInsights} from './ai.service';
import {enrichRecommendationsWithChatGPT} from './chatgpt.service';
import {searchNearbyPlaces} from './googlePlaces.service';

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
      originalPlaceName: place.title,
    });

    let finalRecommendations =
      nearbyPlaces.length > 0 ? nearbyPlaces : mockInsights.recommendations;

    if (FEATURES.USE_CHATGPT && nearbyPlaces.length > 0) {
      finalRecommendations = await enrichRecommendationsWithChatGPT(
        place,
        finalRecommendations,
      );
    }

    return {
      ...mockInsights,
      recommendations: finalRecommendations,
      provider: FEATURES.USE_CHATGPT ? 'chatgpt' : 'mock',
    };
  } catch (error) {
    console.error('[Recommendations] Error generando recomendaciones:', error);

    return mockInsights;
  }
};