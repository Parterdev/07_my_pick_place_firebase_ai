import React from 'react';
import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import {useThemeMode} from '../hooks/useThemeMode';
import { typography } from '../theme/typography';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  emoji?: string;
  imageSource?: ImageSourcePropType;
}

export const AuthHeader = ({
  title,
  subtitle,
  emoji = '🧭',
  imageSource,
}: AuthHeaderProps) => {
  const {colors} = useThemeMode();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.illustration,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={styles.emoji}>{emoji}</Text>
        )}
      </View>

      <Text style={[styles.title, {color: colors.title}]}>{title}</Text>
      <Text style={[styles.subtitle, {color: colors.muted}]}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 26,
  },
  illustration: {
    width: 132,
    height: 132,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: 86,
    height: 86,
  },
  emoji: {
    fontSize: 58,
  },
  title: {
    fontSize: 25,
    fontFamily: typography.fontFamily.black,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 6,
  },
});