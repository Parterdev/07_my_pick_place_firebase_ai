import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  Text,
} from 'react-native';
import {useThemeMode} from '../hooks/useThemeMode';

interface AppInputProps extends TextInputProps {
  label?: string;
  icon?: string;
}

export const AppInput = ({label, icon, style, ...props}: AppInputProps) => {
  const {colors} = useThemeMode();

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, {color: colors.muted}]}>{label}</Text> : null}

      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
          },
        ]}>
        {icon ? <Text style={styles.icon}>{icon}</Text> : null}

        <TextInput
          placeholderTextColor={colors.muted}
          style={[styles.input, {color: colors.text}, style]}
          autoCapitalize="none"
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '600',
  },
  container: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
});