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
import {validateRegisterForm} from '../../utils/validators';
import {formatFirebaseAuthError} from '../../utils/formatters';

const registerImage = require('../../assets/images/register.png');

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen = ({navigation}: Props) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
  } = useAuthForm();

  const {register} = useAuthContext();
  const {colors} = useThemeMode();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const validationError = validateRegisterForm(
      name,
      email,
      password,
      confirmPassword,
    );

    if (validationError) {
      Alert.alert('Validación', validationError);
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password);
    } catch (error: any) {
      Alert.alert('Registro', formatFirebaseAuthError(error?.code));
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
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <AuthHeader
            imageSource={registerImage}
            title="Sign Up to Explore"
            subtitle="Crea tu cuenta y empieza a construir tu galería inteligente de lugares."
          />

          <AppInput
            icon="👤"
            label="Nombre"
            placeholder="Paúl Terán"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppInput
            icon="✅"
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <AppButton
            title="Crear cuenta"
            onPress={handleRegister}
            loading={loading}
          />

          <Pressable onPress={() => navigation.goBack()} style={styles.footer}>
            <Text style={[styles.footerText, {color: colors.muted}]}>
              ¿Ya tienes cuenta?{' '}
              <Text style={{color: colors.brand, fontWeight: '800'}}>
                Iniciar sesión
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
    borderRadius: 34,
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
  },
});