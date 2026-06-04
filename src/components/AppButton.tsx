import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import {useThemeMode} from '../hooks/useThemeMode';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  style?: ViewStyle;
}

export const AppButton = ({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  style,
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
        {
          backgroundColor,
          opacity: pressed || loading ? 0.75 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, {color: textColor}]}>{title}</Text>
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
  text: {
    fontSize: 15,
    fontWeight: '800',
  },
});