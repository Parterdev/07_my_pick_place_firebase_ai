import {OPENAI_CONFIG} from '../config/openai';
import {PlaceExperience, RecommendedPlace} from '../types/place';

interface ChatGPTRecommendationResponse {
  recommendations: Array<{
    name: string;
    description: string;
  }>;
}

const buildRecommendationsPrompt = (
  place: PlaceExperience,
  recommendations: RecommendedPlace[],
): string => {
  return `
Eres un asistente turístico breve, cálido y útil para una app móvil llamada MyPickPlace.

El usuario guardó esta experiencia:

Nombre del lugar:
${place.title}

Descripción escrita por el usuario:
${place.description}

Coordenadas:
Latitud ${place.latitude}, Longitud ${place.longitude}

Google Places encontró estos sitios cercanos:
${recommendations
  .map(
    (item, index) => `
${index + 1}. ${item.name}
Categoría: ${item.category}
Dirección o referencia: ${item.address || item.description}
Rating: ${item.rating || 'No disponible'}
`,
  )
  .join('\n')}

Tu tarea:
Genera una descripción personalizada para cada sitio recomendado, explicando por qué podría interesarle al usuario según la experiencia que guardó.

Reglas:
- Responde únicamente en JSON válido.
- No uses markdown.
- No agregues texto fuera del JSON.
- Mantén exactamente los mismos nombres de los sitios.
- Cada descripción debe tener máximo 28 palabras.
- El tono debe ser cercano, natural y en español latinoamericano.
- No inventes coordenadas, ratings ni direcciones.
- No recomiendes el mismo lugar guardado por el usuario.

Formato exacto:
{
  "recommendations": [
    {
      "name": "Nombre exacto del lugar",
      "description": "Descripción personalizada breve"
    }
  ]
}
`;
};

const extractOutputText = (data: any): string => {
  if (typeof data?.output_text === 'string') {
    return data.output_text;
  }

  const output = data?.output ?? [];

  for (const item of output) {
    const content = item?.content ?? [];

    for (const contentItem of content) {
      if (contentItem?.type === 'output_text' && contentItem?.text) {
        return contentItem.text;
      }
    }
  }

  return '';
};

const parseChatGPTRecommendations = (
  rawText: string,
): ChatGPTRecommendationResponse | null => {
  try {
    return JSON.parse(rawText);
  } catch (error) {
    console.error('[ChatGPT] No se pudo parsear JSON:', {
      rawText,
      error,
    });

    return null;
  }
};

export const enrichRecommendationsWithChatGPT = async (
  place: PlaceExperience,
  recommendations: RecommendedPlace[],
): Promise<RecommendedPlace[]> => {
  if (!OPENAI_CONFIG.API_KEY) {
    throw new Error('OpenAI API Key no configurada.');
  }

  if (recommendations.length === 0) {
    return recommendations;
  }

  console.log('[ChatGPT] Enriqueciendo recomendaciones:', {
    place: place.title,
    recommendations: recommendations.map(item => item.name),
  });

  const response = await fetch(OPENAI_CONFIG.BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_CONFIG.API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_CONFIG.MODEL,
      input: buildRecommendationsPrompt(place, recommendations),
      temperature: 0.4,
      max_output_tokens: 700,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error('[ChatGPT] Error de respuesta:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });

    throw new Error('No se pudieron enriquecer las recomendaciones con IA.');
  }

  const data = await response.json();
  const outputText = extractOutputText(data);
  const parsed = parseChatGPTRecommendations(outputText);

  if (!parsed?.recommendations?.length) {
    throw new Error('La respuesta de ChatGPT no contiene recomendaciones válidas.');
  }

  const enrichedRecommendations = recommendations.map(recommendation => {
    const aiMatch = parsed.recommendations.find(
      item =>
        item.name.trim().toLowerCase() ===
        recommendation.name.trim().toLowerCase(),
    );

    return {
      ...recommendation,
      description: aiMatch?.description || recommendation.description,
      source: recommendation.source,
    };
  });

  console.log(
    '[ChatGPT] Recomendaciones enriquecidas:',
    enrichedRecommendations.map(item => ({
      name: item.name,
      description: item.description,
    })),
  );

  return enrichedRecommendations;
};