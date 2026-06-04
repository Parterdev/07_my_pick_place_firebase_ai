import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {useAuthContext} from '../context/AuthContext';
import {useThemeMode} from '../hooks/useThemeMode';
import {AuthNavigator} from './AuthNavigator';
import {AppTabs} from './AppTabs';

export const RootNavigator = () => {
  const {user, initializing} = useAuthContext();
  const {colors} = useThemeMode();

  if (initializing) {
    return (
      <View style={[styles.loading, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.brand} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});