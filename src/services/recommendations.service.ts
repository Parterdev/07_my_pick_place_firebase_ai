import {FEATURES} from '../config/features';
import {PlaceAIInsights, PlaceExperience} from '../types/place';
import {generateMockPlaceInsights} from './ai.service';
import {generateInsightsWithGemini} from './gemini.service';
import {searchNearbyPlaces} from './googlePlaces.service';

export const generatePlaceRecommendations = async (
  place: PlaceExperience,
): Promise<PlaceAIInsights> => {
  const mockInsights = await generateMockPlaceInsights(place);

  if (FEATURES.RECOMMENDATION_MODE === 'mock') {
    console.log('[Recommendations] Modo mock activo.');
    return mockInsights;
  }

  try {
    const nearbyPlaces = await searchNearbyPlaces({
      latitude: place.latitude,
      longitude: place.longitude,
      category: mockInsights.category,
      originalPlaceName: place.title,
    });

    const finalRecommendations =
      nearbyPlaces.length > 0 ? nearbyPlaces : mockInsights.recommendations;

    if (FEATURES.RECOMMENDATION_MODE === 'gemini') {
      console.log('[Recommendations] Modo real activo. Usando Google Places + Gemini.');

      return await generateInsightsWithGemini(place, finalRecommendations);
    }

    console.log('[Recommendations] Modo Google Places activo sin Gemini.');

    return {
      ...mockInsights,
      recommendations: finalRecommendations,
      provider: 'mock',
    };
  } catch (error) {
    console.error('[Recommendations] Error generando recomendaciones:', error);
    console.log('[Recommendations] Aplicando fallback mock.');

    return mockInsights;
  }
};