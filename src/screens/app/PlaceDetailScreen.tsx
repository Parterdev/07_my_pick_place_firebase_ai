import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppButton} from '../../components/AppButton';
import {useThemeMode} from '../../hooks/useThemeMode';
import {GalleryStackParamList} from '../../types/navigation';
import {formatCoordinate, formatPlaceDate} from '../../utils/formatters';

type Props = NativeStackScreenProps<GalleryStackParamList, 'PlaceDetail'>;

export const PlaceDetailScreen = ({route, navigation}: Props) => {
  const {colors} = useThemeMode();
  const {place} = route.params;

  const openInGoogleMaps = async () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`;
    await Linking.openURL(url);
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <AppButton
          title="← Volver a galería"
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={styles.backButton}
          textStyle={styles.backButtonText}
        />

        <View style={[styles.card, {backgroundColor: colors.card}]}>
          {place.imageUrl ? (
            <Image source={{uri: place.imageUrl}} style={styles.image} />
          ) : (
            <View style={[styles.emptyImage, {backgroundColor: colors.input}]}>
              <Text style={styles.emptyImageEmoji}>🖼️</Text>
            </View>
          )}

          <View style={styles.body}>
            <Text style={[styles.kicker, {color: colors.brand}]}>
              Detalle de experiencia
            </Text>

            <Text style={[styles.title, {color: colors.title}]}>
              {place.title}
            </Text>

            <Text style={[styles.description, {color: colors.muted}]}>
              {place.description}
            </Text>

            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                },
              ]}>
              <Text style={[styles.infoTitle, {color: colors.title}]}>
                Ubicación registrada
              </Text>

              <Text style={[styles.infoText, {color: colors.muted}]}>
                Latitud: {formatCoordinate(place.latitude)}
              </Text>

              <Text style={[styles.infoText, {color: colors.muted}]}>
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
              <Text style={[styles.infoTitle, {color: colors.title}]}>
                Fecha de registro
              </Text>

              <Text style={[styles.infoText, {color: colors.muted}]}>
                {formatPlaceDate(place.createdAt)}
              </Text>
            </View>

            <AppButton
              title="Abrir ubicación en Google Maps"
              onPress={openInGoogleMaps}
              variant="secondary"
            />

            <View
              style={[
                styles.aiBox,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                },
              ]}>
              <Text style={styles.aiEmoji}>✨</Text>

              <Text style={[styles.aiTitle, {color: colors.title}]}>
                Recomendaciones con IA
              </Text>

              <Text style={[styles.aiText, {color: colors.muted}]}>
                En la siguiente etapa, esta sección mostrará sugerencias de
                lugares similares, descripciones inteligentes y recomendaciones
                basadas en la experiencia guardada.
              </Text>
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
  kicker: {
    fontSize: 13,
    fontWeight: '900',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8,
  },
  description: {
    fontSize: 16,
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
    fontWeight: '900',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginTop: 3,
  },
  aiBox: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
    marginTop: 20,
    alignItems: 'center',
  },
  aiEmoji: {
    fontSize: 40,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 10,
  },
  aiText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 0,
    marginBottom: 14,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '900',
  },
});