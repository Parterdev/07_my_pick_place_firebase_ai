import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GalleryStackParamList } from '../../types/navigation';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { PlaceCard } from '../../components/PlaceCard';
import { useAuthContext } from '../../context/AuthContext';
import { useThemeMode } from '../../hooks/useThemeMode';
import {
  deletePlaceExperience,
  listUserPlaceExperiences
} from '../../services/places.service';
import { PlaceExperience } from '../../types/place';
import {imageAssets} from '../../assets/images';

type Props = NativeStackScreenProps<GalleryStackParamList, 'GalleryList'>;

export const GalleryScreen = ({ navigation }: Props) => {
  const { colors } = useThemeMode();
  const { user } = useAuthContext();

  const [places, setPlaces] = useState<PlaceExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [placeToDelete, setPlaceToDelete] = useState<PlaceExperience | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadPlaces = useCallback(async () => {
    if (!user?.uid) {
      setPlaces([]);
      setLoading(false);
      return;
    }

    try {
      const result = await listUserPlaceExperiences(user.uid);
      setPlaces(result);
    } catch (error) {
      console.error('[GalleryScreen] Error cargando galería:', error);
      Alert.alert(
        'Galería',
        'No se pudieron cargar tus experiencias guardadas.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadPlaces();
    }, [loadPlaces]),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPlaces();
  };

  const openDeleteModal = (place: PlaceExperience) => {
    setPlaceToDelete(place);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    if (deleting) {
      return;
    }

    setDeleteModalVisible(false);
    setPlaceToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!placeToDelete) {
      return;
    }

    try {
      setDeleting(true);

      await deletePlaceExperience(placeToDelete);

      setPlaces(currentPlaces =>
        currentPlaces.filter(place => place.id !== placeToDelete.id),
      );

      setDeleteModalVisible(false);
      setPlaceToDelete(null);
    } catch (error) {
      console.error('[GalleryScreen] Error eliminando experiencia:', error);

      Alert.alert(
        'Eliminar experiencia',
        'No se pudo eliminar el lugar. Inténtalo nuevamente.',
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={[styles.loadingText, { color: colors.muted }]}>
          Cargando tus experiencias...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={places}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.content,
          places.length === 0 && styles.emptyContent,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.kicker, { color: colors.brand }]}>
              MyPickPlace
            </Text>
            <Text style={[styles.title, { color: colors.title }]}>
              Galería de lugares
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Aquí se muestran las experiencias que has guardado con foto,
              descripción y ubicación GPS.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Text style={styles.emoji}>🖼️</Text>
            <Text style={[styles.emptyTitle, { color: colors.title }]}>
              Galería vacía
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
              Tus experiencias aparecerán aquí cuando empieces a guardar lugares.
            </Text>

            <AppButton title="Recargar galería" onPress={handleRefresh} />
          </View>
        }
        renderItem={({ item }) => (
          <PlaceCard
            place={item}
            onPress={() => navigation.navigate('PlaceDetail', { place: item })}
            onDeletePress={() => openDeleteModal(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteModal}>
        <View style={styles.modalOverlay}>
          <View style={[styles.deleteCard, { backgroundColor: colors.card }]}>
            <Image source={imageAssets.cryingIcon} style={styles.deleteImage} />

            <Text style={[styles.deleteTitle, { color: colors.title }]}>
              ¿Eliminar experiencia?
            </Text>

            <Text style={[styles.deleteText, { color: colors.muted }]}>
              Esta acción eliminará el lugar de tu galería y también su imagen
              almacenada en Firebase Storage.
            </Text>

            <Text style={[styles.deletePlaceName, { color: colors.brand }]}>
              {placeToDelete?.title}
            </Text>

            <View style={styles.deleteActions}>
              <View style={styles.actionButton}>
                <AppButton
                  title="Cancelar"
                  onPress={closeDeleteModal}
                  variant="secondary"
                />
              </View>

              <View style={styles.actionButton}>
                <AppButton
                  title="Eliminar"
                  onPress={handleConfirmDelete}
                  loading={deleting}
                />
              </View>
            </View>
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 22,
    paddingBottom: 36,
  },
  emptyContent: {
    flexGrow: 1,
  },
  header: {
    marginBottom: 22,
  },
  kicker: {
    fontSize: 14,
    fontWeight: '900',
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  emptyCard: {
    borderRadius: 32,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
  },
  emoji: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  deleteCard: {
    width: '100%',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
  },
  deleteImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  deleteTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 12,
    textAlign: 'center',
  },
  deleteText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 10,
  },
  deletePlaceName: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 14,
    textAlign: 'center',
  },
  deleteActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
  },
});