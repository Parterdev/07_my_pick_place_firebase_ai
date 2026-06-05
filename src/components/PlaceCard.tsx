import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome-free-solid';
import CloseIcon from '../assets/images/close_icon.svg';
import { useThemeMode } from '../hooks/useThemeMode';
import { PlaceExperience } from '../types/place';
import { formatCoordinate, formatPlaceDate } from '../utils/formatters';

interface PlaceCardProps {
  place: PlaceExperience;
  onPress?: () => void;
  onDeletePress?: () => void;
}

export const PlaceCard = ({ place, onPress, onDeletePress }: PlaceCardProps) => {
  const { colors } = useThemeMode();

  if (!place) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          opacity: pressed ? 0.9 : 1,
        },
      ]}>
      <Pressable
        onPress={onDeletePress}
        hitSlop={10}
        style={({ pressed }) => [
          styles.deleteButton,
          {
            backgroundColor: colors.card,
            opacity: pressed ? 0.75 : 1,
          },
        ]}>
        <CloseIcon width={28} height={28} />
      </Pressable>

      {place.imageUrl ? (
        <Image source={{ uri: place.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.emptyImage, { backgroundColor: colors.input }]}>
          <Text style={styles.emptyImageEmoji}>🖼️</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.title }]} numberOfLines={1}>
          {place.title || 'Lugar sin nombre'}
        </Text>

        <Text
          style={[styles.description, { color: colors.muted }]}
          numberOfLines={2}>
          {place.description || 'Sin descripción registrada.'}
        </Text>

        <View
          style={[
            styles.locationBox,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
            },
          ]}>
          <View style={styles.inlineInfoRow}>
            <FontAwesome
              name="location-dot"
              size={14}
              color={colors.brand}
              style={styles.inlineIcon}
            />

            <Text style={[styles.locationText, { color: colors.muted }]}>
              {formatCoordinate(place.latitude)}, {formatCoordinate(place.longitude)}
            </Text>
          </View>
        </View>

        <View style={styles.dateRow}>
          <FontAwesome
            name="clock"
            size={13}
            color={colors.brand}
            style={styles.inlineIcon}
          />

          <Text style={[styles.date, { color: colors.muted }]}>
            {formatPlaceDate(place.createdAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    overflow: 'hidden',
    marginBottom: 18,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: '100%',
    height: 190,
  },
  emptyImage: {
    width: '100%',
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyImageEmoji: {
    fontSize: 46,
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
  },
  inlineInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  inlineIcon: {
    marginRight: 7,
  },
});