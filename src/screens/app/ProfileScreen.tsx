import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Pressable,
  Text,
  View,
} from 'react-native';
import { imageAssets } from '../../assets/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { useAuthContext } from '../../context/AuthContext';
import { useThemeMode } from '../../hooks/useThemeMode';
import { listUserPlaceExperiences } from '../../services/places.service';
import { getProfileAliasByPlacesCount } from '../../utils/profileAlias';
import { typography } from '../../theme/typography';

export const ProfileScreen = () => {
  const { user, logout } = useAuthContext();
  const { colors, mode, toggleTheme } = useThemeMode();

  const [loading, setLoading] = useState(false);
  const [placesCount, setPlacesCount] = useState(0);
  const [loadingAlias, setLoadingAlias] = useState(false);

  const profileAlias = getProfileAliasByPlacesCount(placesCount);
  const isDarkMode = mode === 'dark';

  const themeIcon = isDarkMode ? imageAssets.moonIcon : imageAssets.sunIcon;

  const themeTitle = isDarkMode ? 'Modo oscuro activo' : 'Modo claro activo';

  const themeSubtitle = isDarkMode
    ? 'Toca para cambiar a una apariencia clara.'
    : 'Toca para cambiar a una apariencia oscura.';

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
      style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Image source={profileAlias.icon} style={styles.avatarImage} />

        <Text style={[styles.title, { color: colors.title }]}>
          {user?.displayName || 'Usuario MyPickPlace'}
        </Text>

        <View style={[styles.aliasPill, { backgroundColor: colors.input }]}>
          {loadingAlias ? (
            <ActivityIndicator size="small" color={colors.brand} />
          ) : (
            <>
              <Text style={[styles.aliasText, { color: colors.brand }]}>
                {profileAlias.alias}
              </Text>

              <Text style={[styles.aliasCount, { color: colors.muted }]}>
                {placesCount} {placesCount === 1 ? 'experiencia' : 'experiencias'}
              </Text>
            </>
          )}
        </View>

        <Text style={[styles.email, { color: colors.muted }]}>
          {user?.email}
        </Text>

        <Pressable
          onPress={toggleTheme}
          style={({ pressed }) => [
            styles.option,
            {
              borderColor: colors.border,
              backgroundColor: colors.input,
              opacity: pressed ? 0.8 : 1,
            },
          ]}>
          <View style={styles.optionContent}>
            <Text style={[styles.optionTitle, { color: colors.title }]}>
              {themeTitle}
            </Text>

            <Text style={[styles.optionSubtitle, { color: colors.muted }]}>
              {themeSubtitle}
            </Text>
          </View>

          <View style={[styles.themeIconBox, { backgroundColor: colors.card }]}>
            <Image source={themeIcon} style={styles.themeIcon} />
          </View>
        </Pressable>

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
    fontFamily: typography.fontFamily.black,
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
    fontFamily: typography.fontFamily.black,
  },
  aliasCount: {
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
    marginTop: 2,
  },
  email: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
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
    fontFamily: typography.fontFamily.extraBold,
  },
  optionSubtitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    marginTop: 3,
  },
  logoutButton: {
    marginTop: 4,
  },
  themeIconBox: {
    width: 54,
    height: 54,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
});