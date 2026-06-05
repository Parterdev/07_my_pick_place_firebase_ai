import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome-free-solid';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { imageAssets } from '../../assets/images';
import { useAuthContext } from '../../context/AuthContext';
import { useAuthForm } from '../../hooks/useAuthForm';
import { useThemeMode } from '../../hooks/useThemeMode';
import { AuthStackParamList } from '../../types/navigation';
import { formatFirebaseAuthError } from '../../utils/formatters';
import { validateLoginForm } from '../../utils/validators';
import { typography } from '../../theme/typography';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const { colors } = useThemeMode();
  const { login } = useAuthContext();

  const { email, password, setEmail, setPassword } = useAuthForm();

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const validationMessage = validateLoginForm(email, password);

    if (validationMessage) {
      Alert.alert('Validación', validationMessage);
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (error: any) {
      Alert.alert('Inicio de sesión', formatFirebaseAuthError(error?.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={[styles.imageHeader, { backgroundColor: colors.input }]}>
            <Image
              source={imageAssets.paperMapIcon}
              style={styles.headerImage}
            />
          </View>

          <View style={styles.formContent}>
            <Text style={[styles.title, { color: colors.title }]}>
              Inicia sesión
            </Text>

            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Accede a tu galería personal y continúa guardando experiencias
              memorables.
            </Text>

            <AppInput
              iconElement={
                <FontAwesome name="envelope" size={18} color={colors.brand} />
              }
              label="Correo electrónico *"
              placeholder="tuemail@correo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppInput
              iconElement={
                <FontAwesome name="lock" size={18} color={colors.brand} />
              }
              label="Contraseña *"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable onPress={handleForgotPassword} style={styles.forgot}>
              <Text style={[styles.forgotText, { color: colors.brand }]}>
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>

            <AppButton
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
            />

            <Pressable
              onPress={() => navigation.navigate('Register')}
              style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.muted }]}>
                ¿Aún no tienes cuenta?{' '}
                <Text style={{ color: colors.brand, fontFamily: typography.fontFamily.black }}>
                  Crear cuenta
                </Text>
              </Text>
            </Pressable>
          </View>
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
    borderRadius: 34,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 10},
    elevation: 5,
  },
  imageHeader: {
    width: '100%',
    height: 172,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: '82%',
    height: '82%',
    resizeMode: 'contain',
  },
  formContent: {
    padding: 22,
  },
  title: {
    fontSize: 30,
    fontFamily: typography.fontFamily.black,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  forgot: {
    alignItems: 'flex-end',
    marginTop: -2,
    marginBottom: 18,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.extraBold,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
});