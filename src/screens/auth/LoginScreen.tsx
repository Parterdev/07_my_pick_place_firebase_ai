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
import {AppInput} from '../../components/AppInput';
import {AppButton} from '../../components/AppButton';
import {useAuthContext} from '../../context/AuthContext';
import {useAuthForm} from '../../hooks/useAuthForm';
import {useThemeMode} from '../../hooks/useThemeMode';
import {validateLoginForm, isValidEmail} from '../../utils/validators';
import {formatFirebaseAuthError} from '../../utils/formatters';

const loginImage = require('../../assets/images/login.png');

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen = ({navigation}: Props) => {
  const {email, password, setEmail, setPassword} = useAuthForm();
  const {login, forgotPassword} = useAuthContext();
  const {colors} = useThemeMode();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const validationError = validateLoginForm(email, password);

    if (validationError) {
      Alert.alert('Validación', validationError);
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Inicio de sesión', formatFirebaseAuthError(error?.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    navigation.navigate('ForgotPassword');
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
            emoji="🧳"
            title="Login to MyPickPlace"
            subtitle="Accede para guardar tus lugares favoritos y descubrir nuevas experiencias."
            imageSource={loginImage}
          />

          <AppInput
            icon="✉️"
            label="Correo electrónico"
            placeholder="tuemail@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <AppInput
            icon="🔒"
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable onPress={handleForgotPassword} style={styles.forgot}>
            <Text style={[styles.forgotText, {color: colors.brand}]}>
              ¿Olvidaste tu contraseña?
            </Text>
          </Pressable>

          <AppButton
            title="Iniciar sesión"
            onPress={handleLogin}
            loading={loading}
          />

          {/* <View style={styles.dividerRow}>
            <View style={[styles.line, {backgroundColor: colors.border}]} />
            <Text style={[styles.dividerText, {color: colors.muted}]}>
              o continúa luego con
            </Text>
            <View style={[styles.line, {backgroundColor: colors.border}]} />
          </View>

          <View style={styles.socialRow}>
            <View style={[styles.socialButton, {borderColor: colors.border}]}>
              <Text style={styles.socialIcon}>G</Text>
            </View>
            <View style={[styles.socialButton, {borderColor: colors.border}]}>
              <Text style={styles.socialIcon}>f</Text>
            </View>
          </View> */}

          <Pressable
            onPress={() => navigation.navigate('Register')}
            style={styles.footer}>
            <Text style={[styles.footerText, {color: colors.muted}]}>
              ¿No tienes cuenta?{' '}
              <Text style={{color: colors.brand, fontWeight: '800'}}>
                Crear cuenta
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
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  line: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    marginHorizontal: 10,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  socialButton: {
    width: 54,
    height: 44,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    fontSize: 18,
    fontWeight: '900',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
});