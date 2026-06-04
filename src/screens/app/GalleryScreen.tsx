import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppButton} from '../../components/AppButton';
import {PlaceCard} from '../../components/PlaceCard';
import {useAuthContext} from '../../context/AuthContext';
import {useThemeMode} from '../../hooks/useThemeMode';
import {listUserPlaceExperiences} from '../../services/places.service';
import {PlaceExperience} from '../../types/place';

export const GalleryScreen = () => {
  const {colors} = useThemeMode();
  const {user} = useAuthContext();

  const [places, setPlaces] = useState<PlaceExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  if (loading) {
    return (
      <SafeAreaView
        edges={['top']}
        style={[styles.centerContainer, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={[styles.loadingText, {color: colors.muted}]}>
          Cargando tus experiencias...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, {backgroundColor: colors.background}]}>
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
            <Text style={[styles.kicker, {color: colors.brand}]}>
              MyPickPlace
            </Text>
            <Text style={[styles.title, {color: colors.title}]}>
              Galería de lugares
            </Text>
            <Text style={[styles.subtitle, {color: colors.muted}]}>
              Aquí se muestran las experiencias que has guardado con foto,
              descripción y ubicación GPS.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={[styles.emptyCard, {backgroundColor: colors.card}]}>
            <Text style={styles.emoji}>🖼️</Text>
            <Text style={[styles.emptyTitle, {color: colors.title}]}>
              Galería vacía
            </Text>
            <Text style={[styles.emptySubtitle, {color: colors.muted}]}>
              Tus experiencias aparecerán aquí cuando empieces a guardar lugares.
            </Text>

            <AppButton title="Recargar galería" onPress={handleRefresh} />
          </View>
        }
        renderItem={({item}) => <PlaceCard place={item} />}
        showsVerticalScrollIndicator={false}
      />
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
});