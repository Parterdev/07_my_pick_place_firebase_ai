import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {useThemeMode} from '../hooks/useThemeMode';
import { typography } from '../theme/typography';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AppButton = ({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  style,
  textStyle,
}: AppButtonProps) => {
  const {colors} = useThemeMode();

  const backgroundColor =
    variant === 'primary'
      ? colors.button
      : variant === 'secondary'
        ? colors.brand
        : 'transparent';

  const textColor =
    variant === 'primary'
      ? colors.buttonText
      : variant === 'secondary'
        ? colors.white
        : colors.brand;

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({pressed}) => [
        styles.button,
        variant === 'ghost' && styles.ghostButton,
        {
          backgroundColor,
          opacity: pressed || loading ? 0.75 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, {color: textColor}, textStyle]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 52,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  ghostButton: {
    width: 'auto',
    height: 'auto',
    paddingVertical: 8,
    paddingHorizontal: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 15,
    fontFamily: typography.fontFamily.extraBold,
  },
});