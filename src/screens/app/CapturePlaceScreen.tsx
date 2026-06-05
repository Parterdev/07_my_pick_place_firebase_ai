import React, { useState } from 'react';
import LottieView from 'lottie-react-native';
import {
  Alert,
  Image,
  Keyboard,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Asset } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { useAuthContext } from '../../context/AuthContext';
import { useThemeMode } from '../../hooks/useThemeMode';
import { createPlaceExperience } from '../../services/places.service';
import { PlaceExperience, PlaceLocation } from '../../types/place';
import { takePlacePhoto } from '../../utils/camera';
import { getCurrentPlaceLocation } from '../../utils/location';
import {
  requestCameraPermission,
  requestLocationPermission,
} from '../../utils/permissions';
import {svgAssets} from '../../assets/images';

const confettiAnimation = require('../../assets/lotties/ConfettiAnimation.json');
const DoneIcon = svgAssets.doneIcon;

export const CapturePlaceScreen = ({ navigation }: { navigation: any }) => {
  const { colors } = useThemeMode();
  const { user } = useAuthContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<Asset | null>(null);
  const [location, setLocation] = useState<PlaceLocation | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [createdPlace, setCreatedPlace] = useState<PlaceExperience | null>(null);

  const handleTakePhoto = async () => {
    try {
      setLoadingPhoto(true);

      const hasPermission = await requestCameraPermission();

      if (!hasPermission) {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a la cámara para capturar el lugar.',
        );
        return;
      }

      const selectedPhoto = await takePlacePhoto();

      if (selectedPhoto) {
        setPhoto(selectedPhoto);
      }
    } catch (error) {
      Alert.alert('Cámara', 'No se pudo capturar la fotografía.');
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handleGetLocation = async () => {
    try {
      setLoadingLocation(true);

      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a tu ubicación para guardar las coordenadas del lugar.',
        );
        return;
      }

      const currentLocation = await getCurrentPlaceLocation();
      setLocation(currentLocation);
    } catch (error) {
      Alert.alert(
        'Ubicación',
        'No se pudo obtener la ubicación actual. Verifica que el GPS esté activo.',
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSavePlace = async () => {
    if (!user?.uid) {
      Alert.alert('Sesión', 'Debes iniciar sesión para guardar un lugar.');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Validación', 'Ingresa el nombre del lugar.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Validación', 'Ingresa una breve descripción.');
      return;
    }

    if (!photo) {
      Alert.alert('Validación', 'Primero captura una fotografía del lugar.');
      return;
    }

    if (!location) {
      Alert.alert('Validación', 'Primero obtén la ubicación del lugar.');
      return;
    }

    try {
      setSaving(true);

      const savedPlace = await createPlaceExperience({
        userId: user.uid,
        title,
        description,
        photo,
        location,
      });

      Keyboard.dismiss();

      setCreatedPlace(savedPlace);
      setSuccessModalVisible(true);

      setTitle('');
      setDescription('');
      setPhoto(null);
      setLocation(null);
    } catch (error: any) {
      console.error('[CapturePlaceScreen] Error al guardar:', error);

      Alert.alert(
        'Guardar lugar',
        error?.message ||
        'No se pudo guardar la experiencia. Inténtalo nuevamente.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessOk = () => {
    if (!createdPlace) {
      setSuccessModalVisible(false);
      return;
    }

    setSuccessModalVisible(false);

    navigation.navigate('Gallery', {
      screen: 'PlaceDetail',
      params: {
        place: createdPlace,
      },
    });
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.headerCard, { backgroundColor: colors.card }]}>
          <Text style={styles.emoji}>📸📍</Text>

          <Text style={[styles.title, { color: colors.title }]}>
            Captura de lugar
          </Text>

          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Registra una experiencia con fotografía, descripción y ubicación GPS.
          </Text>
        </View>

        <View style={[styles.formCard, { backgroundColor: colors.card }]}>
          <AppInput
            icon="🏷️"
            label="Nombre del lugar"
            placeholder="Ej. Parque La Carolina"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="words"
          />

          <AppInput
            icon="📝"
            label="Descripción"
            placeholder="Describe brevemente tu experiencia"
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.textArea}
          />

          <View style={styles.previewContainer}>
            {photo?.uri ? (
              <Image source={{ uri: photo.uri }} style={styles.previewImage} />
            ) : (
              <View
                style={[
                  styles.emptyPreview,
                  {
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                  },
                ]}>
                <Text style={styles.previewEmoji}>🖼️</Text>
                <Text style={[styles.previewText, { color: colors.muted }]}>
                  Aún no has capturado una foto
                </Text>
              </View>
            )}
          </View>

          <AppButton
            title={photo ? 'Cambiar fotografía' : 'Tomar fotografía'}
            onPress={handleTakePhoto}
            loading={loadingPhoto}
            variant="secondary"
          />

          <View
            style={[
              styles.locationBox,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
              },
            ]}>
            <Text style={[styles.locationTitle, { color: colors.text }]}>
              Ubicación GPS
            </Text>

            {location ? (
              <>
                <Text style={[styles.locationText, { color: colors.muted }]}>
                  Latitud: {location.latitude.toFixed(6)}
                </Text>
                <Text style={[styles.locationText, { color: colors.muted }]}>
                  Longitud: {location.longitude.toFixed(6)}
                </Text>
              </>
            ) : (
              <Text style={[styles.locationText, { color: colors.muted }]}>
                Aún no se ha obtenido la ubicación.
              </Text>
            )}
          </View>

          <AppButton
            title={location ? 'Actualizar ubicación' : 'Obtener ubicación'}
            onPress={handleGetLocation}
            loading={loadingLocation}
            variant="secondary"
          />

          <AppButton
            title="Guardar experiencia"
            onPress={handleSavePlace}
            loading={saving}
          />
        </View>
      </ScrollView>
      <Modal
        visible={successModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessOk}>
        <View style={styles.modalOverlay}>
          <View style={[styles.successCard, { backgroundColor: colors.card }]}>
            <View style={styles.successIconWrapper}>
              <DoneIcon width={130} height={130} />

              <LottieView
                source={confettiAnimation}
                autoPlay
                loop={false}
                style={styles.confettiOverlay}
              />
            </View>

            <Text style={[styles.successTitle, { color: colors.title }]}>
              Lugar guardado
            </Text>

            <Text style={[styles.successText, { color: colors.muted }]}>
              Tu experiencia fue guardada correctamente. Ahora puedes revisar el
              detalle del lugar.
            </Text>

            <AppButton title="OK" onPress={handleSuccessOk} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 22,
    paddingBottom: 36,
  },
  headerCard: {
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
  },
  emoji: {
    fontSize: 58,
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    marginTop: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  formCard: {
    borderRadius: 30,
    padding: 20,
  },
  textArea: {
    minHeight: 82,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  previewContainer: {
    marginTop: 4,
    marginBottom: 10,
  },
  previewImage: {
    width: '100%',
    height: 210,
    borderRadius: 24,
  },
  emptyPreview: {
    width: '100%',
    height: 190,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewEmoji: {
    fontSize: 42,
  },
  previewText: {
    marginTop: 8,
    fontSize: 14,
  },
  locationBox: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  locationText: {
    fontSize: 13,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  successCard: {
    width: '100%',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginTop: 4,
    textAlign: 'center',
  },
  successText: {
  fontSize: 15,
  lineHeight: 22,
  textAlign: 'center',
  marginTop: 10,
  marginBottom: 16,
},
  successIconWrapper: {
    width: 190,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  confettiOverlay: {
    position: 'absolute',
    width: 210,
    height: 210,
  },
});