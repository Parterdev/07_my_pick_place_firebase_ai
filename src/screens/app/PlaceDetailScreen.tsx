import React, { useEffect, useState } from 'react';
import {
  Image,
  Share,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { imageAssets } from '../../assets/images';
import { useThemeMode } from '../../hooks/useThemeMode';
import { GalleryStackParamList } from '../../types/navigation';
import { GooglePlaceMetadata, PlaceAIInsights } from '../../types/place';
import { formatCoordinate, formatPlaceDate } from '../../utils/formatters';
import { generatePlaceRecommendations } from '../../services/recommendations.service';
import {
  resolvePlaceGoogleMetadata,
  savePlaceAIInsights,
} from '../../services/places.service';
import { typography } from '../../theme/typography';

type Props = NativeStackScreenProps<GalleryStackParamList, 'PlaceDetail'>;

const buildGoogleMapsUrl = (latitude: number, longitude: number) => {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
};

export const PlaceDetailScreen = ({ route, navigation }: Props) => {
  const { colors } = useThemeMode();
  const { place } = route.params;

  const [aiInsights, setAiInsights] = useState<PlaceAIInsights | null>(
    place.aiInsights ?? null,
  );
  const [loadingAI, setLoadingAI] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const [googleMetadata, setGoogleMetadata] =
    useState<GooglePlaceMetadata | null>(
      place.googlePlaceName || place.googlePlaceRating
        ? {
          googlePlaceId: place.googlePlaceId,
          googlePlaceName: place.googlePlaceName,
          googlePlaceRating: place.googlePlaceRating,
          googlePlaceCategory: place.googlePlaceCategory,
          googlePlaceAddress: place.googlePlaceAddress,
        }
        : null,
    );

  useEffect(() => {
    const loadGoogleMetadata = async () => {
      try {
        const metadata = await resolvePlaceGoogleMetadata(place);

        if (metadata) {
          setGoogleMetadata(metadata);
        }
      } catch (error) {
        console.error(
          '[PlaceDetailScreen] Error cargando metadata Google:',
          error,
        );
      }
    };

    loadGoogleMetadata();
  }, [place]);

  const openInGoogleMaps = async () => {
    const url = buildGoogleMapsUrl(place.latitude, place.longitude);
    await Linking.openURL(url);
  };

  const openRecommendationInGoogleMaps = (
    latitude?: number,
    longitude?: number,
  ) => {
    if (!latitude || !longitude) {
      return;
    }

    const url = buildGoogleMapsUrl(latitude, longitude);
    Linking.openURL(url);
  };

  const handleGenerateAIInsights = async () => {
    try {
      setLoadingAI(true);

      const result = await generatePlaceRecommendations(place);

      setAiInsights(result);
      setShowRecommendations(true);

      await savePlaceAIInsights(place.id, result);
    } catch (error) {
      console.error('[PlaceDetailScreen] Error generando IA:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  const sharePlaceLocation = async () => {
    try {
      const url = buildGoogleMapsUrl(place.latitude, place.longitude);

      await Share.share({
        title: place.title,
        message: `Te comparto este lugar desde MyPickPlace:\n\n${place.title}\n${place.description}\n\nUbicación:\n${url}`,
        url,
      });
    } catch (error) {
      console.error('[PlaceDetailScreen] Error compartiendo ubicación:', error);
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          style={({ pressed }) => [
            styles.backIconButton,
            {
              backgroundColor: colors.card,
              opacity: pressed ? 0.75 : 1,
            },
          ]}>
          <Image source={imageAssets.leftArrowIcon} style={styles.backIcon} />
        </Pressable>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Pressable
            onPress={sharePlaceLocation}
            hitSlop={12}
            style={({ pressed }) => [
              styles.shareButton,
              {
                backgroundColor: colors.card,
                opacity: pressed ? 0.78 : 1,
              },
            ]}>
            <Image source={imageAssets.shareIcon} style={styles.shareIcon} />
          </Pressable>

          {place.imageUrl ? (
            <Image source={{ uri: place.imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.emptyImage, { backgroundColor: colors.input }]}>
              <Text style={styles.emptyImageEmoji}>🖼️</Text>
            </View>
          )}

          <View style={styles.body}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.title }]}>
                {place.title}
              </Text>

              {googleMetadata?.googlePlaceRating ? (
                <View
                  style={[
                    styles.ratingBadge,
                    {
                      backgroundColor: colors.input,
                      borderColor: colors.border,
                    },
                  ]}>
                  <Image
                    source={imageAssets.starCalificationIcon}
                    style={styles.ratingIcon}
                  />

                  <Text style={[styles.ratingValue, { color: colors.title }]}>
                    {googleMetadata.googlePlaceRating.toFixed(1)}
                  </Text>
                </View>
              ) : null}
            </View>

            {googleMetadata?.googlePlaceName ? (
              <Text style={[styles.description, { color: colors.brand, fontFamily: typography.fontFamily.black }]}>
                Referencia Google:
                <Text style={{ color: colors.muted }}>
                  {' ' + googleMetadata.googlePlaceName}
                </Text>
              </Text>
            ) : null}

            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                },
              ]}>
              <Text style={[styles.infoTitle, { color: colors.title }]}>
                Ubicación registrada
              </Text>

              {googleMetadata?.googlePlaceCategory ? (
                <Text style={[styles.infoText, { color: colors.muted }]}>
                  Tipo: {googleMetadata.googlePlaceCategory}
                </Text>
              ) : null}

              <Text style={[styles.infoText, { color: colors.muted }]}>
                Latitud: {formatCoordinate(place.latitude)}
              </Text>

              <Text style={[styles.infoText, { color: colors.muted }]}>
                Longitud: {formatCoordinate(place.longitude)}
              </Text>
            </View>

            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                },
              ]}>
              <Text style={[styles.infoTitle, { color: colors.title }]}>
                Fecha de registro
              </Text>

              <Text style={[styles.infoText, { color: colors.muted }]}>
                {formatPlaceDate(place.createdAt)}
              </Text>
            </View>

            <View
              style={[
                styles.aiBox,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                },
              ]}>
              <Image source={imageAssets.botIcon} style={styles.aiImage} />

              <Text style={[styles.aiTitle, { color: colors.title }]}>
                Recomendaciones con IA
              </Text>

              {!aiInsights ? (
                <>
                  <Text style={[styles.aiText, { color: colors.muted }]}>
                    Genera una lectura inteligente usando el nombre, descripción
                    y ubicación de esta experiencia.
                  </Text>

                  <AppButton
                    title="Generar recomendaciones"
                    onPress={handleGenerateAIInsights}
                    loading={loadingAI}
                    variant="secondary"
                  />
                </>
              ) : (
                <View style={styles.aiResultContainer}>
                  <View
                    style={[
                      styles.aiSummaryCard,
                      { backgroundColor: colors.card },
                    ]}>
                    <Text
                      style={[styles.aiSectionLabel, { color: colors.brand }]}>
                      Resumen inteligente
                    </Text>

                    <Text style={[styles.aiSummaryText, { color: colors.muted }]}>
                      {aiInsights.summary}
                    </Text>
                  </View>

                  <View style={styles.aiMetaRow}>
                    <View
                      style={[
                        styles.aiMetaCard,
                        { backgroundColor: colors.card },
                      ]}>
                      <Text
                        style={[styles.aiSectionLabel, { color: colors.brand }]}>
                        Categoría
                      </Text>

                      <Text style={[styles.aiMetaText, { color: colors.title }]}>
                        {aiInsights.category}
                      </Text>
                    </View>
                  </View>

                  {showRecommendations ? (
                    <>
                      <View style={styles.tagsContainer}>
                        {aiInsights.tags.map(tag => (
                          <View
                            key={tag}
                            style={[
                              styles.tagPill,
                              {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                              },
                            ]}>
                            <Text
                              style={[styles.tagText, { color: colors.brand }]}>
                              #{tag}
                            </Text>
                          </View>
                        ))}
                      </View>

                      <Text
                        style={[
                          styles.recommendationTitle,
                          { color: colors.title },
                        ]}>
                        Sitios sugeridos
                      </Text>

                      {aiInsights.recommendations.map(
                        (recommendation, index) => (
                          <Pressable
                            key={`${recommendation.name}-${index}`}
                            onPress={() =>
                              openRecommendationInGoogleMaps(
                                recommendation.latitude,
                                recommendation.longitude,
                              )
                            }
                            disabled={
                              !recommendation.latitude ||
                              !recommendation.longitude
                            }
                            style={({ pressed }) => [
                              styles.recommendationCard,
                              {
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                opacity: pressed ? 0.82 : 1,
                              },
                            ]}>
                            <View style={styles.recommendationHeader}>
                              <Image
                                source={imageAssets.starIcon}
                                style={styles.starIcon}
                              />

                              <View style={styles.recommendationContent}>
                                <Text
                                  style={[
                                    styles.recommendationName,
                                    { color: colors.title },
                                  ]}>
                                  {recommendation.name}
                                </Text>

                                <Text
                                  style={[
                                    styles.recommendationCategory,
                                    { color: colors.brand },
                                  ]}>
                                  {recommendation.category}
                                </Text>
                              </View>

                              {recommendation.rating ? (
                                <Text
                                  style={[
                                    styles.ratingText,
                                    { color: colors.muted },
                                  ]}>
                                  ★ {recommendation.rating.toFixed(1)}
                                </Text>
                              ) : null}
                            </View>

                            <Text
                              style={[
                                styles.recommendationDescription,
                                { color: colors.muted },
                              ]}>
                              {recommendation.description}
                            </Text>

                            {recommendation.latitude &&
                              recommendation.longitude ? (
                              <Text
                                style={[
                                  styles.openMapHint,
                                  { color: colors.brand },
                                ]}>
                                Toca para abrir en Google Maps
                              </Text>
                            ) : null}
                          </Pressable>
                        ),
                      )}
                    </>
                  ) : (
                    <Text style={[styles.aiText, { color: colors.muted }]}>
                      Las recomendaciones ya fueron generadas para esta
                      experiencia. Puedes desplegarlas cuando quieras revisarlas
                      nuevamente.
                    </Text>
                  )}

                  <AppButton
                    title={
                      showRecommendations
                        ? 'Ocultar recomendaciones'
                        : 'Mostrar recomendaciones'
                    }
                    onPress={() => setShowRecommendations(current => !current)}
                    variant="secondary"
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 22,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 32,
    overflow: 'hidden',
    marginTop: 12,
  },
  image: {
    width: '100%',
    height: 260,
  },
  emptyImage: {
    width: '100%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImageEmoji: {
    fontSize: 56,
  },
  body: {
    padding: 22,
  },
  title: {
    flex: 1,
    fontSize: 30,
    fontFamily: typography.fontFamily.black,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 24,
    marginTop: 10,
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginTop: 18,
  },
  infoTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.black,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    marginTop: 3,
  },
  aiBox: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginTop: 20,
    alignItems: 'center',
  },
  aiTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.black,
    marginTop: 10,
  },
  aiText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  backIconButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 3},
  },
  backIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  aiImage: {
    width: 86,
    height: 86,
    resizeMode: 'contain',
  },
  aiResultContainer: {
    width: '100%',
    marginTop: 18,
  },
  aiSummaryCard: {
    borderRadius: 22,
    padding: 16,
  },
  aiSectionLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily.black,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  aiSummaryText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 21,
  },
  aiMetaRow: {
    marginTop: 14,
  },
  aiMetaCard: {
    borderRadius: 20,
    padding: 16,
  },
  aiMetaText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.black,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  tagPill: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tagText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.black,
  },
  recommendationTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.black,
    marginTop: 22,
    marginBottom: 12,
  },
  recommendationCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
    marginRight: 10,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationName: {
    fontSize: 15,
    fontFamily: typography.fontFamily.black,
  },
  recommendationCategory: {
    fontSize: 12,
    fontFamily: typography.fontFamily.extraBold,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: typography.fontFamily.extraBold,
  },
  recommendationDescription: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 20,
    marginTop: 10,
  },
  openMapHint: {
    fontSize: 12,
    fontFamily: typography.fontFamily.black,
    marginTop: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 12,
  },
  ratingIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginRight: 5,
  },
  ratingValue: {
    fontSize: 13,
    fontFamily: typography.fontFamily.black,
  },
  googleReferenceText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.black,
    marginBottom: 8,
  },
  shareButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10,
    width: 42,
    height: 42,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 5},
  },
  shareIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});