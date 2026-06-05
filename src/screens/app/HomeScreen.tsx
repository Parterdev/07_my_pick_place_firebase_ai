import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@react-native-vector-icons/fontawesome-free-solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { useAuthContext } from '../../context/AuthContext';
import { useThemeMode } from '../../hooks/useThemeMode';
import { listUserPlaceExperiences } from '../../services/places.service';
import { imageAssets } from '../../assets/images';
import {typography} from '../../theme/typography';

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuthContext();
  const { colors } = useThemeMode();
  const { width } = useWindowDimensions();

  const horizontalPadding = 44;
  const cardsGap = 14;
  const metricCardSize = (width - horizontalPadding - cardsGap) / 2;

  const [placesCount, setPlacesCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(false);

  const loadPlacesCount = useCallback(async () => {
    if (!user?.uid) {
      setPlacesCount(0);
      return;
    }

    try {
      setLoadingCount(true);
      const places = await listUserPlaceExperiences(user.uid);
      setPlacesCount(places.length);
    } catch (error) {
      console.error('[HomeScreen] Error cargando contador:', error);
      setPlacesCount(0);
    } finally {
      setLoadingCount(false);
    }
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      loadPlacesCount();
    }, [loadPlacesCount]),
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.kicker, { color: colors.brand }]}>
          MyPickPlace
        </Text>

        <View style={styles.greetingRow}>
          <Text style={[styles.title, { color: colors.title }]}>
            Hola, {user?.displayName || 'explorador'}
          </Text>

          <FontAwesome
            name="hands-clapping"
            size={34}
            color={colors.brand}
            style={styles.greetingIcon}
          />
        </View>

        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Guarda lugares nuevos, revive tus experiencias y descubre sitios
          similares cerca de ti.
        </Text>

        <View style={[styles.heroCard, { backgroundColor: colors.card }]}>
          <Image source={imageAssets.imageIcon} style={styles.heroImage} />

          <Text style={[styles.heroTitle, { color: colors.title }]}>
            ¿Capturamos algo ahora?
          </Text>

          <Text style={[styles.heroSubtitle, { color: colors.muted }]}>
            Registra ese sitio que llamó tu atención y conviértelo en un momento para recordar.
          </Text>

          <AppButton
            title="Iniciar experiencia"
            onPress={() => navigation.navigate('CapturePlace')}
          />
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <View style={[styles.infoIconBox, { backgroundColor: colors.input }]}>
            <FontAwesome
              name="location-dot"
              size={26}
              color={colors.brand}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.title }]}>
              Tu bitácora de lugares
            </Text>

            <Text style={[styles.infoSubtitle, { color: colors.muted }]}>
              Cada sitio registrado se organizará automáticamente en tu galería.
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View
            style={[
              styles.metricCard,
              {
                width: metricCardSize,
                height: metricCardSize,
                backgroundColor: colors.card,
              },
            ]}>
            <View style={[styles.metricIconBox, { backgroundColor: colors.input }]}>
              <FontAwesome
                name="map-location-dot"
                size={25}
                color={colors.brand}
              />
            </View>

            <View style={styles.metricValueBox}>
              {loadingCount ? (
                <ActivityIndicator color={colors.brand} />
              ) : (
                <Text style={[styles.metricValue, { color: colors.title }]}>
                  {placesCount}
                </Text>
              )}
            </View>

            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[styles.metricLabel, { color: colors.muted }]}>
              Lugares
            </Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate('BehaviorSummary')}
            style={({ pressed }) => [
              styles.metricCard,
              {
                width: metricCardSize,
                height: metricCardSize,
                backgroundColor: colors.card,
                opacity: pressed ? 0.84 : 1,
              },
            ]}>
            <View style={[styles.metricIconBox, { backgroundColor: colors.input }]}>
              <FontAwesome
                name="wand-magic-sparkles"
                size={25}
                color={colors.brand}
              />
            </View>

            <View style={styles.metricValueBox}>
              <Text style={[styles.metricValue, { color: colors.title }]}>
                IA
              </Text>
            </View>

            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[styles.metricLabel, { color: colors.muted }]}>
              Perfil de exploración
            </Text>
          </Pressable>
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
  kicker: {
    fontSize: 20,
    fontFamily: typography.fontFamily.black,
    marginTop: 10,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    flex: 1,
    fontSize: 30,
    fontFamily: typography.fontFamily.black,
  },
  greetingIcon: {
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    fontFamily: typography.fontFamily.medium,
  },
  heroCard: {
    borderRadius: 32,
    padding: 24,
    marginTop: 26,
    alignItems: 'center',
  },
  heroImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  heroTitle: {
    width: '100%',
    fontSize: 22,
    fontFamily: typography.fontFamily.black,
    textAlign: 'center',
  },
  heroSubtitle: {
    width: '100%',
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 14,
    textAlign: 'center',
  },
  infoCard: {
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  infoIconBox: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: typography.fontFamily.extraBold,
  },
  infoSubtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    marginTop: 4,
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 18,
  },
  metricCard: {
    borderRadius: 24,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricIconBox: {
    width: 50,
    height: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontFamily: typography.fontFamily.black,
  },
  metricValueBox: {
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  metricLabel: {
    width: '100%',
    height: 36,
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 17,
    marginTop: 2,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});