import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@react-native-vector-icons/fontawesome-free-solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { useAuthContext } from '../../context/AuthContext';
import { useThemeMode } from '../../hooks/useThemeMode';
import { listUserPlaceExperiences } from '../../services/places.service';
import {imageAssets} from '../../assets/images';

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuthContext();
  const { colors } = useThemeMode();

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
          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <View style={[styles.metricIconBox, { backgroundColor: colors.input }]}>
              <FontAwesome
                name="map-location-dot"
                size={25}
                color={colors.brand}
              />
            </View>

            {loadingCount ? (
              <ActivityIndicator color={colors.brand} style={styles.loader} />
            ) : (
              <Text style={[styles.metricValue, { color: colors.title }]}>
                {placesCount}
              </Text>
            )}

            <Text style={[styles.metricLabel, { color: colors.muted }]}>
              Lugares
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <View style={[styles.metricIconBox, { backgroundColor: colors.input }]}>
              <FontAwesome
                name="wand-magic-sparkles"
                size={25}
                color={colors.brand}
              />
            </View>

            <Text style={[styles.metricValue, { color: colors.title }]}>IA</Text>

            <Text style={[styles.metricLabel, { color: colors.muted }]}>
              Próximo
            </Text>
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
  kicker: {
    fontSize: 14,
    fontWeight: '900',
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
    fontWeight: '900',
  },
  greetingIcon: {
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
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
    fontWeight: '900',
    textAlign: 'center',
  },
  heroSubtitle: {
    width: '100%',
    fontSize: 14,
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
    fontWeight: '800',
  },
  infoSubtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 18,
  },
  metricCard: {
    flex: 1,
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
    minHeight: 142,
    justifyContent: 'center',
  },
  metricIconBox: {
    width: 52,
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 10,
  },
  metricLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  loader: {
    marginTop: 12,
    marginBottom: 4,
  },
});