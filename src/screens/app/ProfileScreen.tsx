import React, {useState} from 'react';
import {Alert, StyleSheet, Switch, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppButton} from '../../components/AppButton';
import {useAuthContext} from '../../context/AuthContext';
import {useThemeMode} from '../../hooks/useThemeMode';

export const ProfileScreen = () => {
  const {user, logout} = useAuthContext();
  const {colors, mode, toggleTheme} = useThemeMode();
  const [loading, setLoading] = useState(false);

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
        <Text style={styles.avatar}>👤</Text>

        <Text style={[styles.title, {color: colors.text}]}>
          {user?.displayName || 'Usuario MyPickPlace'}
        </Text>

        <Text style={[styles.email, {color: colors.muted}]}>
          {user?.email}
        </Text>

        <View style={[styles.option, {borderColor: colors.border}]}>
          <View>
            <Text style={[styles.optionTitle, {color: colors.text}]}>
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
  avatar: {
    fontSize: 70,
  },
  title: {
    fontSize: 23,
    fontWeight: '900',
    marginTop: 14,
  },
  email: {
    fontSize: 14,
    marginTop: 6,
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