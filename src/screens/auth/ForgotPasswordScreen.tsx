import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../types/navigation';
import {AuthHeader} from '../../components/AuthHeader';
import {AppButton} from '../../components/AppButton';
import {AppInput} from '../../components/AppInput';
import {useAuthContext} from '../../context/AuthContext';
import {useThemeMode} from '../../hooks/useThemeMode';
import {formatFirebaseAuthError} from '../../utils/formatters';
import {isValidEmail} from '../../utils/validators';
import {imageAssets} from '../../assets/images';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen = ({navigation}: Props) => {
  const {colors} = useThemeMode();
  const {forgotPassword} = useAuthContext();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Validación', 'Ingresa un correo electrónico válido.');
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      Alert.alert(
        'Correo enviado',
        'Te enviamos un enlace para restablecer tu contraseña.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        'Recuperar contraseña',
        formatFirebaseAuthError(error?.code),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor: colors.background}]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.card, {backgroundColor: colors.card}]}>
          <AuthHeader
            imageSource={imageAssets.register}
            title="Recupera tu acceso"
            subtitle="Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña."
          />

          <AppInput
            icon="✉️"
            label="Correo electrónico"
            placeholder="tuemail@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppButton
            title="Enviar enlace"
            onPress={handleResetPassword}
            loading={loading}
          />

          <Pressable onPress={() => navigation.goBack()} style={styles.footer}>
            <Text style={[styles.footerText, {color: colors.muted}]}>
              ¿Recordaste tu contraseña?{' '}
              <Text style={{color: colors.brand, fontWeight: '800'}}>
                Volver al login
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 22,
  },
  card: {
    borderRadius: 32,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 10},
    elevation: 5,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
  },
});