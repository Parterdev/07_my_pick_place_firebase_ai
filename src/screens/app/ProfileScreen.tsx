import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import {AppButton} from '../../components/AppButton';
import {useAuthContext} from '../../context/AuthContext';
import {useThemeMode} from '../../hooks/useThemeMode';
import {listUserPlaceExperiences} from '../../services/places.service';
import {getProfileAliasByPlacesCount} from '../../utils/profileAlias';

export const ProfileScreen = () => {
  const {user, logout} = useAuthContext();
  const {colors, mode, toggleTheme} = useThemeMode();

  const [loading, setLoading] = useState(false);
  const [placesCount, setPlacesCount] = useState(0);
  const [loadingAlias, setLoadingAlias] = useState(false);

  const profileAlias = getProfileAliasByPlacesCount(placesCount);

  const loadProfileStats = useCallback(async () => {
    if (!user?.uid) {
      setPlacesCount(0);
      return;
    }

    try {
      setLoadingAlias(true);
      const places = await listUserPlaceExperiences(user.uid);
      setPlacesCount(places.length);
    } catch (error) {
      console.error('[ProfileScreen] Error cargando alias:', error);
      setPlacesCount(0);
    } finally {
      setLoadingAlias(false);
    }
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      loadProfileStats();
    }, [loadProfileStats]),
  );

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch {
      Alert.alert('Cerrar sesión', 'No se pudo cerrar la sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.card, {backgroundColor: colors.card}]}>
        <Image source={profileAlias.icon} style={styles.avatarImage} />

        <Text style={[styles.title, {color: colors.title}]}>
          {user?.displayName || 'Usuario MyPickPlace'}
        </Text>

        <View style={[styles.aliasPill, {backgroundColor: colors.input}]}>
          {loadingAlias ? (
            <ActivityIndicator size="small" color={colors.brand} />
          ) : (
            <>
              <Text style={[styles.aliasText, {color: colors.brand}]}>
                {profileAlias.alias}
              </Text>

              <Text style={[styles.aliasCount, {color: colors.muted}]}>
                {placesCount} {placesCount === 1 ? 'experiencia' : 'experiencias'}
              </Text>
            </>
          )}
        </View>

        <Text style={[styles.email, {color: colors.muted}]}>
          {user?.email}
        </Text>

        <View style={[styles.option, {borderColor: colors.border}]}>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, {color: colors.title}]}>
              Tema oscuro
            </Text>

            <Text style={[styles.optionSubtitle, {color: colors.muted}]}>
              Cambia la apariencia de la app.
            </Text>
          </View>

          <Switch value={mode === 'dark'} onValueChange={toggleTheme} />
        </View>

        <AppButton
          title="Cerrar sesión"
          onPress={handleLogout}
          loading={loading}
          style={styles.logoutButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 32,
    padding: 26,
    alignItems: 'center',
  },
  avatarImage: {
    width: 132,
    height: 132,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  title: {
    fontSize: 23,
    fontWeight: '900',
    marginTop: 4,
    textAlign: 'center',
  },
  aliasPill: {
    minHeight: 54,
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 9,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aliasText: {
    fontSize: 15,
    fontWeight: '900',
  },
  aliasCount: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  email: {
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
  },
  option: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginTop: 26,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionContent: {
    flex: 1,
    paddingRight: 12,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  optionSubtitle: {
    fontSize: 13,
    marginTop: 3,
  },
  logoutButton: {
    marginTop: 4,
  },
});