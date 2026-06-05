import {Timestamp} from 'firebase/firestore';
import {
  PlaceAIInsights,
  PlaceExperience,
  RecommendedPlace,
} from '../types/place';
import {GEMINI_CONFIG} from '../config/gemini';

interface GeminiFullInsightsResponse {
  summary: string;
  category: string;
  tags: string[];
  recommendations: Array<{
    name: string;
    description: string;
  }>;
}

const buildFullInsightsPrompt = (
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
Genera un análisis inteligente de la experiencia guardada y descripciones personalizadas para cada sitio recomendado.

Debes interpretar por qué el usuario pudo haber tomado una foto de este lugar, considerando:
- el nombre del lugar
- la descripción escrita por el usuario
- el contexto urbano/turístico/cultural que sugieren las coordenadas
- los sitios cercanos encontrados por Google Places

Reglas:
- Responde únicamente en JSON válido.
- No uses markdown.
- No agregues texto fuera del JSON.
- El resumen debe tener máximo 45 palabras.
- La categoría debe ser breve, máximo 4 palabras.
- Devuelve exactamente 3 tags.
- Cada tag debe tener una o dos palabras, sin el símbolo #.
- Mantén exactamente los mismos nombres de los sitios recomendados.
- Cada descripción de recomendación debe tener máximo 28 palabras.
- El tono debe ser cercano, natural y en español latinoamericano.
- No inventes coordenadas, ratings ni direcciones.
- No recomiendes el mismo lugar guardado por el usuario.

Formato exacto:
{
  "summary": "Resumen inteligente contextual de la experiencia guardada.",
  "category": "Categoría breve",
  "tags": ["tag uno", "tag dos", "tag tres"],
  "recommendations": [
    {
      "name": "Nombre exacto del lugar",
      "description": "Descripción personalizada breve"
    }
  ]
}
`;
};

const extractGeminiText = (data: any): string => {
  const parts = data?.candidates?.[0]?.content?.parts ?? [];

  for (const part of parts) {
    if (typeof part?.text === 'string') {
      return part.text;
    }
  }

  return '';
};

const cleanJsonText = (text: string): string => {
  return text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
};

const parseGeminiInsights = (
  rawText: string,
): GeminiFullInsightsResponse | null => {
  try {
    return JSON.parse(cleanJsonText(rawText));
  } catch (error) {
    console.error('[Gemini] No se pudo parsear JSON:', {
      rawText,
      error,
    });

    return null;
  }
};

const normalizeTags = (tags?: string[]): string[] => {
  if (!Array.isArray(tags)) {
    return ['experiencia', 'recuerdo', 'exploración'];
  }

  const cleanTags = tags
    .map(tag => tag.replace('#', '').trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 3);

  while (cleanTags.length < 3) {
    cleanTags.push('experiencia');
  }

  return cleanTags;
};

export const generateInsightsWithGemini = async (
  place: PlaceExperience,
  recommendations: RecommendedPlace[],
): Promise<PlaceAIInsights> => {
  if (!GEMINI_CONFIG.API_KEY) {
    throw new Error('Gemini API Key no configurada.');
  }

  console.log('[Gemini] Generando insights completos:', {
    place: place.title,
    recommendations: recommendations.map(item => item.name),
  });

  const response = await fetch(
    `${GEMINI_CONFIG.BASE_URL}?key=${GEMINI_CONFIG.API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: buildFullInsightsPrompt(place, recommendations),
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 900,
          responseMimeType: 'application/json',
        },
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error('[Gemini] Error de respuesta:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });

    throw new Error('No se pudieron generar insights con Gemini.');
  }

  const data = await response.json();
  const outputText = extractGeminiText(data);
  const parsed = parseGeminiInsights(outputText);

  if (!parsed?.summary || !parsed?.category) {
    throw new Error('La respuesta de Gemini no contiene insights válidos.');
  }

  const enrichedRecommendations = recommendations.map(recommendation => {
    const aiMatch = parsed.recommendations?.find(
      item =>
        item.name.trim().toLowerCase() ===
        recommendation.name.trim().toLowerCase(),
    );

    return {
      ...recommendation,
      description: aiMatch?.description || recommendation.description,
    };
  });

  const insights: PlaceAIInsights = {
    summary: parsed.summary,
    category: parsed.category,
    tags: normalizeTags(parsed.tags),
    recommendations: enrichedRecommendations,
    generatedAt: Timestamp.now(),
    provider: 'gemini',
  };

  console.log('[Gemini] Insights generados:', {
    summary: insights.summary,
    category: insights.category,
    tags: insights.tags,
    recommendations: insights.recommendations.map(item => ({
      name: item.name,
      description: item.description,
    })),
  });

  return insights;
};