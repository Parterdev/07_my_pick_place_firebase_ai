import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { useAuthContext } from '../../context/AuthContext';
import { useThemeMode } from '../../hooks/useThemeMode';

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuthContext();
  const { colors } = useThemeMode();

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.kicker, { color: colors.brand }]}>
          MyPickPlace
        </Text>

        <Text style={[styles.title, { color: colors.text }]}>
          Hola, {user?.displayName || 'explorador'} 👋
        </Text>

        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Guarda lugares nuevos, revive tus experiencias y descubre sitios similares cerca de ti.
        </Text>

        <View style={[styles.heroCard, { backgroundColor: colors.card }]}>
          <Text style={styles.heroEmoji}>📸📍</Text>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Captura tu próximo lugar
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.muted }]}>
            En la siguiente etapa guardaremos foto, ubicación y recomendaciones inteligentes.
          </Text>

          <AppButton
            title="Capturar lugar"
            onPress={() => navigation.navigate('CapturePlace')}
          />
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Text style={styles.infoEmoji}>📍</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.title }]}>
              Tu primera experiencia
            </Text>
            <Text style={[styles.infoSubtitle, { color: colors.muted }]}>
              Captura un lugar y aparecerá automáticamente en tu galería.
            </Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <Text style={styles.metricEmoji}>🖼️</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>0</Text>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>Lugares</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
            <Text style={styles.metricEmoji}>✨</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>IA</Text>
            <Text style={[styles.metricLabel, { color: colors.muted }]}>Próximo</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 22,
    paddingBottom: 40,
  },
  kicker: {
    fontSize: 14,
    fontWeight: '900',
    marginTop: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  heroCard: {
    borderRadius: 32,
    padding: 24,
    marginTop: 26,
  },
  heroEmoji: {
    fontSize: 54,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 18,
  },
  metricCard: {
    flex: 1,
    borderRadius: 24,
    padding: 18,
    alignItems: 'center',
  },
  metricEmoji: {
    fontSize: 28,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  infoCard: {
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  infoEmoji: {
    fontSize: 34,
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  infoSubtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
});