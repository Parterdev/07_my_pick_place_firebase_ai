import React, {createContext, ReactNode, useEffect, useMemo, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {darkColors, lightColors} from '../theme/colors';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: typeof lightColors;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

const THEME_STORAGE_KEY = '@mypickplace/theme-mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({children}: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const loadStoredTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (storedTheme === 'light' || storedTheme === 'dark') {
          setMode(storedTheme);
        }
      } catch (error) {
        console.error('[ThemeContext] Error cargando tema:', error);
      } finally {
        setThemeLoaded(true);
      }
    };

    loadStoredTheme();
  }, []);

  const setThemeMode = async (nextMode: ThemeMode) => {
    try {
      setMode(nextMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
    } catch (error) {
      console.error('[ThemeContext] Error guardando tema:', error);
    }
  };

  const toggleTheme = () => {
    const nextMode: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  const value = useMemo(
    () => ({
      mode,
      isDark: mode === 'dark',
      colors: mode === 'dark' ? darkColors : lightColors,
      toggleTheme,
      setThemeMode,
    }),
    [mode],
  );

  if (!themeLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};