import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemeMode } from '../hooks/useThemeMode';
import { PlaceExperience } from '../types/place';
import { formatCoordinate, formatPlaceDate } from '../utils/formatters';

interface PlaceCardProps {
  place: PlaceExperience;
  onPress?: () => void;
}

export const PlaceCard = ({ place, onPress }: PlaceCardProps) => {
  const { colors } = useThemeMode();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <Image source={{ uri: place.imageUrl }} style={styles.image} />

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.title }]} numberOfLines={1}>
          {place.title}
        </Text>

        <Text
          style={[styles.description, { color: colors.muted }]}
          numberOfLines={2}>
          {place.description}
        </Text>

        <View
          style={[
            styles.locationBox,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
            },
          ]}>
          <Text style={[styles.locationText, { color: colors.muted }]}>
            📍 {formatCoordinate(place.latitude)}, {formatCoordinate(place.longitude)}
          </Text>
        </View>

        <Text style={[styles.date, { color: colors.muted }]}>
          🕒 {formatPlaceDate(place.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: 18,
  },
  image: {
    width: '100%',
    height: 190,
  },
  content: {
    padding: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  locationBox: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    marginTop: 10,
  },
});