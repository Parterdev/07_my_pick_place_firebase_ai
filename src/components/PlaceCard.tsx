import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useThemeMode} from '../hooks/useThemeMode';

export const PlaceCard = () => {
  const {colors} = useThemeMode();

  return (
    <View style={[styles.card, {backgroundColor: colors.card}]}>
      <Text style={styles.emoji}>📍</Text>
      <View style={styles.content}>
        <Text style={[styles.title, {color: colors.text}]}>
          Tu primera experiencia
        </Text>
        <Text style={[styles.subtitle, {color: colors.muted}]}>
          Pronto podrás guardar fotos, ubicación y recomendaciones.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  emoji: {
    fontSize: 34,
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
});