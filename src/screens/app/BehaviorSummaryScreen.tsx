import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageSourcePropType,
  Image as RNImage,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import ImageColors from 'react-native-image-colors';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { imageAssets } from '../../assets/images';
import { FEATURES } from '../../config/features';
import { useAuthContext } from '../../context/AuthContext';
import { useThemeMode } from '../../hooks/useThemeMode';
import { listUserPlaceExperiences } from '../../services/places.service';
import {
  generateAndSaveUserBehaviorSummary,
  getUserBehaviorSummary,
} from '../../services/behavior.service';
import { AppTabParamList } from '../../types/navigation';
import { PlaceExperience, UserBehaviorSummary } from '../../types/place';
import { getProfileAliasByPlacesCount, toSentenceTitle } from '../../utils';

type Props = BottomTabScreenProps<AppTabParamList, 'BehaviorSummary'>;

const MIN_PLACES_FOR_ANALYSIS = 3;

const DEFAULT_GRADIENT_COLORS: [string, string, string] = [
  '#F8E6E6',
  '#FFF3EA',
  '#FFFFFF',
];

const getAssetUri = (source: ImageSourcePropType): string | null => {
  const resolvedAsset = RNImage.resolveAssetSource(source);
  return resolvedAsset?.uri ?? null;
};

const getGradientFromAvatar = async (
  source: ImageSourcePropType,
): Promise<[string, string, string]> => {
  const uri = getAssetUri(source);

  if (!uri) {
    return DEFAULT_GRADIENT_COLORS;
  }

  const result = await ImageColors.getColors(uri, {
    fallback: DEFAULT_GRADIENT_COLORS[0],
    cache: true,
    key: uri,
  });

  if (result.platform === 'android') {
    return [
      result.lightVibrant ||
      result.vibrant ||
      result.dominant ||
      DEFAULT_GRADIENT_COLORS[0],
      result.lightMuted ||
      result.muted ||
      result.average ||
      DEFAULT_GRADIENT_COLORS[1],
      '#FFFFFF',
    ];
  }

  if (result.platform === 'ios') {
    return [
      result.primary || DEFAULT_GRADIENT_COLORS[0],
      result.secondary || result.background || DEFAULT_GRADIENT_COLORS[1],
      '#FFFFFF',
    ];
  }

  return DEFAULT_GRADIENT_COLORS;
};

export const BehaviorSummaryScreen = ({ navigation }: Props) => {
  const { user } = useAuthContext();
  const { colors } = useThemeMode();

  const [places, setPlaces] = useState<PlaceExperience[]>([]);
  const [summary, setSummary] = useState<UserBehaviorSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [gradientColors, setGradientColors] = useState<
    [string, string, string]
  >(DEFAULT_GRADIENT_COLORS);

  const isGeminiMode = FEATURES.RECOMMENDATION_MODE === 'gemini';
  const placesCount = places.length;

  const profileAlias = useMemo(
    () => getProfileAliasByPlacesCount(places.length),
    [places.length],
  );

  const avatar = profileAlias.icon;

  useEffect(() => {
    let mounted = true;

    const loadAvatarColors = async () => {
      try {
        const colorsFromAvatar = await getGradientFromAvatar(avatar);

        if (mounted) {
          setGradientColors(colorsFromAvatar);
        }
      } catch (error) {
        console.error(
          '[BehaviorSummaryScreen] Error obteniendo colores del avatar:',
          error,
        );

        if (mounted) {
          setGradientColors(DEFAULT_GRADIENT_COLORS);
        }
      }
    };

    loadAvatarColors();

    return () => {
      mounted = false;
    };
  }, [avatar]);

  const canGenerateSummary =
    isGeminiMode && places.length >= MIN_PLACES_FOR_ANALYSIS;

  const loadBehaviorData = useCallback(async () => {
    if (!user?.uid) {
      setPlaces([]);
      setSummary(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const savedPlaces = await listUserPlaceExperiences(user.uid);
      setPlaces(savedPlaces);

      try {
        const savedSummary = await getUserBehaviorSummary(user.uid);
        setSummary(savedSummary);
      } catch (summaryError) {
        console.error(
          '[BehaviorSummaryScreen] Error cargando resumen guardado:',
          summaryError,
        );
        setSummary(null);
      }
    } catch (error) {
      console.error('[BehaviorSummaryScreen] Error cargando lugares:', error);
      setPlaces([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const handleGenerateSummary = async () => {
    if (!user?.uid || !canGenerateSummary) {
      return;
    }

    try {
      setGenerating(true);

      const result = await generateAndSaveUserBehaviorSummary({
        userId: user.uid,
        places,
      });

      setSummary({
        ...result,
        placesCount: result.placesCount ?? places.length,
      });
    } catch (error) {
      console.error(
        '[BehaviorSummaryScreen] Error generando resumen:',
        error,
      );
    } finally {
      setGenerating(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBehaviorData();
    }, [loadBehaviorData]),
  );

  const summaryPlacesCount = summary?.placesCount ?? places.length;

  const canRegenerateSummary =
    !!summary &&
    canGenerateSummary &&
    places.length > summaryPlacesCount;

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
          <RNImage source={imageAssets.leftArrowIcon} style={styles.backIcon} />
        </Pressable>

        <LinearGradient
          colors={gradientColors}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[
            styles.heroCard,
            {
              borderColor: colors.border,
            },
          ]}>
          <View style={styles.avatarHalo}>
            <RNImage source={avatar} style={styles.avatar} />
          </View>

          <Text style={[styles.title, { color: colors.title }]}>
            Resumen de tu comportamiento
          </Text>

          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Gemini analiza tus lugares guardados para descubrir qué tipo de experiencias
            sueles capturar.
          </Text>

          <View style={[styles.counterPill, { backgroundColor: colors.input }]}>
            <Text style={[styles.counterText, { color: colors.brand }]}>
              {places.length} lugares registrados
            </Text>
          </View>
        </LinearGradient>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.brand} />
            <Text style={[styles.loadingText, { color: colors.muted }]}>
              Cargando tu bitácora...
            </Text>
          </View>
        ) : !isGeminiMode ? (
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <Text style={[styles.infoTitle, { color: colors.title }]}>
              Modo Gemini no activo
            </Text>

            <Text style={[styles.infoText, { color: colors.muted }]}>
              Esta sección requiere que RECOMMENDATION_MODE esté en gemini para
              generar el análisis con IA.
            </Text>
          </View>
        ) : places.length < MIN_PLACES_FOR_ANALYSIS ? (
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <Text style={[styles.infoTitle, { color: colors.title }]}>
              Aún necesitamos más lugares
            </Text>

            <Text style={[styles.infoText, { color: colors.muted }]}>
              Guarda al menos 3 experiencias para que Gemini pueda identificar
              patrones reales en tu comportamiento fotográfico.
            </Text>

            <AppButton
              title="Registrar nuevo lugar"
              onPress={() => navigation.navigate('CapturePlace')}
              variant="secondary"
            />
          </View>
        ) : summary ? (
          <View style={styles.resultContainer}>
            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}>
              <Text style={[styles.label, { color: colors.brand }]}>
                Perfil fotográfico
              </Text>

              <Text style={[styles.profileTitle, { color: colors.title }]}>
                {toSentenceTitle(summary.profileTitle)}
              </Text>

              <Text style={[styles.personalityType, { color: colors.muted }]}>
                Definimos a {user?.displayName || 'este explorador'} como un{' '}
                <Text style={[styles.personalityHighlight, { color: colors.brand }]}>
                  {toSentenceTitle(summary.personalityType)}
                </Text>
              </Text>

              <Text style={[styles.summaryText, { color: colors.muted }]}>
                {summary.summary}
              </Text>
            </View>

            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}>
              <Text style={[styles.label, { color: colors.brand }]}>
                Fortalezas visuales
              </Text>

              {summary.strengths.map(item => (
                <Text
                  key={item}
                  style={[styles.listItem, { color: colors.muted }]}>
                  • {item}
                </Text>
              ))}
            </View>

            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}>
              <Text style={[styles.label, { color: colors.brand }]}>
                Patrones detectados
              </Text>

              {summary.patterns.map(item => (
                <Text
                  key={item}
                  style={[styles.listItem, { color: colors.muted }]}>
                  • {item}
                </Text>
              ))}
            </View>

            <View
              style={[
                styles.summaryCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}>
              <Text style={[styles.label, { color: colors.brand }]}>
                Siguiente recomendación
              </Text>

              <Text style={[styles.summaryText, { color: colors.muted }]}>
                {summary.recommendation}
              </Text>
            </View>

            {canRegenerateSummary ? (
              <AppButton
                title="Regenerar análisis"
                onPress={handleGenerateSummary}
                loading={generating}
                variant="secondary"
              />
            ) : (
              <View
                style={[
                  styles.lockedButton,
                  {
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                  },
                ]}>
                <Text style={[styles.lockedButtonText, { color: colors.muted }]}>
                  Agrega un nuevo lugar para regenerar el análisis
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <Text style={[styles.infoTitle, { color: colors.title }]}>
              Tu perfil aún no ha sido generado
            </Text>

            <Text style={[styles.infoText, { color: colors.muted }]}>
              Gemini revisará nombres, descripciones, coordenadas, referencias
              Google, ratings y horarios para crear tu perfil fotográfico.
            </Text>

            <AppButton
              title="Generar resumen con IA"
              onPress={handleGenerateSummary}
              loading={generating}
              variant="secondary"
            />
          </View>
        )}
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
    paddingBottom: 46,
  },
  backIconButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  backIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 34,
    paddingTop: 34,
    paddingHorizontal: 26,
    paddingBottom: 28,
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 132,
    height: 132,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 10,
  },
  counterPill: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 16,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '900',
  },
  centerBox: {
    alignItems: 'center',
    marginTop: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 28,
    padding: 22,
    marginTop: 22,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  infoText: {
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
    marginBottom: 18,
  },
  resultContainer: {
    marginTop: 22,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 20,
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: '900',
  },
  personalityType: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
    lineHeight: 22,
  },
  personalityHighlight: {
    fontWeight: '900',
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },
  listItem: {
    fontSize: 15,
    lineHeight: 23,
    marginTop: 6,
  },
  avatarHalo: {
    width: 158,
    height: 158,
    borderRadius: 79,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.36)',
    marginBottom: 18,
  },
  lockedButton: {
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginTop: 4,
  },
  lockedButtonText: {
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
});