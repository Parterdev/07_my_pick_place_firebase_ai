import {Timestamp} from 'firebase/firestore';
import {
  PlaceAIInsights,
  PlaceExperience,
  RecommendedPlace,
} from '../types/place';

const getMockCategory = (place: PlaceExperience): string => {
  const text = `${place.title} ${place.description}`.toLowerCase();

  if (
    text.includes('parque') ||
    text.includes('jardín') ||
    text.includes('naturaleza') ||
    text.includes('picnic')
  ) {
    return 'Naturaleza y aire libre';
  }

  if (
    text.includes('museo') ||
    text.includes('planetario') ||
    text.includes('historia') ||
    text.includes('arte')
  ) {
    return 'Cultura y aprendizaje';
  }

  if (
    text.includes('café') ||
    text.includes('restaurante') ||
    text.includes('comida') ||
    text.includes('almuerzo')
  ) {
    return 'Gastronomía';
  }

  if (
    text.includes('mall') ||
    text.includes('centro comercial') ||
    text.includes('tienda')
  ) {
    return 'Compras y entretenimiento';
  }

  return 'Experiencia urbana';
};

const getMockTags = (category: string): string[] => {
  switch (category) {
    case 'Naturaleza y aire libre':
      return ['naturaleza', 'relajación', 'fotografía'];
    case 'Cultura y aprendizaje':
      return ['cultura', 'aprendizaje', 'exploración'];
    case 'Gastronomía':
      return ['comida', 'ambiente', 'experiencia'];
    case 'Compras y entretenimiento':
      return ['entretenimiento', 'recorrido', 'ciudad'];
    default:
      return ['recuerdo', 'ubicación', 'experiencia'];
  }
};

const getMockRecommendations = (
  category: string,
  place: PlaceExperience,
): RecommendedPlace[] => {
  const baseLocation = {
    latitude: place.latitude,
    longitude: place.longitude,
  };

  if (category === 'Naturaleza y aire libre') {
    return [
      {
        name: 'Mirador cercano',
        category: 'Aire libre',
        description:
          'Un punto recomendado para caminar, respirar aire fresco y tomar nuevas fotografías.',
        rating: 4.6,
        source: 'mock',
        ...baseLocation,
      },
      {
        name: 'Parque urbano recomendado',
        category: 'Naturaleza',
        description:
          'Una alternativa ideal para continuar una experiencia tranquila cerca de tu ubicación.',
        rating: 4.5,
        source: 'mock',
        ...baseLocation,
      },
      {
        name: 'Zona verde para descansar',
        category: 'Relajación',
        description:
          'Un espacio sugerido para desconectarte un momento y guardar una nueva experiencia.',
        rating: 4.4,
        source: 'mock',
        ...baseLocation,
      },
    ];
  }

  if (category === 'Cultura y aprendizaje') {
    return [
      {
        name: 'Museo cercano',
        category: 'Cultura',
        description:
          'Un lugar sugerido para complementar tu visita con historia, arte o aprendizaje.',
        rating: 4.7,
        source: 'mock',
        ...baseLocation,
      },
      {
        name: 'Centro cultural recomendado',
        category: 'Arte y eventos',
        description:
          'Una opción interesante para descubrir exposiciones, actividades o eventos locales.',
        rating: 4.5,
        source: 'mock',
        ...baseLocation,
      },
      {
        name: 'Punto histórico cercano',
        category: 'Historia',
        description:
          'Un sitio que podría conectar con el contexto cultural de tu experiencia guardada.',
        rating: 4.3,
        source: 'mock',
        ...baseLocation,
      },
    ];
  }

  if (category === 'Gastronomía') {
    return [
      {
        name: 'Café recomendado',
        category: 'Cafetería',
        description:
          'Una opción cercana para conversar, descansar o continuar tu recorrido con algo ligero.',
        rating: 4.6,
        source: 'mock',
        ...baseLocation,
      },
      {
        name: 'Restaurante cercano',
        category: 'Comida',
        description:
          'Un lugar sugerido para complementar tu experiencia con una parada gastronómica.',
        rating: 4.4,
        source: 'mock',
        ...baseLocation,
      },
      {
        name: 'Heladería o postre cercano',
        category: 'Postres',
        description:
          'Una recomendación casual para cerrar tu visita con algo dulce.',
        rating: 4.2,
        source: 'mock',
        ...baseLocation,
      },
    ];
  }

  return [
    {
      name: 'Lugar similar cercano',
      category: 'Recomendado',
      description:
        'Un sitio sugerido por su cercanía y relación con la experiencia que guardaste.',
      rating: 4.5,
      source: 'mock',
      ...baseLocation,
    },
    {
      name: 'Punto de interés urbano',
      category: 'Ciudad',
      description:
        'Una alternativa cercana para seguir explorando y ampliar tu bitácora personal.',
      rating: 4.3,
      source: 'mock',
      ...baseLocation,
    },
    {
      name: 'Experiencia recomendada',
      category: 'Exploración',
      description:
        'Un lugar que podría convertirse en tu siguiente recuerdo dentro de MyPickPlace.',
      rating: 4.4,
      source: 'mock',
      ...baseLocation,
    },
  ];
};

export const generateMockPlaceInsights = async (
  place: PlaceExperience,
): Promise<PlaceAIInsights> => {
  const category = getMockCategory(place);
  const tags = getMockTags(category);
  const recommendations = getMockRecommendations(category, place);

  return {
    summary: `Según el nombre y descripción registrados, "${place.title}" parece ser una experiencia asociada a ${category.toLowerCase()}. Puede representar un recuerdo valioso dentro de tu bitácora personal.`,
    category,
    tags,
    recommendations,
    generatedAt: Timestamp.now(),
    provider: 'mock',
  };
};