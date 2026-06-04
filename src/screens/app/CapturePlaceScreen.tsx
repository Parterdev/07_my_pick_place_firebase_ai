import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppButton} from '../../components/AppButton';
import {useThemeMode} from '../../hooks/useThemeMode';

export const CapturePlaceScreen = () => {
  const {colors} = useThemeMode();

  return (
    <SafeAreaView 
      edges={['top']} 
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.card, {backgroundColor: colors.card}]}>
        <Text style={styles.emoji}>📸</Text>
        <Text style={[styles.title, {color: colors.text}]}>
          Captura de lugar
        </Text>
        <Text style={[styles.subtitle, {color: colors.muted}]}>
          Esta pantalla se conectará con cámara, ubicación y Firebase Storage en la siguiente etapa.
        </Text>

        <AppButton title="Próximamente" onPress={() => {}} />
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
    padding: 28,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 16,
  },
});