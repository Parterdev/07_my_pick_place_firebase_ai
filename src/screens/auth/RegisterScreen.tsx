import React, {useState} from 'react';
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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppButton} from '../../components/AppButton';
import {AppInput} from '../../components/AppInput';
import {imageAssets} from '../../assets/images';
import {useAuthContext} from '../../context/AuthContext';
import {useAuthForm} from '../../hooks/useAuthForm';
import {useThemeMode} from '../../hooks/useThemeMode';
import {AuthStackParamList} from '../../types/navigation';
import {formatFirebaseAuthError} from '../../utils/formatters';
import {validateRegisterForm} from '../../utils/validators';
import { typography } from '../../theme/typography';

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
      await register(name.trim(), email.trim(), password);
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={[styles.card, {backgroundColor: colors.card}]}>
          <View style={[styles.imageHeader, {backgroundColor: colors.input}]}>
            <Image
              source={imageAssets.registerIcon}
              style={styles.headerImage}
            />
          </View>

          <View style={styles.formContent}>
            <Text style={[styles.title, {color: colors.title}]}>
              Crea tu cuenta
            </Text>

            <Text style={[styles.subtitle, {color: colors.muted}]}>
              Empieza tu bitácora personal y guarda tus experiencias favoritas.
            </Text>

            <AppInput
              iconElement={
                <FontAwesome name="user" size={18} color={colors.brand} />
              }
              label="Nombre *"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <AppInput
              iconElement={
                <FontAwesome
                  name="circle-check"
                  size={18}
                  color={colors.brand}
                />
              }
              label="Confirmar contraseña *"
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

            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.footer}>
              <Text style={[styles.footerText, {color: colors.muted}]}>
                ¿Ya tienes cuenta?{' '}
                <Text style={{color: colors.brand, fontFamily: typography.fontFamily.black}}>
                  Iniciar sesión
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
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: '76%',
    height: '76%',
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
  footer: {
    marginTop: 22,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    textAlign: 'center',
  },
});